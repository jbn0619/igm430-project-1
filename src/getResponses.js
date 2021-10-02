const url = require('url');

const decks = {};

// Builds a response with a JSON object
const buildJSON = (request, response, message, id) => {
  let jsonObj = {
    message,
  };
  if (id !== '') {
    jsonObj = {
      message,
      id,
    };
  }

  return JSON.stringify(jsonObj);
};

// Builds a response with all of the assembled components.
const buildResponse = (request, response, responseString, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(responseString);
  response.end();
};

// #region Part 1 Methods

// Handles successful requests.
const getSuccess = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  // Begin building response message
  const message = 'This is a successful response.';
  const id = '';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 200);
};

// Handles bad requests
const getBadRequest = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');
  // Prase out if this is a valid bad request or not.
  const parsedUrl = url.parse(request.url);
  let message;
  let id;
  let statusCode;

  if (parsedUrl.query === 'valid=true') {
    message = 'This request has the required parameters.';
    id = '';
    statusCode = 200;
  } else {
    message = 'Missing valid query parameter set to true.';
    id = 'badRequest';
    statusCode = 400;
  }

  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, statusCode);
};

const getUnauthorized = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');
  // Prase out if the user is logged in or not.
  const parsedUrl = url.parse(request.url);

  let message;
  let id;
  let statusCode;

  if (parsedUrl.query === 'loggedIn=yes') {
    message = 'You have successfully viewed the content.';
    id = '';
    statusCode = 200;
  } else {
    message = 'Missing loggedIn query parameter set to yes.';
    id = 'unauthorized';
    statusCode = 401;
  }

  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, statusCode);
};

const getForbidden = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'You do not have access to this content.';
  const id = 'forbidden';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 403);
};

const getInternal = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'Internal Server Error. Something went wrong.';
  const id = 'internalError';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 500);
};

const getNotImplemented = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'A get request for this page has not been implemented yet. Check again later for updated content.';
  const id = 'notImplemented';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 501);
};

// #endregion

// #region Part 2 Methods

const getDecks = (request, response, deckName) => {
  if (deckName) {
    buildResponse(request, response, JSON.stringify(decks[deckName]), 200);
  } else if (!decks[deckName]) {
    const object = {
      message: 'No deck with the given name exists.',
      id: 'noObjectExists',
    };
    buildResponse(request, response, JSON.stringify(object), 400);
  } else {
    const object = {
      message: 'No deckname was specified. Enter a deckname and try again.',
      id: 'missingParams',
    };
    buildResponse(request, response, JSON.stringify(object), 400);
  }
};

// #endregion

const getNotFound = (request, response) => {
  const message = 'The page you were looking for was not found.';
  const id = 'notFound';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 404);
};

module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getDecks,
  getNotFound,
  buildJSON,
  buildResponse,
  decks,
};
