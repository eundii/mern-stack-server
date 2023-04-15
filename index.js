const express = require("express");
const path = require("path");
// 몽구스 디비 선언
const mongoose = require("mongoose");

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "../client/build")));
// client에서 보내는 body에 대한 명령어를 추적할 수 있게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 서버 열기
app.listen(port, () => {
  // 서버가 열리면 몽구스 디비를 연결
  mongoose
    .connect(
      "mongodb+srv://eundii:1q2w3e4r@eundii.cqizn6z.mongodb.net/?retryWrites=true&w=majority"
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

// 서버에서도 구현
app.post("/api/test", (req, res) => {
  console.log(req.body);
  // 요청 성공시 클라이언트에게 json타입으로 값을 보내줄 수 있음
  res.status(200).json({ success: true });
});
