const query = require('querystring');
const getHandler = require('./getResponses');

const addUser = (request, response) => {
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

    if (getHandler.users[bodyParams.name]) { // If the user already exists, update them.
      getHandler.users[bodyParams.name] = bodyParams;

      response.writeHead(204, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Updated!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    } else if (bodyParams.name && bodyParams.age) { // If both fields are full, create a new user.
      getHandler.users[bodyParams.name] = bodyParams;

      response.writeHead(201, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Success!',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    } else { // If either fields are missing, return a 400 error.
      response.writeHead(400, { 'Content-Type': 'application/json' });
      const responseObj = {
        message: 'Missing required user parameters.',
      };
      response.write(JSON.stringify(responseObj));
      response.end();
    }
  });
};

module.exports = {
  addUser,
};
