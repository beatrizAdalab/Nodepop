"use strict";

const express = require("express");
const router = express.Router();
const { query, body } = require("express-validator");

const itemCtrl = require("../../controllers/apiv1_Controller/Item");


//GET apiv1/tags => list of tags
router.get("/", itemCtrl.IndexApi);

//GET apiv1/items => list of items
router.get("/items", [
  query("name").optional().isAlphanumeric().withMessage("Name must be alphanumeric"),
  query("buy").optional().isBoolean().withMessage("Buy must be boolean"),
  query("tag").optional().isAlpha().withMessage("Tag must be a string"),
  query("price").optional().custom(value => {

    const addedValues = value.split("-");

    if (addedValues.length === 1 && (/^([0-9])*$/).test(addedValues[0])) { return true; }
    else if (
      // check both are numbers
      addedValues.length === 2 && (/^([0-9])*$/).test(addedValues[0]) && (/^([0-9])*$/).test(addedValues[1])) { return true; }
    else { return false; }
  }).withMessage("Price must be integer number, for minimum and maximum use the pattern: numMin - numMax "),

  query("limit").optional().isInt({ gt: 0 }).withMessage("Limit must be a number greater than zero"),
  query("page").optional().isInt({ gt: 0 }).withMessage("Page must be an integer number"),
  query("sort").optional().isAlpha().isIn(["name", "price"]).withMessage("Sort must be price or name"),
  query("fields").optional().custom(value => {

    const fieldsUser = (value.split(" "));
    const fieldsAll = ["name", "buy", "photo", "price", "tags"];

    let count = 0;

    fieldsUser.forEach(element => {
      if (fieldsAll.includes(element)) {
        count += 1;
      }
    });

    return fieldsUser.length === count ? true : false;
  }).withMessage("Param fields must be one or more of the following fields separated by a space (name, price, buy, photo, or tags). example fields=name buy"),
], itemCtrl.GetItems);

//POST apiv1/items => create item
router.post("/items", [
  body("name").exists().notEmpty().withMessage("Name is mandatory"),
  body("price").exists().notEmpty().isNumeric().withMessage("Price must be a number and is mandatory"),
  body("buy").exists().isBoolean().withMessage("Buy must be boolean and is mandatory"),
  body("photo").exists().withMessage("Photo is mandatory"),
], itemCtrl.createItem);

//GET apiv1/tags => list of tags
router.get("/tags", itemCtrl.GetTags);

module.exports = router;