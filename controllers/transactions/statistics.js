const { Transaction } = require('../../models/transaction');

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

  const categories = [
    {
      title: 'Основной',
      value: 'main',
    },
    {
      title: 'Еда',
      value: 'food',
    },
    {
      title: 'Авто',
      value: 'car',
    },
    {
      title: 'Развитие',
      value: 'me',
    },
    {
      title: 'Дети',
      value: 'children',
    },
    {
      title: 'Дом',
      value: 'house',
    },
    {
      title: 'Образование',
      value: 'education',
    },
    {
      title: 'Остальные',
      value: 'other',
    },
  ];

  categories.forEach((categoryExp) => {
    transactions.forEach((item) => {
      if (item.category === categoryExp.value) {
        sumCategories[categoryExp.value] += item.amount;
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
};

module.exports = all;
