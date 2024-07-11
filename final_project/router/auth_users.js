const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean

    let sameName = users.filter((user) => {
        return user.username === username
    });
    if (sameName.length > 0) {
        return true;
    } else {
        return false;
    }
}


const authenticatedUser = (username, password) => { //returns boolean
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validUsers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Wrong ID or PW" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 1000 });

        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("Login Successful!");
    } else {
        return res.status(208).json({ message: "Wrong ID or PW" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Wrong ID or PW" });
    }
    if (authenticatedUser(username, password)) {
        const isbn = req.params.isbn;
        let book = books[isbn]
        if (book) {
            let review = req.body.reviews;

            if (review) {
                book["reviews"] = review
            }
            books[isbn] = book;
            res.send(`Review added for ${isbn}`);
        }
        else {
            res.send("Unable to find isbn");
        }
    }
});

// Delete a review route
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const isbn = req.params.isbn;
        let book = books[isbn];
        if (book) {

            book.reviews = []; 

            books[isbn] = book;
            return res.send(`Reviews deleted for ${isbn}`);
        } else {
            return res.status(404).send("Book not found");
        }
    } else {
        return res.status(401).send("Unauthorized");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
