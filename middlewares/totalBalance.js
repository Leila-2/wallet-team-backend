const { Transaction } = require("../models/transaction");

const totalBalance = async (body, id) => {
  let incomesSum = 0;
  let expensesSum = 0;

  const incomes = await Transaction.find({
    type: "incomes",
    owner: body ? body.owner : id,
  });
  const expenses = await Transaction.find({
    type: "expenses",
    owner: body ? body.owner : id,
  });

  if (body) {
    const amount = Number(body.amount);
    const { type } = body;
    switch (type) {
      case "incomes":
        incomesSum += amount;
        break;

      case "expenses":
        expensesSum += amount;
        break;
    }
  }

  incomes.forEach((item) => (incomesSum += item.amount));

  expenses.forEach((item) => (expensesSum += item.amount));

  const balance = incomesSum - expensesSum;
  return balance;
};

module.exports = totalBalance;
