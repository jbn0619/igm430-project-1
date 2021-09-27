// Returns a head request for getUsers.
const getUsersHead = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

// Returns a head request for notFound.
const getNotFoundHead = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end();
};

module.exports = {
  getUsersHead,
  getNotFoundHead,
};
