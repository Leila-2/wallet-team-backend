const { Schema, model, SchemaTypes } = require("mongoose");
const Joi = require("joi");

const Category = {
  expenses: [
    "main",
    "food",
    "car",
    "me",
    "children",
    "house",
    "education",
    "leisure",
    "other",
  ],
  incomes: ["incomes"],
};

const transactionSchema = new Schema(
  {
    type: {
      type: SchemaTypes.String,
      enum: ["incomes", "expenses"],
      default: "incomes",
      required: true,
    },
    amount: {
      type: SchemaTypes.Number,
      min: 0,
      required: true,
    },
    date: {
      type: SchemaTypes.String,
      default: new Date(),
    },
    month: {
      type: SchemaTypes.Number,
    },
    year: {
      type: SchemaTypes.Number,
    },
    comment: {
      type: SchemaTypes.String,
      default: "",
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: SchemaTypes.String,
      enum: [...Category.expenses, ...Category.incomes],
      default: Category.incomes[0],
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Transaction = model("transaction", transactionSchema);
const shemaTransactionAdd = Joi.object({
  type: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  date: Joi.date().required(),
  comment: Joi.string().optional(),
  category: Joi.string().required(),
});

module.exports = {
  Transaction,
  shemaTransactionAdd,
};
