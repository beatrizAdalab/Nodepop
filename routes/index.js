var express = require("express");
var router = express.Router();
const { query } = require("express-validator");

const itemCtrl = require("../controllers/nodepopWeb_Controller/nodepopWeb");

//GET apiv1/items => list of items
router.get("/", [
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
], itemCtrl.GetItems);

module.exports = router;
