const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t5_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Assign extends Model {}

Assign.init(
	{
		assign_id: {
			type: DataTypes.INTEGER(5),
			primaryKey: true,
      autoIncrement: true,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
    quiz_id: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER(3),
      allowNull: false
    },
    correct: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    incorrect: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    timestamps: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Assign",
		tableName: "assigns",
	}
);

module.exports = Assign;