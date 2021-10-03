const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses');
const getHandler = require('./getResponses');
const postHandler = require('./postResponses');
const headHandler = require('./headResponses');
const deleteHandler = require('./deleteResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// A dictionary to send user requests to the proper method.
const urlDictionary = {
  GET: {
    '/': htmlHandler.getIndex,
    '/search':htmlHandler.getSearch,
    '/deckBuilder':htmlHandler.deckBuilder,
    '/style.css': htmlHandler.getCSS,
    '/success': getHandler.getSuccess,
    '/badRequest': getHandler.getBadRequest,
    '/unauthorized': getHandler.getUnauthorized,
    '/forbidden': getHandler.getForbidden,
    '/internal': getHandler.getInternal,
    '/notImplemented': getHandler.getNotImplemented,
    '/getDecks': getHandler.getDecks,
    '/getAllDecks': getHandler.getAllDecks,
    '/getSearchParams': getHandler.getSearchParams,
    '/notReal': getHandler.getNotFound,
    notFound: getHandler.getNotFound,
  },
  HEAD: {
    '/getUsers': headHandler.getUsersHead,
    '/notReal': headHandler.getNotFoundHead,
    notFound: headHandler.getNotFoundHead,
  },
  POST: {
    '/addCard': postHandler.addDeck,
    '/searchDeck': postHandler.searchDeck,
    '/openDeck': postHandler.openDeck,
    notFound: getHandler.getNotFound,
  },
  DELETE:{
    '/clearDeck':deleteHandler.deleteDeck,
    notFound:getHandler.getNotFound,
  }
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
