const { Transaction } = require('../../models/transaction');
const CreateError = require('http-errors');

const remove = async (req, res) => {
  const userId = req.user._id;
  const transaction = await Transaction.findOneAndRemove({
    _id: req.params.transactionId,
    owner: userId,
  });

  if (transaction) {
    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { transaction } });
  }
  throw new CreateError(404, 'Not found');
};

module.exports = remove;
