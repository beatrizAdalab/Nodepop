"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const currenyTags = ["work", "lifestyle", "motor", "mobile"];

const itemSchema = Schema({
  name: String,
  buy: Boolean,
  price: Number,
  photo: String,
  tags: { type: Array, default: currenyTags }
}, { versionKey: false });

itemSchema.statics.list = function (name, buy, tag, price, limit, page, sort, fields, cb) {

  try {
    //initial filter
    let filter = {};

    if (name) filter.name = { "$regex": `^${name}`, "$options": "i" };
    if (buy) filter.buy = buy === "true" ? true : false;
    if (tag) filter.tags = { $all: [tag] };

    if (price) {
      const fullPrice = price.split("-");

      if (fullPrice.length === 2) {
        if (fullPrice[0] === "") {
          filter.price = { $lte: fullPrice[1] };
        } else if (
          fullPrice[1] === "") {
          filter.price = { $gte: fullPrice[0] };
        } else {
          filter.price = { $lte: fullPrice[1], $gte: fullPrice[0] };
        }
      } else {
        filter.price = price;
      }
    };

    const query = Item.find(filter)
      .collation({ locale: "en", strength: 2 }); //Sorting MongoDB Case Insensitive


    let perPage = limit ? parseInt(limit) : 5;
    let pg = page ? parseInt(page) : 1;

    query.limit(perPage);
    query.skip((perPage * pg) - perPage);


    query.select(fields);

    if (sort) {
      const userSort = {};
      userSort[sort] = 1; // ascending
      query.sort(userSort);

    } else {
      query.sort({ name: 1 });
    }
    return query.exec();

  } catch (err) {
    next(err);
  };
};

const Item = mongoose.model("Item", itemSchema);

module.exports = { Item, currenyTags };
