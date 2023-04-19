const express = require("express");
const router = express.Router();

const { User } = require("../Model/User.js");
const { Counter } = require("../Model/Counter.js");

router.post("/register", (req, res) => {
  let temp = req.body;
  Counter.findOne({ name: "counter" }).then((doc) => {
    temp.userNum = doc.userNum;

    const userData = new User(req.body);
    userData
      .save()
      .then(() => {
        Counter.updateOne({ name: "counter" }, { $inc: { usuerNum: 1 } }).then(
          () => {
            res.status(200).json({ success: true });
          }
        );
      })
      .catch((error) => {
        res.status(400).json({ success: false });
      });
  });
});

module.exports = router;
