const path = require("path");
const mongoose = require("mongoose");

const bookBasePath = "/uploads/coverImages";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    cover: {
      type: String,
      required: true,
    },
    publishDate: {
      type: Date,
      required: true,
    },
    // createdAt: {
    //     type: Date,
    //     required: true,
    //     default: Date.now,
    // },
    pageCount: {
      type: Number,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.virtual("_cover").get(function () {
  if (this.cover) {
    return path.join("/", bookBasePath, this.cover);
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.bookBasePath = bookBasePath;
