const mathjs = require("mathjs");
const { google } = require("googleapis");
const invoicesIndices = require("../utils/currentInvoicesIndices");

const Item = require("../models/item");
const Event = require("../models/event");

const addEvent = require("./events").addEventService;
const item = require("../models/item");

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

const updateEventsArrayWithItem = (eventsArr, item) => {
  let exists = false;
  for (const eventItem of eventsArr) {
    if (
      eventItem.eventName === item.event.name &&
      eventItem.type === item.type
    ) {
      exists = true;
      eventItem.noItems += 1;
      eventItem.items.push(item.value);
      eventItem.price = mathjs.number(
        mathjs.add(
          mathjs.bignumber(eventItem.price),
          mathjs.bignumber(item.price)
        )
      );
      break;
    }
  }
  if (!exists) {
    eventsArr.push({
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

exports.getItemsByWeek = async (req, res, next) => {
  const week = req.query.week;
  try {
    const items = await Item.find({
      done: true,
      "invoicesIndices.week": week,
    })
      .populate({
        path: "event",
        select: "name",
      })
      .sort({ "lifeCycle.doneAt": 1 });
    let eventsItems = [];
    if (items.length !== 0) {
      for (const item of items) {
        updateEventsArrayWithItem(eventsItems, item);
      }
    }

    res.status(200).json({
      message: "Items were fetched successfully!",
      items: eventsItems,
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
      if (type === "Project") {
        const eventDoc = await Event.findById(event.id);
        console.log("found event successfully");

        if (!item) {
          await eventDoc.updatePeriod(itemValue.toLowerCase());
          await eventDoc.save();
          item = await Item.create({
            ...submittedItem,
            lifeCycle: { createdAt: new Date() },
          });
        }
        let today = new Date();

        if (
          eventDoc.period.endDate < new Date(today.setDate(today.getDate() + 1))
        ) {
          await eventDoc.activate();
          await eventDoc.save();
        }
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
    const results = await Item.find(findFilter)
      .populate([
        {
          path: "event",
          select: "name",
        },
        {
          path: "editor",
          select: "name",
        },
      ])
      .sort({ done: 1, "lifeCycle.addedAt": 1 });

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
        editor: result.editor ? result.editor.name : "",
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

exports.getWeek = (req, res, next) => {
  res.status(200).json({
    message: "Week fetched succesfully",
    week: invoicesIndices.getWeek(),
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

exports.sync = async (req, res, next) => {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: "https://www.googleapis.com/auth/spreadsheets.readonly",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "1dlDPWynX7nxRJTS2nZ0GliGlIDXhYKILCEukt8C2NAE";

    //Create proper indices json
    const [headerRow, bColumn] = await Promise.all([
      googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Orders!1:1",
      }),
      googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Orders!B:B",
      }),
    ]);

    const headerRowValues = headerRow.data.values[0];

    const indices = {
      timestamp: headerRowValues.indexOf("Timestamp"),
      eventName: headerRowValues.indexOf("Event Name"),
      horseNo: headerRowValues.indexOf("Horse Number"),
      type: headerRowValues.indexOf("Type"),
    };

    const numOfRows = bColumn.data.values.length;

    const range = `Orders!A${
      numOfRows - Number(process.env.NUM_OF_ROWS_TO_SYNC)
    }:${String.fromCharCode(65 + indices.type)}${numOfRows}`;

    const spreadSheet = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
      ranges: [range],
      includeGridData: true,
    });

    const admissbleRows = spreadSheet.data.sheets[0].data[0].rowData.flatMap(
      (row) => {
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
        if (
          !eventName ||
          colorIsRed(horseNo.bgColor) ||
          new RegExp("#N/A|#REF!").test(horseNo.value) ||
          !horseNo.value
        ) {
          return [];
        }
        return [{ timestamp, eventName, horseNo, type }];
      }
    );

    const distinctEvents = admissbleRows.flatMap((uRow, index, self) =>
      index === self.findIndex((lRow) => lRow.eventName === uRow.eventName)
        ? [uRow.eventName]
        : []
    );

    const dbEvents = await Promise.all(
      distinctEvents.map((eventName) => {
        return Event.findOne({
          name: eventName,
        });
      })
    );

    const eventsToAdd = dbEvents.flatMap((event, index) => {
      if (!event) {
        const eventName = distinctEvents[index];
        if (!isNaN(eventName.slice(-4))) return distinctEvents[index];
      }
      return [];
    });

    const newEvents = await Promise.all(
      eventsToAdd.map((eventName) => {
        return addEvent(eventName.slice(-4), eventName);
      })
    );

    const eventsNamesToObjs = distinctEvents.reduce(
      (totalObj, eventName, index) => {
        if (dbEvents[index]) {
          return { ...totalObj, [eventName]: dbEvents[index] };
        } else {
          return {
            ...totalObj,
            [eventName]: newEvents[eventsToAdd.indexOf(eventName)],
          };
        }
      },
      {}
    );

    const xcStr = process.env.XC_STR.toLowerCase();
    const sjStr = process.env.SJ_STR.toLowerCase();

    const cleanRows = admissbleRows.flatMap((row) => {
      const { timestamp, eventName, horseNo, type } = row;

      let video = {
        eventName,
        eventId: eventsNamesToObjs[eventName]._id,
        horseNo,
        lifeCycle: {
          createdAt: Date.parse(timestamp) ? new Date(timestamp) : new Date(),
        },
      };
      //Create types array
      let finalVideos = [];
      if (new RegExp(xcStr).test(type.value.toLowerCase())) {
        finalVideos.push({ ...video, type: "XC" });
      }
      if (
        new RegExp(sjStr).test(type.value.toLowerCase()) &&
        !colorIsRed(type.bgColor)
      ) {
        finalVideos.push({ ...video, type: "SJ" });
      }
      return finalVideos;
      // return type.value
      //   .split(" & ")
      //   .filter((word) => {
      //     if (
      //       new RegExp(sjStr).test(word.toLowerCase()) &&
      //       colorIsRed(type.bgColor)
      //     )
      //       return false;
      //     return new RegExp(xcStr + "|" + sjStr).test(word.toLowerCase());
      //   })
      //   .map((word) =>
      //     new RegExp(xcStr).test(word.toLowerCase())
      //       ? { ...video, type: "XC" }
      //       : { ...video, type: "SJ" }
      //   );
    });

    const dbVideos = await Promise.all(
      cleanRows.map((row) =>
        Item.findOne({
          event: row.eventId,
          value: row.horseNo.value,
          type: row.type,
        })
      )
    );

    let numOfCyansInDB = 0;

    const newVideos = await Promise.all(
      cleanRows.flatMap((row, index) => {
        if (colorIsCyan(row.horseNo.bgColor) || !dbVideos[index]) {
          const item =
            dbVideos[index] ||
            new Item({
              event: row.eventId,
              type: row.type,
              value: row.horseNo.value,
              lifeCycle: row.lifeCycle,
            });
          if (
            colorIsCyan(row.horseNo.bgColor) ||
            !eventsNamesToObjs[row.eventName].active
          ) {
            numOfCyansInDB += dbVideos[index] ? 1 : 0;
            item.deactivate();
          }
          return item.save();
        }
        return [];
      })
    );

    res.status(200).json({
      message: "Syncing with the sheet was succesful",
      newVideosCount: newVideos.length - numOfCyansInDB,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
