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
      .innerJoin('musicbrainz.release AS release', 'artist.id', 'release.artist_credit')
      .innerJoin('musicbrainz.area AS area', 'artist.area', 'area.id')
      .where('artist.name', '=', artist.name)
      .modify((qb) => {
        if (artist.release) {
          qb.where('release.name', '=', artist.release);
        }
      })
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
