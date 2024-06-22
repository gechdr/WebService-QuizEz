// intall express joi @joi/date sequelize mysql2 axios

const express = require("express");
const axios = require("axios");
const he = require("he");

const app = express();
app.set("port", 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const conn = new Sequelize("t5_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

const Assign = require("./models/Assign");
const Category = require("./models/Category");
const Quiz = require("./models/Quiz");
const User = require("./models/User");

// -------------------------------------------------------

function validatePassword(password) {
	if (password.length < 8) {
		return false;
	}
	if (!/\d/.test(password)) {
		return false;
	}
	if (!/[a-zA-Z]/.test(password)) {
		return false;
	}
	return true;
}

async function generateUserID() {
	const today = new Date();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();

	let tempID = "USR" + year.toString().substring(2) + month.toString().padStart(2, "0");

	// Find Last ID
	let users = await User.findAll({
		where: {
			user_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (users.length > 0) {
		users.forEach((user) => {
			let user_id = user.user_id;
			lastID = user_id.substring(7);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

// 1
app.post("/api/users", async (req, res) => {
	let { username, display_name, password } = req.body;

	// Empty Field
	if (!username || !display_name || !password) {
		return res.status(400).send("Error: Empty Field");
	}

	// Unique Username
	let users = await User.findAll({
		where: {
			username: username,
		},
	});

	if (users.length > 0) {
		return res.status(400).send({
			message: "Username is already taken!",
		});
	}

	// Combinated Password
	if (validatePassword(password) == false) {
		return res.status(400).send("Password must consist of at least 8 characters and be a combination of alphabets and numbers!");
	}

	// Generate ID
	let newID = await generateUserID();

	// Insert
	try {
		user = await User.create({
			user_id: newID,
			username: username,
			display_name: display_name,
			password: password,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		uid: newID,
		username: username,
		name: display_name,
	});
});

async function generateQuizID() {
	let tempID = "QZ";

	// Find Last ID
	let quizzes = await Quiz.findAll({
		where: {
			quiz_id: {
				[Op.like]: "%" + tempID + "%",
			},
		},
	});

	let lastID;
	if (quizzes.length > 0) {
		quizzes.forEach((quiz) => {
			let quiz_id = quiz.quiz_id;
			lastID = quiz_id.substring(2);
		});
	} else {
		lastID = "000";
	}
	lastID++;

	let newID = tempID + lastID.toString().padStart(3, "0");

	return newID;
}

function shuffleArray(array) {
	let tempArray = [...array];
	for (let i = tempArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
	}
	return tempArray;
}

// 2
app.post("/api/quizzes", async (req, res) => {
	let { amount, quiz_name, category, difficulty } = req.body;

	// Empty
	if (!amount || !quiz_name) {
		return res.status(400).send("Amount and quiz_name fields must be filled!");
	}

	// Invalid Input
	if (/\d/.test(amount) == false) {
		return res.status(400).send("Amount must be an integer!");
	}

	let resultCategory;
	if (category) {
		if (/\d/.test(category) == false) {
			return res.status(400).send("Category must be an integer from 9 to 32");
		}
		if (category < 9 || category > 32) {
			return res.status(400).send("Category must be an integer from 9 to 32");
		}

		let tempCategory = await Category.findByPk(category);
		resultCategory = tempCategory.name;
	}

	let resultDifficulty;
	if (difficulty) {
		difficulty = difficulty.toLowerCase();
		if (difficulty != "easy" && difficulty != "medium" && difficulty != "hard") {
			return res.status(400).send("Difficulty must be [Easy,Medium,Hard]!");
		}
		resultDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
	}

	// URL
	let url = `https://opentdb.com/api.php?amount=${amount}`;
	if (category) {
		url = `https://opentdb.com/api.php?amount=${amount}&category=${category}`;
		if (difficulty) {
			url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
		}
	} else if (difficulty) {
		url = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}`;
	}

	// Generate Quiz
	let tempResult = await axios.get(url);
	let questions = tempResult.data.results;

	// Generate ID
	let newID = await generateQuizID();

	// Additional Info
	if (!category) {
		resultCategory = "Mixed";
	}
	if (!difficulty) {
		resultDifficulty = "Mixed";
	}

	// Questions
	let result = [];
	questions.forEach((question) => {
		let text = he.decode(question.question);
		let choices = [];
		let answer = he.decode(question.correct_answer);
		choices.push(answer);
		let tempChoice = question.incorrect_answers;
		let newChoice = [];
		for (let i = 0; i < tempChoice.length; i++) {
			const temp = tempChoice[i];
			let newData = he.decode(temp);
			newChoice.push(newData);
		}
		choices = [...choices, ...newChoice];

		let shuffledChoice = shuffleArray(choices);

		let temp = {
			text: text,
			choices: shuffledChoice,
			answer: answer,
		};
		result.push(temp);
	});

	// Insert
	try {
		quiz = await Quiz.create({
			quiz_id: newID,
			quiz_name: quiz_name,
			difficulty: resultDifficulty,
			category: resultCategory,
			questions: result,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(201).send({
		quiz_id: newID,
		quiz_name: quiz_name,
		difficulty: resultDifficulty,
		category: resultCategory,
		q_count: questions.length,
		questions: result,
	});
});

// 3
app.get("/api/categories", async (req, res) => {
	let categories = await Category.findAll();

	let result = [];
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		let id = category.id;
		let name = category.name;
		let count;

		let tempCount = await Quiz.findAndCountAll({
			where: {
				category: name,
			},
		});

		count = tempCount.count;

		if (!count) {
			count = 0;
		}

		let data = {
			id: id,
			name: name,
			quizzes: count,
		};
		result.push(data);
	}

	return res.status(200).send({
		categories: result,
	});
});

// 4
app.get("/api/quizzes", async (req, res) => {
	let { difficulty, category } = req.query;

	let resultDifficulty;
	if (difficulty) {
		difficulty = difficulty.toLowerCase();
		if (difficulty != "easy" && difficulty != "medium" && difficulty != "hard" && difficulty != "mixed") {
			return res.status(400).send("Difficulty must be [Easy,Medium,Hard,Mixed]!");
		}
		resultDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
	}

	let resultCategory;
	if (category) {
		if (/\d/.test(category) == false) {
			return res.status(400).send("Category must be an integer from 9 to 33");
		}
		if (category < 9 || category > 33) {
			return res.status(400).send("Category must be an integer from 9 to 33");
		}

		let tempCategory = await Category.findByPk(category);
		resultCategory = tempCategory.name;
	}

	let quizzes;
	if (!difficulty && !category) {
		quizzes = await Quiz.findAll({
			where: {
				deleted_at: null,
			},
		});
	}

	if (difficulty && category) {
		quizzes = await Quiz.findAll({
			where: {
				[Op.and]: {
					difficulty: resultDifficulty,
					category: resultCategory,
					deleted_at: null,
				},
			},
		});
	} else if (difficulty) {
		quizzes = await Quiz.findAll({
			where: {
				[Op.and]: {
					difficulty: resultDifficulty,
					deleted_at: null,
				},
			},
		});
	} else if (category) {
		quizzes = await Quiz.findAll({
			where: {
				[Op.and]: {
					category: resultCategory,
					deleted_at: null,
				},
			},
		});
	}

	if (quizzes.length == 0) {
		return res.status(404).send("Quiz not found!");
	}

	// Result
	let result = [];
	quizzes.forEach((quiz) => {
		let questions = JSON.parse(quiz.questions);
		let data = {
			quiz_id: quiz.quiz_id,
			name: quiz.quiz_name,
			category: quiz.category,
			difficulty: quiz.difficulty,
			questions: questions.length,
		};
		result.push(data);
	});

	return res.status(200).send({
		found: quizzes.length,
		quizzes: result,
	});
});

// 5
app.post("/api/assign", async (req, res) => {
	let { user_id, quiz_id, password, answers } = req.body;

	// Empty
	if (!user_id || !quiz_id || !password || !answers) {
		return res.status(400).send("All fields must be filled!");
	}

	// Get User
	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send("User not found!");
	}

	// Check Password
	if (password != user.password) {
		return res.status(400).send("Wrong Password!");
	}

	// Get Quiz
	let quiz = await Quiz.findByPk(quiz_id);
	if (!quiz) {
		return res.status(404).send("Quiz not found!");
	}

	if (quiz.deleted_at != null) {
		return res.status(404).send("Quiz not found!");
	}

	let questions = JSON.parse(quiz.questions);

	let sanitizedAnswers = answers.replace(/[\u201C\u201D]/g, '"');
	let answersArr;
	try {
		answersArr = JSON.parse(sanitizedAnswers);
	} catch (error) {
		return res.status(400).send('Invalid answers! Answers must consist of ["A", "B", "C", "D"]');
	}

	if (answersArr.length > questions.length) {
		return res.status(400).send(`There are too many answers, the number of questions is ${questions.length}`);
	}
	if (answersArr.length < questions.length) {
		return res.status(400).send(`There are too few answers, the number of questions is ${questions.length}`);
	}

	let validAns = true;
	for (let i = 0; i < answersArr.length; i++) {
		const ans = answersArr[i];

		if (ans != "A" && ans != "B" && ans != "C" && ans != "D") {
			validAns = false;
			break;
		}
	}

	if (validAns == false) {
		return res.status(400).send('Invalid answers! Answers must consist of ["A", "B", "C", "D"]');
	}

	// Process

	let score = 0;
	let correct = 0;
	let incorrect = 0;

	let eachScore = 100 / questions.length;

	for (let i = 0; i < questions.length; i++) {
		const question = questions[i];
		let choices = question.choices;
		let answer = question.answer;
		let userAnswer = answersArr[i];

		let correctAns = false;

		if (userAnswer == "A") {
			if (answer == choices[0]) {
				correctAns = true;
			}
		} else if (userAnswer == "B") {
			if (answer == choices[1]) {
				correctAns = true;
			}
		} else if (userAnswer == "C") {
			if (answer == choices[2]) {
				correctAns = true;
			}
		} else if (userAnswer == "D") {
			if (answer == choices[3]) {
				correctAns = true;
			}
		}

		if (correctAns) {
			correct++;
			score += eachScore;
		} else {
			incorrect++;
		}
	}

	// Date
	const now = new Date();

	const day = now.getDate();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();

	// extract the time components
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();

	let date =
		day.toString().padStart(2, "0") + "-" + month.toString().padStart(2, "0") + "-" + year.toString() + " " + hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

	// Insert
	try {
		assign = await Assign.create({
			user_id: user_id,
			quiz_id: quiz_id,
			score: score,
			correct: correct,
			incorrect: incorrect,
			timestamps: date,
		});
	} catch (error) {
		return res.status(400).send({
			message: "Insert Failed",
			error,
		});
	}

	return res.status(200).send({
		score: score,
		correct: correct,
		incorrect: incorrect,
	});
});

// 6
app.delete("/api/quizzes/:quiz_id", async (req, res) => {
	let { quiz_id } = req.params;

	if (!quiz_id) {
		return res.status(400).send("Invalid Input!");
	}

	let quiz = await Quiz.findByPk(quiz_id);
	if (!quiz) {
		return res.status(404).send("Quiz not found!");
	}
	if (quiz.deleted_at != null) {
		return res.status(404).send("Quiz not found!");
	}

	let name = quiz.quiz_name;

	// Delete

	const today = new Date();

	try {
		quiz = await Quiz.update(
			{
				deleted_at: today.toString(),
			},
			{
				where: {
					quiz_id: quiz_id,
				},
			}
		);
	} catch (error) {
		return res.status(400).send({
			message: "Delete Failed",
			error,
		});
	}

	return res.status(200).send({
		message: `Quiz '${name}' has been successfully deleted!`,
	});
});

// 7
app.get("/api/quizzes/:quiz_id/stats", async (req, res) => {
	let { quiz_id } = req.params;

	if (!quiz_id) {
		return res.status(400).send("Invalid Input!");
	}

	let quiz = await Quiz.findByPk(quiz_id);
	if (!quiz) {
		return res.status(404).send("Quiz not found!");
	}
	if (quiz.deleted_at != null) {
		return res.status(404).send("Quiz not found!");
	}

	// OK
	let quiz_name = quiz.quiz_name;
	let category = quiz.category;
	let difficulty = quiz.difficulty;
	let tempQuestions = JSON.parse(quiz.questions);
	let questions = tempQuestions.length;
	let top_three = [];

	let assigns = await Assign.findAll({
		where: {
			quiz_id: quiz_id,
		},
		limit: 3,
		order: [
			["score", "DESC"],
			["timestamps", "ASC"],
		],
	});

	for (let i = 0; i < assigns.length; i++) {
		const assign = assigns[i];

		let user_id = assign.user_id;
		let user = await User.findByPk(user_id);
		let name = user.display_name;

		let score = assign.score;
		let correct = assign.correct;
		let date = assign.timestamps;

		let data = {
			name: name,
			score: score,
			date: date,
		};

		top_three.push(data);
	}

	assigns = await Assign.findAll({
		where: {
			quiz_id: quiz_id,
		},
	});

	let totalScore = 0;
	let totalCorrectAnswer = 0;
	let users = [];

	assigns.forEach((assign) => {
		let score = parseFloat(assign.score);
		totalScore += score;
		let correct = parseFloat(assign.correct);
		totalCorrectAnswer += correct;
		let user_id = assign.user_id;
		users.push(user_id);
	});

	let avg_score = (totalScore / assigns.length).toFixed(2);
	let avg_correct_answer = (totalCorrectAnswer / assigns.length).toFixed(2);

	let tempUsers = [...new Set(users)];
	let participants = tempUsers.length;

	return res.status(200).send({
		name: quiz_name,
		category: category,
		difficulty: difficulty,
		questions: questions,
		top_three: top_three,
		avg_score: avg_score,
		avg_correct_answer: avg_correct_answer,
		participants: participants,
	});
});

// 8
app.get("/api/users/:user_id", async (req, res) => {
	let { user_id } = req.params;

	if (!user_id) {
		return res.status(400).send("Invalid Input!");
	}

	let user = await User.findByPk(user_id);
	if (!user) {
		return res.status(404).send("User not found!");
	}

	let name = user.display_name;

	let assigns = await Assign.findAll({
		where: {
			user_id: user_id,
		},
	});

	let finished_quizzes = assigns.length;

	let history = [];
	let totalScore = 0;
	let totalPass80 = 0;

	for (let i = 0; i < assigns.length; i++) {
		const assign = assigns[i];
		let quiz_id = assign.quiz_id;
		let quiz_name = assign.quiz_name;
		let score = parseFloat(assign.score);
		let timestamps = assign.timestamps;

		totalScore += score;

		if (score >= 80) {
			totalPass80++;
		}

		let tempAssigns = await Assign.findAll({
			where: {
				quiz_id: quiz_id,
			},
			order: [
				["score", "DESC"],
				["timestamps", "ASC"],
			],
		});

		let place = 0;
		for (let j = 0; j < tempAssigns.length; j++) {
			const tempAssign = tempAssigns[j];

			if (tempAssign.user_id == user_id && tempAssign.timestamps == timestamps) {
				place = j + 1;
				break;
			}
		}

		let leaderboard = place;

		let data = {
			quiz_id: quiz_id,
			name: quiz_name,
			score: score,
			leaderboard,
			leaderboard,
		};

		history.push(data);
	}

	let avg_score = (totalScore / assigns.length).toFixed(2);
	let pass_80_rate = ((totalPass80 / assigns.length) * 100).toFixed(2);

	return res.status(200).send({
		name: name,
		finished_quizzes: finished_quizzes,
		history: history,
		avg_score: avg_score,
		pass_80_rate: pass_80_rate,
	});
});

// -------------------------------------------------------

app.listen(app.get("port"), () => {
	console.log(`Server started at http://localhost:${app.get("port")}`);
});
