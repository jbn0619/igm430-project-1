const query = require('querystring');
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

    if (getHandler.decks[bodyParams.deckName]) { // If the user already exists, update them.
      getHandler.decks[bodyParams.deckName] = bodyParams;

      response.writeHead(204, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Updated!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    } else if (bodyParams.deckName && bodyParams.decklist) { // If both fields are full, create a new user.
      getHandler.decks[bodyParams.deckName] = bodyParams;

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

const addCard = (request,response) =>{
  const card =[];

  // Check for errors.
  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  // Bundle all the data bytes together.
  request.on('data', (chunk) => {
    card.push(chunk);
  });

  request.on('end',()=>{
    const cardString = Buffer.concat(card).toString();
    const cardParams = query.parse(cardString);

    if(getHandler.decks[cardParams.deckName].decklist[cardParams.cardName]){
      getHandler.decks[cardParams.deckName].decklist[cardParams.cardName].quantity++;

      response.writeHead(204, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Updated!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    }
    else if(getHandler.decks[cardParams.deckName] && cardParams.cardName){
      getHandler.decks[cardParams.deckName].decklist[cardParams.cardName]=cardParams;

      response.writeHead(201, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Success!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    }
    else{
      response.writeHead(400, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Missing required parameters.',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    }
  })
}

const searchDeck = (request, response) => {

};

const openDeck = (reqeust, response) => {

};

module.exports = {
  addDeck,
  addCard,
  searchDeck,
  openDeck,
};
