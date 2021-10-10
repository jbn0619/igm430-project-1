const query = require('querystring');
const getHandler = require('./getResponses');
const htmlHandler = require('./htmlResponses');

const deleteCard = (request, response) => {

};

const deleteDeck = (request, response) => {
    const parsedUrl = url.parse(request.url);
    const params = query.parse(parsedUrl.query);

    
};

module.exports = {
    deleteCard,
    deleteDeck,
}