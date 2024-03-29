const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.login = (req, res, next) => {
  const email = req.body.email;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        res.status(401).json({
          errors: ["A user with this email could not be found."],
        });
        throw error;
      }
      loadedUser = user;
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );
      res.status(200).json({
        token: token,
        user: {
          id: loadedUser._id.toString(),
          name: loadedUser.name,
          startedAt: loadedUser.startedAt,
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.validJWT = (req, res, next) => {
  const token = req.body.token;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    res.status(401).json({
      valid: false,
    });
  } else {
    res.status(200).json({
      valid: true,
    });
  }
  next();
};

exports.getRole = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        message: "This user doesn't exist in the database, Try to login again!",
      });
    }
    res
      .status(200)
      .json({ message: "Role found successfuly!", role: user.role });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAllEditors = async (req, res, next) => {
  try {
    const allEditors = await User.find().sort("name");
    res.status(200).json({
      message: "Editors fetched Successfuly!",
      editors: allEditors.map((editor) => ({
        id: editor._id,
        name: editor.name,
        startedAt: editor.startedAt,
      })),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
