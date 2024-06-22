const Sequelize = require("sequelize");
const { Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize("t5_6958", "root", "", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

class Category extends Model {}

Category.init(
	{
		id: {
			type: DataTypes.STRING(2),
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		}
	},
	{
		sequelize,
		timestamps: false,
		modelName: "Category",
		tableName: "categories",
	}
);

module.exports = Category;