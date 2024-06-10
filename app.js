const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");
const PORT = process.env.PORT || 3000;

//init app and middleware
const app = express();
app.use(express.json())

// db connection
let db;
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => { console.log(`Listening on port ${PORT}`); });
        db = getDb();
    } else {
        console.log(err);
    }
});

// ROUTES
app.get("/books", (req, res) => {
    //current page
    const page = req.query.page || 0;
    const booksPerPage = 3;



    let books = [];

    db.collection("books")
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch(() => {
            res.status(500).json({ Error: "Error fetching books" });
        });
});

app.get("/books/:id", (req, res) => {

    const id = req.params.id

    if (ObjectId.isValid(id)) {
        db.collection("books")
        .findOne({ _id: new ObjectId(id) })
        .then(book => {
            if (book) {
                res.status(200).json(book);
            } else {
                res.status(404).json({ Error: "Book not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ Error: "Error fetching book" });
        });
    } else {
        res.status(400).json({ Error: "Invalid book ID" });
    }
});

app.post("/books", (req, res) => {
    const book = req.body;

    db.collection("books")
        .insertOne(book)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({"err": "could not create a post"})
        })
})

app.delete("/books/:id", (req, res) => {
    const id = req.params.id


    if (ObjectId.isValid(id)) {
        db.collection("books")
            .deleteOne({ _id: new ObjectId(id) })
            .then((result) => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({"err": "could not delete post"})
            })
    } else {
        res.status(500).json({"error" : "not a valid book id"})
    }
})

app.patch("/books/:id", (req, res) => {
    const id = req.params.id
    const updates = req.body

    if (ObjectId.isValid(id)) {
        db.collection("books")
            .updateOne({ _id: new ObjectId(id) }, { $set: updates })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({"err": "could not update the book"})
            })
    } else {
        res.status(500).json({"error" : "not a valid book id"})
    }
})