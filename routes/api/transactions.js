const express = require('express');
const { authenticate } = require('../../middlewares');
const CreateError = require('http-errors');
const { Transaction } = require('../../models/transaction');
const { shemaTransactionAdd } = require('../../models/transaction');
const router = express.Router();

// get all transaction list
router.get('/all', authenticate, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ owner: userId });
    return res.status(200).json({
      status: 'success',
      code: 200,
      data: { total: transactions.length, transactions },
    });
  } catch (error) {
    next(error);
  }
});

// add new transaction
router.post('/create', authenticate, async (req, res, next) => {
  try {
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
      type: 'incomes',
      owner: body.owner,
    });
    const expenses = await Transaction.find({
      type: 'expenses',
      owner: body.owner,
    });

    if (incomes.length === 0 && expenses.length === 0) {
      incomesSum = 0;
      expensesSum = 0;
    }

    if (type === 'incomes' && incomes.length > 0) {
      const { incomesBalance } = incomes[incomes.length - 1];
      body.incomesBalance = incomesBalance + amount;
      incomes[incomes.length - 1].incomesBalance = incomesBalance + amount;
      incomesSum = incomes[incomes.length - 1].incomesBalance;
    } else if (type === 'expenses' && expenses.length > 0) {
      const { expensesBalance } = expenses[expenses.length - 1];
      body.expensesBalance = expensesBalance + amount;
      expenses[expenses.length - 1].expensesBalance = expensesBalance + amount;
      expensesSum = expenses[expenses.length - 1].expensesBalance;
    } else if (type === 'incomes' && incomes.length === 0) {
      body.incomesBalance = amount;
      incomesSum = amount;
    } else if (type === 'expenses' && expenses.length === 0) {
      body.expensesBalance = amount;
      expensesSum = amount;
    }

    body.balance = incomesSum - expensesSum;

    const transaction = await Transaction.create(body);

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
});

// get all categories transactions list
router.get('/categories', authenticate, async (req, res, next) => {
  try {
    const categories = [
      'main',
      'food',
      'car',
      'me',
      'children',
      'house',
      'education',
      'leisure',
      'other',
    ];

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: { categories: categories },
    });
  } catch (error) {
    next(error);
  }
});

// get all  transactions list by date
router.get('/statistics', authenticate, async (req, res, next) => {
  try {
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
      leisure: 0,
      other: 0,
    };
    const categories = [
      'main',
      'food',
      'car',
      'me',
      'children',
      'house',
      'education',
      'leisure',
      'other',
    ];

    categories.forEach((categoryExp) => {
      transactions.forEach((item) => {
        if (item.category === categoryExp) {
          sumCategories[categoryExp] += item.amount;
        }
      });
    });

    transactions.forEach((item) => {
      if (item.type === 'incomes') {
        incomes += item.amount;
      }
      if (item.type === 'expenses') {
        expenses += item.amount;
      }
    });

    return res.status(200).json({
      status: 'success',
      code: 200,
      transactions: sumCategories,
      expenses: expenses,
      incomes: incomes,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
