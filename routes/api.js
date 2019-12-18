const express = require('express');

const router = express.Router();
const knex = require('../db/knex');

require('dotenv').config();

router.get('/api/artist-locations', async (req, res) => {
  const artists = JSON.parse(req.query.artists);

  console.log(artists);

  const artistLocations = [];

  const promises = artists.map(async (artist) => {
    const results = await knex
      .select('area.name')
      .from('musicbrainz.artist AS artist')
      .join('musicbrainz.area AS area', 'artist.area', 'area.id')
      .leftJoin('musicbrainz.release AS release', 'artist.id', 'release.artist_credit')
      .modify((qb) => {
        if (artist.release) {
          const words = artist.release.split(' ').map((w) => w.toLowerCase());
          const wordsWithoutArticles = words.filter((w) => !['the', 'a', 'an', 'of', 'from'].contains(w));
          const match = wordsWithoutArticles.length ? `%${wordsWithoutArticles[0]}%` : `%${words[0]}%`;

          qb.and('release.name', 'ilike', match);
        }
      })
      .where('artist.name', 'ilike', artist.name)
      .limit(1);

    if (results.length) {
      artistLocations.push({
        artist: artist.name,
        country: results[0].name,
      });
    }
  });

  await Promise.all(promises).then(() => res.json(artistLocations));
});

module.exports = router;
