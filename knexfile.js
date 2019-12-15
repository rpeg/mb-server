require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: '',
      password: '',
      database: 'musicbrainz',
    },
  },

  production: {
    client: 'pg',
    debug: true,
    connection: process.env.DATABASE_URL,
    ssl: true,
  },
};
