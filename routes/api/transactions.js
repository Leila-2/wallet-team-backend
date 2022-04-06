const express = require('express');
const { authenticate, controllerWrapper } = require('../../middlewares');
const { transactions } = require('../../controllers');
const router = express.Router();

// get all transaction list
router.get('/all', authenticate, controllerWrapper(transactions.all));

// add new transaction
router.post('/create', authenticate, controllerWrapper(transactions.create));

// get all categories transactions list
router.get(
  '/categories',
  authenticate,
  controllerWrapper(transactions.categories)
);

// get all  transactions list by date
router.get(
  '/statistics',
  authenticate,
  controllerWrapper(transactions.statistics)
);

// delete transaction by id
router.delete(
  '/:transactionId',
  authenticate,
  controllerWrapper(transactions.remove)
);

module.exports = router;
