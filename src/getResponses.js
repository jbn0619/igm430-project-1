const decks = [];

const mtg = require('mtgsdk');
const url = require('url');
const query = require('querystring');

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

const getCardName = (request, response) => {
  let searchList = [];
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  if (params.cardName) {
    mtg.card.all({ name: params.cardName, pageSize: 1 })
      .on('data', (cards) => {
        searchList = cards.name;
      });
    return buildResponse(request, response, JSON.stringify(searchList), 200);
  }

  const object = {
    message: 'No card name was specified. Enter a card name and try again.',
    id: 'missingParams',
  };
  return buildResponse(request, response, JSON.stringify(object), 400);
};

const getDecks = (request, response, deckName) => {
  for (let i = 0; i < decks.length; i++) {
    if (decks[i].deckName === deckName) {
      return buildResponse(request, response, JSON.stringify(decks[i]), 200);
    }
  }

  if (!deckName) {
    const object = {
      message: 'No deckname was specified. Enter a deckname and try again.',
      id: 'missingParams',
    };
    return buildResponse(request, response, JSON.stringify(object), 400);
  }
  const object = {
    message: `The deck ${deckName} does not exist.`,
    id: 'noObjectExists',
  };
  return buildResponse(request, response, JSON.stringify(object), 400);
};

const getAllDecks = (request, response) => {
  buildResponse(request, response, JSON.stringify(decks), 200);
};

const getNotFound = (request, response) => {
  const message = 'The page you were looking for was not found.';
  const id = 'notFound';
  const responseString = buildJSON(request, response, message, id);

  return buildResponse(request, response, responseString, 404);
};

module.exports = {
  getDecks,
  getAllDecks,
  getNotFound,
  buildJSON,
  buildResponse,
  getCardName,
  decks,
};
