const mathjs = require("mathjs");
const { google } = require("googleapis");
const invoicesIndices = require("../utils/currentInvoicesIndices");

const Item = require("../models/item");
const Event = require("../models/event");

const addEvent = require("./events").addEventService;

const datesAreOnSameDay = (first, second) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

const updateDaysArrayWithItem = (daysArr, item) => {
  let exists = false;
  for (const dayItem of daysArr) {
    if (
      datesAreOnSameDay(dayItem.day, item.lifeCycle.doneAt) &&
      dayItem.eventName === item.event.name &&
      dayItem.type === item.type
    ) {
      exists = true;
      dayItem.noItems += 1;
      dayItem.items.push(item.value);
      dayItem.price = mathjs.number(
        mathjs.add(
          mathjs.bignumber(dayItem.price),
          mathjs.bignumber(item.price)
        )
      );
      break;
    }
  }
  if (!exists) {
    daysArr.push({
      day: item.lifeCycle.doneAt,
      eventName: item.event.name,
      type: item.type,
      noItems: 1,
      items: [item.value],
      price: item.price,
    });
  }
};

const colorIsRed = (color) => {
  return color.red === 1 && !color.blue && !color.green;
};

const colorIsCyan = (color) => {
  return color.green === 1 && color.blue === 1 && !color.red;
};

