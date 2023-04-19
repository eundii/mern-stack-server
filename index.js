const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

// key 불러오기
const config = require("./config/key.js");

app.use(express.static(path.join(__dirname, "../client/build")));

// express에게 image 폴더를 사용하겠다고 선언해주기
app.use("/image", express.static("./image"));

// client에서 보내는 body에 대한 명령어를 추적할 수 있게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 공통적으로 사용하는 /api/post 부분을 빼주고 나머지를 post.js 에서 불러옴
app.use("/api/post", require("./Router/post.js"));

// 서버 열기
app.listen(port, () => {
  // 서버가 열리면 몽구스 디비를 연결
  mongoose
    .connect(config.mongoURI)
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
