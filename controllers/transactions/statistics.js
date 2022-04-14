const { Transaction } = require("../../models/transaction");
const fs = require("fs");

const all = async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user._id;
  const transactions = await Transaction.find({
    owner: userId,
    month: month,
    year: year,
  });
  let expenses = 0;
  let incomes = 0;
  const sumCategories = {
    main: 0,
    food: 0,
    car: 0,
    me: 0,
    children: 0,
    house: 0,
    education: 0,
    other: 0,
  };

  const { categories } = JSON.parse(fs.readFileSync("category.json", "utf-8"));

  categories.forEach((categoryExp) => {
    transactions.forEach((item) => {
      if (item.category === categoryExp.value) {
        sumCategories[categoryExp.value] += item.amount;
      }
    });
  });

  transactions.forEach((item) => {
    if (item.type === "incomes") {
      incomes += item.amount;
    }
    if (item.type === "expenses") {
      expenses += item.amount;
    }
  });

  return res.status(200).json({
    status: "success",
    code: 200,
    transactions: sumCategories,
    expenses: expenses,
    incomes: incomes,
  });
};

module.exports = all;