exports.getItemsByMonth = async (req, res, next) => {
  const month = req.query.month;
  const editorId = req.query.userId;
  try {
    const items = await Item.find({
      editor: editorId,
      done: true,
      "invoicesIndices.month": month,
    })
      .populate({
        path: "event",
        select: "name",
      })
      .sort({ "lifeCycle.doneAt": 1 });
    let daysItems = [];
    if (items.length !== 0) {
      for (const item of items) {
        updateDaysArrayWithItem(daysItems, item);
      }
    }

    res.status(200).json({
      message: "Items were fetched successfully!",
      items: daysItems,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.markItemsDone = async (req, res, next) => {
  const event = req.body.event;
  const type = req.body.type;
  const itemsValuesArray = req.body.itemsValuesArray;
  const editorId = req.userId;

  let nonExistentItems = { event, type, itemsValues: [] };
  let duplicateItems = { event, type, itemsValues: [] };
  let itemsMarkedDone = [];

  for (const itemValue of itemsValuesArray) {
    const submittedItem = {
      event: event.id,
      type,
      value: itemValue,
    };
    try {
      let item = await Item.findOne(submittedItem);

      if (!item && type !== "Project") {
        nonExistentItems.itemsValues.push(itemValue);
        continue;
      }

      if (!item && type === "Project") {
        const eventDoc = await Event.findById(event.id);
        await eventDoc.updatePeriod(itemValue.toLowerCase());
        await eventDoc.save();
        item = await Item.create({
          ...submittedItem,
          lifeCycle: { createdAt: new Date() },
        });
      }

      if (item.done) {
        duplicateItems.itemsValues.push(itemValue);
        continue;
      }

      await item.markAsDone(editorId);
      const updatedItem = await item.save();
      itemsMarkedDone.push({
        id: updatedItem._id,
        event: event.name,
        value: updatedItem.value,
        type: updatedItem.type,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  }

  if (
    nonExistentItems.itemsValues.length === 0 &&
    duplicateItems.itemsValues.length === 0
  ) {
    res.status(201).json({
      message: "Items have been marked as done successfully",
      itemsMarkedDone: itemsMarkedDone,
    });
  } else {
    res.status(207).json({
      message:
        "Some or all items submitted were not marked as done successfully",
      itemsMarkedDone: itemsMarkedDone,
      duplicateItems: duplicateItems,
      nonExistentItems: nonExistentItems,
    });
  }
};

exports.search = async (req, res, next) => {
  const { eventStr, type, itemsStr } = req.query;
  const event = JSON.parse(eventStr);

  let findFilter = {
    event: event.id,
    type: { $in: type === "" ? ["XC", "SJ", "Project"] : [type] },
  };

  if (itemsStr !== "") {
    findFilter = {
      ...findFilter,
      value: {
        $in: itemsStr.split(/[\s-]+/).map((value) => new RegExp(value)),
      },
    };
  }

  try {
    const results = await Item.find(findFilter).populate([
      {
        path: "event",
        select: "name",
      },
      {
        path: "editor",
        select: "name",
      },
    ]);

    if (!results) {
      res.status(404).json({ message: "failed to search" });
    }

    res.status(200).json({
      message: "Successful Search",
      results: results.map((result) => ({
        id: result._id,
        eventName: result.event.name,
        type: result.type,
        itemValue: result.value,
        done: result.done,
        editor: result.editor.name,
      })),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    console.log(err);
    next(err);
  }
};

exports.getItems = async (req, res, next) => {
  const items = await Item.find();
  if (!items) {
    res.status(404).json({ message: "nothing" });
  }
  let vas = [];
  for (const item of items) {
    vas.push(await item.updateItemPrice());
  }
  res.status(200).json({
    message: "here",
    items: vas,
  });
  //invoicesIndices.setMonth("August 2021");
  //res.status(200).json({ month: invoicesIndices.getMonth() });
};

exports.sync = async (req, res, next) => {
  const userToken = req.body.token;
  const auth = new google.auth.GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1dlDPWynX7nxRJTS2nZ0GliGlIDXhYKILCEukt8C2NAE";

  //Create proper indices json
  const headerRow = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Orders!1:1",
  });
  const headerRowValues = headerRow.data.values[0];

  const indices = {
    timestamp: headerRowValues.indexOf("Timestamp"),
    eventName: headerRowValues.indexOf("Event Name"),
    horseNo: headerRowValues.indexOf("Horse Number"),
    type: headerRowValues.indexOf("Type"),
  };

  //Creating a proper range
  const aColumn = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Orders!A:A",
  });

  const numOfRows = aColumn.data.values.length;

  const range = `Orders!A${numOfRows - 500}:${String.fromCharCode(
    65 + indices.type
  )}${numOfRows}`;

  const spreadSheet = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
    ranges: [range],
    includeGridData: true,
  });

  const sheetRows = spreadSheet.data.sheets[0].data[0].rowData;

  let newVideos = [];

  console.log("in loop");

  for (const row of sheetRows) {
    const timestamp = row.values[indices.timestamp].formattedValue || "";
    const eventName = row.values[indices.eventName].formattedValue;
    const horseNo = {
      value: row.values[indices.horseNo].formattedValue,
      bgColor: row.values[indices.horseNo].effectiveFormat.backgroundColor,
    };
    const type = {
      value: row.values[indices.type].formattedValue || "XC",
      bgColor: row.values[indices.type].effectiveFormat.backgroundColor,
    };

    //Check if order is admissble
    //Ignore if order in red or cyan
    if (
      !eventName ||
      colorIsRed(horseNo.bgColor) ||
      new RegExp("#N/A|#REF!").test(horseNo.value) ||
      !horseNo.value
    ) {
      continue;
    }

    //Check if event is in the database

    let event = await Event.findOne({
      name: eventName,
    });

    if (!event) {
      //If event is not in the database add it
      const season = eventName.slice(-4);
      if (!isNaN(season)) {
        //event = newEvent;

        event = await addEvent(season, eventName);
        //console.log("added", event.name);
      } else {
        continue;
      }
    }

    const xcStr = "XC|INQUIRIES|TEAM|CHASE|HUNTER|TRIALS".toLowerCase();
    const sjStr = "SJ".toLowerCase();

    //Create types array
    let types = type.value
      .split(" & ")
      .filter((word) => {
        if (
          new RegExp(sjStr).test(word.toLowerCase()) &&
          colorIsRed(type.bgColor)
        )
          return false;
        return new RegExp(xcStr + "|" + sjStr).test(word.toLowerCase());
      })
      .map((word) =>
        new RegExp(xcStr).test(word.toLowerCase()) ? "XC" : "SJ"
      );

    let video = {
      event: event._id,
      value: horseNo.value,
      lifeCycle: {
        createdAt: Date.parse(timestamp) ? new Date(timestamp) : new Date(),
      },
    };

    //Loop over types array
    for (const type of types) {
      let item = await Item.findOne({
        event: video.event,
        value: video.value,
        type,
      });
      //Ignore if the video is in the database
      if (!item) {
        //If the video not in the database add to the ddb
        item = new Item({ ...video, type });

        newVideos.push({ ...video, type });
        item = await item.save();
      }
      if (colorIsCyan(horseNo.bgColor)) {
        item.deactivate();
        await item.save();
      }
    }
  }
  console.log("Out of loop");

  res.json({
    message: "got them",
    num: newVideos.length,
    vids: newVideos,
  });
};

exports.refactoringSync = async (req, res, next) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./configs/sheetsCredentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1dlDPWynX7nxRJTS2nZ0GliGlIDXhYKILCEukt8C2NAE";

  //Create proper indices json
  const headerRow = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Orders!1:1",
  });
  const headerRowValues = headerRow.data.values[0];

  const indices = {
    timestamp: headerRowValues.indexOf("Timestamp"),
    eventName: headerRowValues.indexOf("Event Name"),
    horseNo: headerRowValues.indexOf("Horse Number"),
    type: headerRowValues.indexOf("Type"),
  };

  //Creating a proper range
  const aColumn = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Orders!A:A",
  });

  const numOfRows = aColumn.data.values.length;

  const range = `Orders!A${numOfRows - 500}:${String.fromCharCode(
    65 + indices.type
  )}${numOfRows}`;

  const spreadSheet = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
    ranges: [range],
    includeGridData: true,
  });

  const sheetRows = spreadSheet.data.sheets[0].data[0].rowData.map((row) => ({
    timestamp: row.values[indices.timestamp].formattedValue || "",
    eventName: row.values[indices.eventName].formattedValue,
    horseNo: {
      value: row.values[indices.horseNo].formattedValue,
      bgColor: row.values[indices.horseNo].effectiveFormat.backgroundColor,
    },
    type: {
      value: row.values[indices.type].formattedValue || "XC",
      bgColor: row.values[indices.type].effectiveFormat.backgroundColor,
    },
  }));

  const admissbleRows = sheetRows.filter((row) => {
    const { timestamp, eventName, horseNo, type } = row;
    if (
      !eventName ||
      colorIsRed(horseNo.bgColor) ||
      new RegExp("#N/A|#REF!").test(horseNo.value) ||
      !horseNo.value
    ) {
      return false;
    }
    return true;
  });

  //console.log(admissbleRows[490]);

  const events = await Promise.all(
    admissbleRows.map(({ eventName }) => {
      return Event.findOne(
        {
          name: eventName,
        },
        "-_id name"
      );
    })
  );
  console.log("Out of loop");

  const nonExistentEvents = events
    .map((event, index) => {
      if (!event) return admissbleRows[index].eventName;
    })
    .filter((event, index, self) => self.indexOf(event) === index)
    .filter((event) => (!event ? false : true));

  res.json({
    message: "got them",
    num: nonExistentEvents.length,
    vids: nonExistentEvents,
  });
};

exports.endWeek = (req, res, next) => {
  invoicesIndices.setWeek(invoicesIndices.getWeek() + 1);
  res.status(200).json({
    message: "Week ended succesfully",
    newWeek: invoicesIndices.getWeek(),
  });
};

exports.endMonth = (req, res, next) => {
  const pastMonthDate = new Date(invoicesIndices.getMonth());
  const [month, year] = [pastMonthDate.getMonth(), pastMonthDate.getFullYear()];
  const currentMonthDate = new Date(
    year + Math.floor((month + 1) / 12),
    (month + 1) % 12,
    1
  );
  invoicesIndices.setMonth(
    currentMonthDate.toLocaleString("en-us", { month: "long", year: "numeric" })
  );
  res.status(200).json({
    message: "Month ended succesfully",
    newMonth: invoicesIndices.getMonth(),
  });
};
