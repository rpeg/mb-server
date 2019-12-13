const { Model } = require('objection');
const knex = require('../db/knex');

Model.knex(knex);

class Release extends Model {
  static get tableName() {
    return 'musicbrainz.release';
  }
}

module.exports = Release;
