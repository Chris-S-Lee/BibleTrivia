// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

let teams = ["키미쌤", "효민쌤", "은미쌤", "현정쌤", "승윤쌤", "소냐쌤", "이슬쌤❤️❤️", "위트니쌤", "숀쌤", "올리비아쌤", "향기쌤"].map((name) => ({
	name,
	score: 0,
}));

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 점수 가져오기
app.get("/api/teams", (req, res) => {
	res.json(teams);
});

app.get("/display", (req, res) => {
	res.render("display");
});

app.get("/control", (req, res) => {
	res.render("control");
});

// 점수 추가
app.post("/api/teams/:index/add", (req, res) => {
	const index = parseInt(req.params.index);
	const { points } = req.body;
	if (teams[index]) {
		teams[index].score += points;
		res.json({ success: true });
	} else {
		res.status(400).json({ error: "Invalid team index" });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
