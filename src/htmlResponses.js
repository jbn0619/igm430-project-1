const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const search = fs.readFileSync(`${__dirname}/../client/search.html`);
const deckbuild = fs.readFileSync(`${__dirname}/../client/deckBuilder.html`);

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

const getSearch = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(search);
  response.end();
};

const getDeckBuilder = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(deckbuild);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getSearch,
  getDeckBuilder,
};
