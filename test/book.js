//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Book = require('../app/models/book');

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Books', function(){
    beforeEach(function(done) { //Before each test we empty the database
        Book.remove({}, function(err){ 
           done();         
        });     
    });
/*
  * Test the /GET route
  */
  describe('/GET book', function(){
      it('it should GET all the books', function(done){
        chai.request(server)
            .get('/book')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
              done();
            });
      });
  });

   /*
  * Test the /POST route
  */
  describe('/POST book', function() {
      it('it should not POST a book without pages field', function(done){
        var book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
        chai.request(server)
            .post('/book')
            .send(book)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a book ', function(done){
        var book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954,
            pages: 1170
        }
        chai.request(server)
            .post('/book')
            .send(book)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
              done();
            });
      });

  });

   describe('/GET/:id book', function(){
      it('it should GET a book by the given id', function(done){
        let book = new Book({ title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, pages: 1170 });
        book.save(function(err, book){
            chai.request(server)
            .get('/book/' + book.id)
            .send(book)
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('author');
                res.body.should.have.property('pages');
                res.body.should.have.property('year');
                res.body.should.have.property('_id').eql(book.id);
              done();
            });
        });
        });
    })
      
describe('/PUT/:id book', function()  {
      it('it should UPDATE a book given the id', function(done) {
        let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save(function(err, book) {
                chai.request(server)
                .put('/book/' + book.id)
                .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book updated!');
                    res.body.book.should.have.property('year').eql(1950);
                  done();
                });
          });
      });
  });
describe('/DELETE/:id book', function() {
      it('it should DELETE a book given the id', function(done) {
        let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
        book.save(function(err, book){
                chai.request(server)
                .delete('/book/' + book.id)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    res.body.result.should.have.property('n').eql(1);
                  done();
                });
          });
      })
    })
})