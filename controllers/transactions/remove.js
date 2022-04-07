const { Transaction } = require("../../models/transaction");
const { totalBalance } = require("../../middlewares");
const CreateError = require("http-errors");

const remove = async (req, res) => {
  const userId = req.user._id;
  const transaction = await Transaction.findOneAndRemove({
    _id: req.params.transactionId,
    owner: userId,
  });
  const balance = await totalBalance(null, req.user._id);
  if (transaction) {
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { transaction, totalBalance: balance },
    });
  }
  throw new CreateError(404, "Not found");
};

module.exports = remove;
