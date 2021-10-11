const url = require('url');
const query = require('querystring');
const getHandler = require('./getResponses');
const htmlHandler = require('./htmlResponses');

const deleteCard = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);

    console.dir("DeleteCard called!");

    // First, determine if the deck we're deleting a card from exists.
    let deckIndex = -1;
    let cardIndex = -1;
    for (let i = 0; i < getHandler.decks.length; i++) {
        if (getHandler.decks[i].deckName === params.deckName) {
            deckIndex = i;
            console.dir(getHandler.decks[i]);

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
        let editedDeck = getHandler.decks[deckIndex];
        let removedCard = editedDeck[cardIndex];
        removedCard.quantity --;
        // Check if the card needs to be entirely removed, or just have its quantity edited.
        if (removedCard.quantity <= 0) {
            editedDeck.splice(cardIndex, 1);
        }
        else { // Update the deck with new information.
            editedDeck[cardIndex] = removedCard;
            getHandler.decks[deckIndex] = editedDeck;
        }

        response.writeHead(204, { 'Content-Type': 'application/json' });
        console.log(JSON.stringify(decks[i]));
        response.write(JSON.stringify(decks[i]));
        response.end();
    }
    else {
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
}