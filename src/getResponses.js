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

// Builds a response out of xml
const buildXML = (request, response, message, id) => {
  let xmlString = `<response><message>${message}</message></response>`;
  if (id !== '') {
    xmlString = `<response><message>${message}</message><id>${id}</id></response>`;
  }

  return xmlString;
};

// Builds a response with all of the assembled components.
const buildResponse = (request, response, responseString, responseNum) => {
  const acceptedTypes = request.headers.accept.split(',');
  response.writeHead(responseNum, { 'Content-Type': acceptedTypes[0] });
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
  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

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

  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

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

  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, statusCode);
};

const getForbidden = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'You do not have access to this content.';
  const id = 'forbidden';
  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 403);
};

const getInternal = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'Internal Server Error. Something went wrong.';
  const id = 'internalError';
  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 500);
};

const getNotImplemented = (request, response) => {
  const acceptedTypes = request.headers.accept.split(',');

  const message = 'A get request for this page has not been implemented yet. Check again later for updated content.';
  const id = 'notImplemented';
  let responseString;

  if (acceptedTypes[0] === 'text/xml') responseString = buildXML(request, response, message, id);
  else responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 501);
};

// #endregion

// #region Part 2 Methods

const getUsers = (request, response) => {
  buildResponse(request, response, JSON.stringify(decks), 200);
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
  getUsers,
  getNotFound,
  buildJSON,
  buildXML,
  buildResponse,
  decks,
};
