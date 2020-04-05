"user strict";

const { validationResult } = require("express-validator");
const { Item } = require("../../models/Item");

const itemCtrl = {};

itemCtrl.GetItems = async (req, res, next) => {
  try {
    validationResult(req).throw();

    const { name, buy, tag, price, limit, page, sort } = req.query;

    const docs = await Item.list(name, buy, tag, price, limit, page, sort);

    typeof docs !== "undefined" && docs.length > 0 ?
      res.locals.data = { count: docs.length, results: docs } :
      res.locals.data = { count: docs.length, results: "There is no item that matches your search" };

    res.locals.title = "Nodepop";
    res.render("index");

  } catch (err) {
    next(err);
  }
};

module.exports = itemCtrl;