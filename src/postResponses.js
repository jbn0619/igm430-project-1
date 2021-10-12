const query = require('querystring');
const mtg = require('mtgsdk');
const { card } = require('mtgsdk');
const getHandler = require('./getResponses');

const addDeck = (request, response) => {
  // THIS SECTION OF THE CODE WAS TAKEN AND ADAPTED FROM AN EXAMPLE REPO IN 430
  // GITHUB LINK: https://github.com/IGM-RichMedia-at-RIT/body-parse-example-done
  const body = [];

  // Check for errors.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Bundle all the data bytes together.
  request.on('data', (chunk) => {
    body.push(chunk);
  });

  // Proccess our data now.
  request.on('end', () => {
    // Piece together the new user.
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    let existingDeckIndex = -1;

    mtg.card.where({ name: bodyParams.cardName, pageSize: 1 })
      .then((cards) => {
        if (cards === undefined) {
          response.writeHead(400, { 'Content-Type': 'application/json' });
          const responseObj = {
            message: 'Card does not exist.',
            id: 'cardNotReal',
          };
          response.write(JSON.stringify(responseObj));
          response.end();
        } else {
          const cardName = cards[0].name;
          const cardText = cards[0].text;
          // Check if the deck already exists in our database.
          for (let i = 0; i < getHandler.decks.length; i++) {
            if (getHandler.decks[i].deckName === bodyParams.deckName) {
              existingDeckIndex = i;
            }
          }

          if (existingDeckIndex >= 0) { // If the user already exists, update them.
            const deck = getHandler.decks[existingDeckIndex];
            let cardIndex = -1;
            // Check if the added card already exists. If not, add it.
            for (let j = 0; j < deck.deckList.length; j++) {
              if (deck.deckList[j].cardName === cardName) {
                cardIndex = j;
              }
            }

            if (cardIndex >= 0) {
              getHandler.decks[existingDeckIndex].deckList[cardIndex].quantity++;
            } else {
              const newCard = {
                cardName,
                cardText,
                quantity: 1,
              };
              getHandler.decks[existingDeckIndex].deckList.push(newCard);
            }

            response.writeHead(201, { 'Content-Type': 'application/json' });
            const jsonDeck = getHandler.decks[existingDeckIndex];
            response.write(JSON.stringify(jsonDeck));
            response.end();
          } else if (bodyParams.deckName && bodyParams.cardName && existingDeckIndex === -1) {
            // If both fields are full, create a new user.
            const jsonDeck = {
              deckName: bodyParams.deckName,
              deckList: [
                {
                  cardName,
                  cardText,
                  quantity: 1,
                },
              ],
            };
            getHandler.decks.push(jsonDeck);
            console.dir(JSON.stringify(jsonDeck));

            response.writeHead(201, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(jsonDeck));
            response.end();
          } else { // If either fields are missing, return a 400 error.
            response.writeHead(400, { 'Content-Type': 'application/json' });
            const responseObj = {
              message: 'Missing required deck parameters.',
            };
            response.write(JSON.stringify(responseObj));
            response.end();
          }
        }
      });
  });
};

module.exports = {
  addDeck,
};
