var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = new Schema({
    booksList: [{}]
});

module.exports = mongoose.model('BooksList', bookSchema, 'bookslist');