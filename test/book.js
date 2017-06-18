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
    beforeEach((done) => { //Before each test we empty the database
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
        let book = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            year: 1954
        }
        chai.request(server)
            .post('/book')
            .send(book)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });

      it('it should POST a book ', function(done){
        let book = {
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


});