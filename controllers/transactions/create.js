const CreateError = require("http-errors");
const {
  shemaTransactionAdd,
  Transaction,
} = require("../../models/transaction");

const create = async (req, res) => {
  const { error } = shemaTransactionAdd.validate(req.body);

  if (error) {
    throw new CreateError(400, error.message);
  }

  const userId = req.user._id;
  const body = {
    ...req.body,
    owner: userId,
  };
  const isoDate = new Date(body.date);
  body.month = isoDate.getMonth() + 1;
  body.year = isoDate.getFullYear();
  let incomesSum = 0;
  let expensesSum = 0;
  const { type } = body;
  const amount = Number(body.amount);

  const incomes = await Transaction.find({
    type: "incomes",
    owner: body.owner,
  });
  const expenses = await Transaction.find({
    type: "expenses",
    owner: body.owner,
  });

  if (incomes.length === 0 && expenses.length === 0) {
    incomesSum = 0;
    expensesSum = 0;
  }

  if (type === "incomes" && incomes.length > 0) {
    const { incomesBalance } = incomes[incomes.length - 1];
    body.incomesBalance = incomesBalance + amount;
    incomes[incomes.length - 1].incomesBalance = incomesBalance + amount;
    incomesSum = incomes[incomes.length - 1].incomesBalance;
  } else if (type === "expenses" && expenses.length > 0) {
    const { expensesBalance } = expenses[expenses.length - 1];
    body.expensesBalance = expensesBalance + amount;
    expenses[expenses.length - 1].expensesBalance = expensesBalance + amount;
    expensesSum = expenses[expenses.length - 1].expensesBalance;
  } else if (type === "incomes" && incomes.length === 0) {
    body.incomesBalance = amount;
    incomesSum = amount;
  } else if (type === "expenses" && expenses.length === 0) {
    body.expensesBalance = amount;
    expensesSum = amount;
  }

  body.balance = incomesSum - expensesSum;

  const transaction = await Transaction.create(body);

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { transaction },
  });
};

module.exports = create;
