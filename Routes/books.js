const express = require("express");

const router = express.Router();

const path = require("path");
const fs = require('fs')
const multer = require("multer");
const bookPath = require("../models/book").bookBasePath;

const coverPath = path.join("public", bookPath);

const imgMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: coverPath,
  fileFilter: (req, file, callback) => {
    callback(null, imgMimeTypes.includes(file.mimetype));
  },
});

const Author = require("../models/author");
const Book = require("../models/book");
const { redirect } = require("express/lib/response");

// Books routes
router.get("/", async (req, res) => {
  console.log("get book route hit");
  let query = {}
  let options = {...req.query}
  if (options !== null) {
    if (options.publishedAfter) {
      query.publishDate = {'$gte': new Date(options.publishedAfter)}
    }
    if (options.publishedBefore) {
      query.publishDate = {'$lte': new Date(options.publishedBefore)}
    }
    if (options.title) {
      query.title = new RegExp(options.title, 'i')
    }
    if (options.author) {
      query.author = options.author
    }

  }
  try {
    const authors = await Author.find({});
    let books = await Book.find(query);

    books = await Promise.all(books.map(async (book, i)=>{
      const author = await Author.findOne({_id: book.author})
      
      return {
        ...book._doc,
        author: author.name
      }
    }))

    res.render("Books", {authors: authors, books: books, searchOptions: options });
  } catch (error) {
    console.error(error)
    redirect('books')
  }
});

router.get("/new", async (req, res) => {
  console.log("new book route hit");
  
  renderNewPage(res, new Book());
});

router.post("/new", upload.single("cover"), async (req, res) => {
  console.log("post book route hit");

  const coverName = req.file !== undefined ? req.file.filename : null;


  console.log("coverName: ", coverName);
  const book = new Book({
    title: req.body.title,
    description: req.body.description,
    pageCount: req.body.pageCount,
    cover: coverName,
    publishDate: new Date(req.body.publishDate),
    author: req.body.author,
  });
  try {
    const newBook = await book.save();
    res.redirect("/books");
  } catch (error) {
    console.log(`new post ERROR: ${error}`);
    if (book.cover) {
      removeBook(book.cover)
    }
    renderNewPage(res, book, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      book: book,
      authors: authors,
    };
    if (hasError) {
      params.errorMessage = "Error creating new book";
    }
    res.render("Books/new", params);
  } catch (error) {
    console.log(`new book error ${error}`);
    res.redirect("/");
  }
}
function removeBook(filename) {
  fs.unlink(path.join(coverPath, filename), (err)=>{
    if (err) console.error(err)
  })
}

module.exports = router;
