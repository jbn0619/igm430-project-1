const fs = require('fs');
const url = require('url');
const query = require('querystring');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const search = fs.readFileSync(`${__dirname}/../client/search.html`);
const deckbuild = fs.readFileSync(`${__dirname}/../client/deckBuilder.html`);
const getHandler = require('./getResponses');

let savedSearchName = '';
let savedOpenDeckName = '';

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getSearch = (request, response, deckName) => {
  if (deckName) {
    savedSearchName = deckName;
  }
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(search);
  response.end();
};

const determineSearch = (request, response) => {
  if (savedSearchName !== null) {
    getHandler.getDecks(request, response, savedSearchName);
  }
};

const getDeckBuilder = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (params.deckName) {
    savedOpenDeckName = params.deckName;
  }

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(deckbuild);
  response.end();
};

const determineOpenDeck = (request, response) => {
  let tempSave = savedOpenDeckName;
  savedOpenDeckName = '';
  if (tempSave === '') {
    tempSave = null;
  }

  if (tempSave !== null) {
    getHandler.getDecks(request, response, tempSave);
  } else {
    const object = {
      message: 'No deck was opened.',
      id: 'noOpen',
    };
    getHandler.buildResponse(request, response, JSON.stringify(object), 200);
  }
};

module.exports = {
  getIndex,
  getCSS,
  getSearch,
  getDeckBuilder,
  determineSearch,
  determineOpenDeck,
};
