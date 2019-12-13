const { Model } = require('objection');
const knex = require('../db/knex');
const Area = require('./Area');
const Release = require('./Release');

Model.knex(knex);

class Artist extends Model {
  static get tableName() {
    return 'musicbrainz.artist';
  }

  static get relationMappings() {
    return {
      release: {
        relation: Model.HasManyRelation,
        modelClass: Release,
        join: {
          from: 'musicbrainz.release.artist_credit',
          to: 'musicbrainz.artist.id',
        },
      },
      area: {
        relation: Model.HasOneRelation,
        modelClass: Area,
        join: {
          from: 'musicbrainz.area.id',
          to: 'musicbrainz.artist.area',
        },
      },
    };
  }
}

module.exports = Artist;
