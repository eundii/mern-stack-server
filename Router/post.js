const express = require("express");
const multer = require("multer");
const router = express.Router();

const { Post } = require("../Model/Post.js");
const { Counter } = require("../Model/Counter.js");

router.post("/submit", (req, res) => {
  let temp = req.body;
  // Counter 모델에서 postNum을 찾기
  // find에는 조건을 걸 수 있다. 조건은 name이 counter 인 것(MongoDB에서 insertDocument로 넣음)
  Counter.findOne({ name: "counter" })
    .exec()
    .then((counter) => {
      // 받아온 데이터에 counter의 postNum을 넣어준다.
      temp.postNum = counter.postNum;
      // 그 다음 DB에 저장하기
      const CoummunityPost = new Post(temp);
      CoummunityPost.save()
        .then(() => {
          // postNum을 1 증가시켜야함
          // MongoDB에서 하나의 document를 업데이트 시키려면 updateOne 명령어 사용(쿼리 2개 받음)
          // 첫번째 쿼리에는 어떤document를 업데이트 할지, 두번째는 어떻게 업데이트 할건지
          // 쿼리문에서 증가시키는 기능은 $inc 사용(postNum을 1만큼 증가)
          Counter.updateOne({ name: "counter" }, { $inc: { postNum: 1 } }).then(
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

router.post("/list", (req, res) => {
  // MongoDB에서 document를 찾는 명령어 : find
  // find 명령어가 끝나면(exec) 찾은 명령어(doc)
  Post.find()
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

router.post("/detail", (req, res) => {
  Post.findOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ success: true, post: doc });
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

router.post("/delete", (req, res) => {
  Post.deleteOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then((doc) => {
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "image/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false });
    } else {
      res.status(200).json({ success: true, filePath: res.req.file.path });
    }
  });
});

module.exports = router;
