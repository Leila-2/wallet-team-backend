const { Transaction } = require("../../models/transaction");

const all = async (req, res) => {
  const userId = req.user._id;
  const transactions = await Transaction.find({ owner: userId });
  return res.status(200).json({
    status: "success",
    code: 200,
    data: { total: transactions.length, transactions },
  });
};

module.exports = all;
