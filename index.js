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

app.post("/api/test", (req, res) => {
  const CoummunityPost = new Post({ title: "test", content: "테스트입니다!" });
  CoummunityPost.save().then(() => {
    res.status(200).json({ success: true });
  });
});
