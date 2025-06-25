const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 8080;

let teams = ["키미쌤", "효민쌤", "은미쌤", "현정쌤", "승윤쌤", "소냐쌤", "이슬쌤", "위트니쌤", "숀쌤", "올리비아쌤", "향기쌤"].map((name) => ({
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
