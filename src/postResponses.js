const query = require('querystring');
const getHandler = require('./getResponses');
const htmlHandler = require('./htmlResponses');

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
    console.dir(getHandler.decks);
    let doesExist = false;
    let existingDeckIndex = -1;

    // Check if the deck already exists in our database.
    for (let i = 0; i < getHandler.decks.length; i++) {
      if (getHandler.decks[i].deckName === bodyParams.deckName) {
        doesExist = true;
        existingDeckIndex = i;
      } 
    }

    if (doesExist) { // If the user already exists, update them.
      const deck = getHandler.decks[existingDeckIndex];
      
      // Check if the added card already exists. If not, add it.
      let isNewCard = true;
      for (let j = 0; j < deck.deckList.length; j++) {
        if (deck.deckList[j].cardName === bodyParams.cardName) {
          isNewCard = false;
          deck.deckList[j].quantity ++;
        }
      }

      if (isNewCard) {
        const newCard = {
          'cardName': bodyParams.cardName,
          'quantity': 1,
        }
        deck.deckList.push(newCard);
      }

      getHandler.decks[existingDeckIndex] = deck;

      console.dir(deck);
      response.writeHead(204, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Updated!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    } else if (bodyParams.deckName && bodyParams.cardName && doesExist === false) { 
      // If both fields are full, create a new user.
      const jsonDeck = {
        'deckName': bodyParams.deckName,
        'deckList': [
          {
            'cardName': bodyParams.cardName,
            'quantity': 1,
          },
        ]
      };
      getHandler.decks.push(jsonDeck);

      response.writeHead(201, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Success!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    } else { // If either fields are missing, return a 400 error.
      response.writeHead(400, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Missing required deck parameters.',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    }
  });
};

//const searchDeck = (request, response) => {
//
//};

const openDeck = (request, response) => {
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

    // Store the sent deck name into memory for use after the deck-builder page loads.
    if (bodyParams.deckName) {
      getHandler.sentDeckName = bodyParams.deckName;
    }

    // Next, load the deck builder page.
    htmlHandler.getDeckBuilder(request, response);
  });
};

module.exports = {
  addDeck,
  //searchDeck,
  openDeck,
};
