const decks = [];

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

const getDecks = (request, response, deckName) => {
  for (let i = 0; i < decks.length; i++) {
    if (decks[i].deckName === deckName) {
      buildResponse(request, response, JSON.stringify(decks[i]), 200);
    }
  }

  if (!deckName) {
    const object = {
      message: 'No deckname was specified. Enter a deckname and try again.',
      id: 'missingParams',
    };
    buildResponse(request, response, JSON.stringify(object), 400);
  } else {
    const object = {
      message: `The deck ${deckName} does not exist.`,
      id: 'noObjectExists',
    };
    buildResponse(request, response, JSON.stringify(object), 400);
  }
};

// const getAllDecks = (request, response) => {
//
// };

// #endregion

const getNotFound = (request, response) => {
  const message = 'The page you were looking for was not found.';
  const id = 'notFound';
  const responseString = buildJSON(request, response, message, id);

  buildResponse(request, response, responseString, 404);
};

module.exports = {
  getDecks,
  // getAllDecks,
  getNotFound,
  buildJSON,
  buildResponse,
  decks,
};
