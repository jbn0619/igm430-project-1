const buildResponseMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getDecksMeta = (request, response) => buildResponseMeta(request, response, 204);
const getAllDecksMeta = (request, response) => buildResponseMeta(request, response, 204);
const getNotFoundMeta = (request, response) => buildResponseMeta(request, response, 404);

module.exports = {
  getDecksMeta,
  getAllDecksMeta,
  getNotFoundMeta,
};
