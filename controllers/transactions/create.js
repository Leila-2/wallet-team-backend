const CreateError = require("http-errors");
const {
  shemaTransactionAdd,
  Transaction,
} = require("../../models/transaction");
const { totalBalance } = require("../../middlewares");

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

  const balance = await totalBalance(body);

  const transaction = await Transaction.create(body);

  return res.status(201).json({
    status: "success",
    code: 201,
    data: { transaction, totalBalance: balance },
  });
};

module.exports = create;
