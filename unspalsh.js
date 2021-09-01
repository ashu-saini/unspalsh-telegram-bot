const { createApi } = require('unsplash-js');
const fetch = require('node-fetch');
require('dotenv').config();

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_KEY,
  fetch: fetch
});

module.exports = unsplash;