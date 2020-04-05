"use strict";

const db = require("./connectMongoose");
const { Item } = require("../models/Item");
const fs = require("fs");

const initialDataBase = JSON.parse(fs.readFileSync("./database/data.json", "utf8")).items;

db.once("open", async () => {
  try {
    await initItems();
    db.close();
  } catch (err) {
    console.log("There was an error", err);
    process.exit(1);
  }
});

async function initItems() {
  await Item.deleteMany();
  await Item.insertMany(initialDataBase);
};