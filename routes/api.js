const express = require('express');
const axios = require('axios');

const router = express.Router();
const knex = require('../db/knex');

require('dotenv').config();

const COUNTRY_TYPE = 1;

router.get('/api/artist-locations', async (req, res) => {
  const artists = JSON.parse(req.query.artists);

  const artistLocations = [];

  const promises = artists.map(async (artist) => {
    const words = artist.release.split(' ').map((w) => w.toLowerCase());
    const wordsWithoutArticles = words.filter((w) => !['the', 'a', 'an', 'of', 'from'].includes(w));
    const match = wordsWithoutArticles.length ? `%${wordsWithoutArticles[0]}%` : `%${words[0]}%`;

    const rows = await knex
      .select('area.*')
      .from('musicbrainz.artist AS artist')
      .join('musicbrainz.area AS area', 'artist.area', 'area.id')
      .join('musicbrainz.release AS release', (qb) => {
        qb.on('artist.id', '=', 'release.artist_credit');
        qb.andOnVal('release.name', 'ilike', match);
      }, 'left')
      .where('artist.name', 'ilike', artist.name)
      .limit(1);

    if (rows.length) {
      const row = rows[0];

      let country = '';

      if (row.type === COUNTRY_TYPE) {
        country = row.name;
      } else {
        await axios.get(`http://api.geonames.org/searchJSON?q=${row.name}&maxRows=1&username=${process.env.GEONAMES_USER}`)
          .then((result) => {
            if (result.data.geonames && result.data.geonames.length) {
              country = result.data.geonames[0].countryName;
            }
          })
          .catch((err) => console.log(err));
      }

      artistLocations.push({
        artist: artist.name,
        country,
      });
    }
  });

  await Promise.all(promises).then(() => res.json(artistLocations));
});

module.exports = router;
