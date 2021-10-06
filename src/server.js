const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const getHandler = require('./getResponses');
const postHandler = require('./postResponses');
const deleteHandler = require('./deleteResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// A dictionary to send user requests to the proper method.
const urlDictionary = {
  GET: {
    '/': htmlHandler.getIndex,
    '/search': htmlHandler.getSearch,
    '/deckBuilder': htmlHandler.getDeckBuilder,
    '/style.css': htmlHandler.getCSS,
    '/getDecks': getHandler.getDecks,
    '/getAllDecks': getHandler.getAllDecks,
    '/determineSearch': htmlHandler.determineSearch,
    '/search': htmlHandler.getSearch,
    '/openDeck': htmlHandler.getDeckBuilder,
    '/checkOpenDeck': htmlHandler.determineOpenDeck,
    '/notReal': getHandler.getNotFound,
    notFound: getHandler.getNotFound,
  },
  POST: {
    '/addCard': postHandler.addDeck,
    notFound: getHandler.getNotFound,
  },
  DELETE: {
    '/clearDeck': deleteHandler.deleteDeck,
    notFound: getHandler.getNotFound,
  },
};

// Parses URL and determines what kind of operation the API is handling.
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl);

  if (urlDictionary[request.method][parsedUrl.pathname]) {
    urlDictionary[request.method][parsedUrl.pathname](request, response, params[0]);
  } else {
    urlDictionary[request.method].notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
