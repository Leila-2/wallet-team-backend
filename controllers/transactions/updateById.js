const { Transaction } = require('../../models/transaction');
const CreateError = require('http-errors');

const updateById = async (req, res) => {
  const userId = req.user._id;
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.transactionId, owner: userId },
    { ...req.body },
    { new: true }
  );

  console.log(req.body, 'req');
  console.log(transaction, 'transaction');

  if (transaction) {
    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { transaction } });
  }
  throw new CreateError(404, 'Not found');
};

module.exports = updateById;
