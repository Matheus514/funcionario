const mongoose = require("mongoose");

const mongooseModel = new mongoose.Schema({

    name: String,
    tipo: String,
    age: String,
    skill: String,

});

module.exports = mongooseModel;