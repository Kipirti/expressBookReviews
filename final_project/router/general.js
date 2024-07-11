const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getAllBooks = () => new Promise((resolve, reject) => {
    resolve(books);
  });

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User is registered!" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    } else {
        return res.status(400).json({ message: "Username and password are required" });
    }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        return res.json(allBooks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const book = await books[req.params.isbn];
        if (book) {
            return res.json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const authorBooks = Object.values(books).filter(book => book.author === author);
        if (authorBooks.length > 0) {
            return res.json(authorBooks);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const titleBooks = Object.values(books).filter(book => book.title === title);
        if (titleBooks.length > 0) {
            return res.json(titleBooks);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];
        if (book && book.reviews) {
            return res.json(book.reviews);
        } else {
            return res.status(404).json({ message: "No reviews found for this book" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports.general = public_users;
