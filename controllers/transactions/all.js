const { Transaction } = require("../../models/transaction");
const { totalBalance } = require("../../middlewares");

const all = async (req, res) => {
  const userId = req.user._id;
  const transactions = await Transaction.find({ owner: userId });
  const balance = await totalBalance(null, req.user._id);

  return res.status(200).json({
    status: "success",
    code: 200,
    data: { total: transactions.length, totalBalance: balance, transactions },
  });
};

module.exports = all;
