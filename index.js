const request = require('request');
const bookname = "harry potter chamber of secrets"
request('https://www.googleapis.com/books/v1/volumes?q=' + bookname+'&orderBy=relevance&langRestrict=en', function (error, response, body) {
  console.log(JSON.parse(body).items[0].volumeInfo);
});