exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? /.*top-spotify.herokuapp.com/
  : ['http://localhost:3001/', /.*3001.*/];