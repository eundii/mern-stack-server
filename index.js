const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// Post 모델 사용을 위해 불러오기
const { Post } = require("./Model/Post.js");

app.use(express.static(path.join(__dirname, "../client/build")));
// client에서 보내는 body에 대한 명령어를 추적할 수 있게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버 열기
app.listen(port, () => {
  // 서버가 열리면 몽구스 디비를 연결
  mongoose
    .connect(
      "mongodb+srv://eundii:1q2w3e4r@eundii.cqizn6z.mongodb.net/Community?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log(
        `Example app listening on port ${port}, http://localhost:${port}`
      );
      console.log("DB 연결 완료!");
    })
    .catch((error) => {
      console.log(error);
    });
});

// 서버 기능 구성
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.post("/api/post/submit", (req, res) => {
  let temp = req.body;
  const CoummunityPost = new Post(temp);
  CoummunityPost.save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      res.status(400).json({ success: false });
    });
});

app.post("/api/post/list", (req, res) => {
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
