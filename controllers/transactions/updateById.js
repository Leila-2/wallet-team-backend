const { Transaction } = require("../../models/transaction");
const CreateError = require("http-errors");
const { totalBalance } = require("../../middlewares");

const updateById = async (req, res) => {
  const userId = req.user._id;
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.transactionId, owner: userId },
    { ...req.body },
    { new: true }
  );
  const balance = await totalBalance(null, userId);
  if (transaction) {
    return res.status(200).json({
      status: "success",
      code: 200,
      data: { totalBalance: balance, transaction },
    });
  }
  throw new CreateError(404, "Not found");
};

module.exports = updateById;
