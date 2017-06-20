var mongoose = require('mongoose');
var Book = require('../models/book');

/*
 * GET /book route to retrieve all the books.
 */
exports.getBooks =  function(req, res) {
    //Query the DB and if no errors, send all the books
    var query = Book.find({});
    query.exec(function(err, books) {
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(books);
    });
}

/*
 * POST /book to save a new book.
 */
exports.postBook = function(req, res) {
    //Creates a new book
    var newBook = new Book(req.body);
    //Save it into the DB.
    newBook.save(function(err,book) {
        if(err) {
            res.send(err);
        }
        else { 
  
        }
    });
}

/*
 * GET /book/:id route to retrieve a book given its id.
 */
exports.getBook = function(req, res) {
    Book.findById(req.params.id, function(err, book) {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(book);
    });     
}

/*
 * DELETE /book/:id to delete a book given its id.
 */
exports.deleteBook = function(req, res) {
    Book.remove({_id : req.params.id}, function(err, result){

    });
}

/*
 * PUT /book/:id to updatea a book given its id
 */
exports.updateBook = function(req, res) {
    Book.findById({_id: req.params.id}, function(err, book) {
        if(err) res.send(err);
        Object.assign(book, req.body).save(function(err, book) {
            if(err) res.send(err);

        }); 
    });
}
