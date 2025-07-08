const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  popularityScore: Number,
  weight: Number,
  images: {
    yellow: String,
    rose: String,
    white: String,
  },
}, {
  collection: "Products"
});

module.exports = mongoose.model("Product", productSchema);