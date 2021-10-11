const url = require('url');
const query = require('querystring');
const getHandler = require('./getResponses');

const deleteCard = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  console.dir('DeleteCard called!');

  // First, determine if the deck we're deleting a card from exists.
  let deckIndex = -1;
  let cardIndex = -1;
  for (let i = 0; i < getHandler.decks.length; i++) {
    if (getHandler.decks[i].deckName === params.deckName) {
      deckIndex = i;
      // If the deck has been found, check if the card exists within the deck.
      for (let j = 0; j < getHandler.decks[i].deckList.length; j++) {
        if (getHandler.decks[i].deckList[j].cardName === params.cardName) {
          cardIndex = j;
        }
      }
    }
  }

  if (deckIndex >= 0 && cardIndex >= 0) {
    // First, get the deck and save it.
    getHandler.decks[deckIndex].deckList[cardIndex].quantity--;
    // Check if the card needs to be entirely removed, or just have its quantity edited.
    if (getHandler.decks[deckIndex].deckList[cardIndex].quantity <= 0) {
      getHandler.decks[deckIndex].deckList.splice(cardIndex, 1);
    }

    response.writeHead(204, { 'Content-Type': 'application/json' });
    console.log(JSON.stringify(getHandler.decks[deckIndex]));
    response.write(JSON.stringify(getHandler.decks[deckIndex]));
    response.end();
  } else {
    response.writeHead(400, { 'Content-Type': 'application/json' });
    const responseObj = {
      message: 'Improper information sent. No cards deleted from deck.',
    };
    response.write(JSON.stringify(responseObj));
    response.end();
  }
};

const deleteDeck = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
};

module.exports = {
  deleteCard,
  deleteDeck,
};
