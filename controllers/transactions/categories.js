const fs = require("fs");
const path = require("path");
const file = path.join("category.json");
const CreateError = require("http-errors");

const categories = async (req, res) => {
  await fs.readFile(file, "utf8", function (error, data) {
    if (error) {
      throw new CreateError(400, error.message);
    }

    data = JSON.parse(data);

    return res.status(200).json({
      status: "success",
      code: 200,
      data: [...data.categories],
    });
  });
};

module.exports = categories;
