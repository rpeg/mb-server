const { Model } = require('objection');
const knex = require('../db/knex');

Model.knex(knex);

class Area extends Model {
  static get tableName() {
    return 'musicbrainz.area';
  }
}

module.exports = Area;
