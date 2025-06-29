const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

let teams = [
	"석다정 DAJEONG SEOK",
	"조케이든 CAYDEN CHO",
	"모예찬 YECHAN MO",
	"김효주 HYOJU KIM",
	"김규진 KYUJIN KIM",
	"이서현 SEOHYUN LEE",
	"정승민 SEUNGMIN JUNG",
	"윤예진 YEJIN YOON",
	"이승언 SEUNGEON LEE",
	"임예현 YEHYUN LIM",
	"김준우 JUNWOO KIM",
].map((name) => ({
	name,
	score: 0,
}));

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

// 점수 추가 API
app.post("/api/teams/add", (req, res) => {
	const { name, points } = req.body;
	const team = teams.find((t) => t.name === name);
	if (!team) return res.status(400).json({ error: "Invalid team name" });

	team.score += points;

	// 변경된 팀명과 전체 팀 데이터 전송
	io.emit("scoreUpdated", { teams, changedTeam: name });

	res.json({ success: true });
});

// 초기 점수 데이터 요청 (필요 시)
app.get("/api/teams", (req, res) => {
	res.json(teams);
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
