const express = require('express');
const axios = require('axios');
const Book = require('../models/books');

const router = express.Router();

/* GET books page. */
router.get('/books/', (req, res, next) => {
  // axios.get('https://www.googleapis.com/books/v1/volumes?q=javascript&key=AIzaSyBFY6x3Zudnvc2BdtAqpVsRk_lhfVahjnc')
  //   .then((response) => {
  //     console.log(response);
  //     const books = response;
  //     res.render('bookgallery', { books });
  //   }).catch((err) => {
  //     console.log(err);
  //   });
  const page = req.query.page || 1;
  // console.log(page);
  let query = {};
  // const query = Book.find();
  // query.setOptions({ lean: true });
  // query.collection(Book.collection);
  // query.where('age').gte(21).exec(callback);
  if (req.query.q && req.query.q.length > 0) {
    query = {
      $text: {
        $search: req.query.q,
      },
      // $or: [
      //   { title: req.query.q },
      //   { author: req.query.q },
      // ],
    };
  }

  const options = {
    page,
    limit: 3,
  };

  console.log('query', query);
  console.log('parm', req.query.q);

  Book.paginate(query, options, (err, x) => {
    const books = x.docs;
    const pages = x.totalPages;
    const nextP = x.hasNextPage;
    const prevP = x.hasPrevPage;
    const nextPage = pages > parseInt(options.page, 10) ? parseInt(options.page, 10) + 1 : null;
    const prevPage = parseInt(options.page, 10) > 1 ? parseInt(options.page, 10) - 1 : null;
    const queryStringNext = req.query.q ? `?q=${req.query.q}&page=${nextPage}` : `?page=${nextPage}`;
    const queryStringPrev = req.query.q ? `?q=${req.query.q}&page=${nextPage}` : `?page=${prevPage}`;
    res.render('bookgallery', {
      books,
      pages,
      nextP,
      prevP,
      nextPage,
      prevPage,
      queryStringNext,
      queryStringPrev,
      user: req.user,
    });
  });
});

module.exports = router;
