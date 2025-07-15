const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json()); // ✅ JSON 파싱 미들웨어
app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱

const port = 8080;

// 팀 초기화
let teams = [
  "Case by Case",
  "H2O",
  "God Hand",
  "Prod. God",
  "선교 감영병 Now",
  "마인드브릿지",
  "Supernova",
  "오감자",
  "La Ruelle",
  "ZZzzzapening",
  "요리보고 조리보고 둘리번 둘리번",
  "띠부피부",
  "동물을 11(구)하라!",
  "Crime in all of the Earth",
  "Onlight",
  "극 I 탈출 프로젝트",
  "Brand New Warri",
  "PD Team",
  "포옹법",
  "영신"
].map((name) => ({
  name,
  q: 0,
  t: 0,
  f: 0,
}));

// 점수 추가 API (1점 단위, 항목 지정)
app.post("/api/teams/add", (req, res) => {
  const { name, field, points } = req.body;
  const team = teams.find((t) => t.name === name);
  if (!team || !["q", "t", "f"].includes(field)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  team[field] += points;
  io.emit("scoreUpdated", { teams, changedTeam: name });
  res.json({ success: true });
});


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// EJS 세팅
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 페이지 라우팅
app.get("/", (req, res) => {
	res.render("index");
});

app.get("/display", (req, res) => {
	res.render("display");
});

app.get("/control", (req, res) => {
	res.render("control");
});


// 초기 점수 데이터 요청 (필요 시)
app.get("/api/teams", (req, res) => {
	res.json(teams);
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
