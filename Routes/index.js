const express = require('express')

const Author = require('../models/author')
const Book = require('../models/book')

const router = express.Router()

router.get('/', async (req, res)=>{
    console.log("root route hit")
  try {
    const authors = await Author.find({});
    let books = await Book.find().sort({createdAt: 'desc'}).limit(10);
    
    const bookAuthors = await Promise.all(books.map(async (book, i)=>{
      const author = await Author.findOne({_id: book.author})
      
      return {
        name: author.name
      }
    }))

    res.render("index", {authors: authors, bookAuthors: bookAuthors, books: books});
  } catch (error) {
    console.error(error)
    res.redirect('books')
  }

})

module.exports = router