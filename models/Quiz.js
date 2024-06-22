const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t5_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Quiz extends Model {}

Quiz.init(
	{
		quiz_id: {
			type: DataTypes.STRING(5),
			primaryKey: true,
			allowNull: false,
		},
		quiz_name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
    difficulty: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Quiz",
		tableName: "quizzes",
	}
);

module.exports = Quiz;