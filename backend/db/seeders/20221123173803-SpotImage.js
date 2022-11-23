'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://i.ytimg.com/vi/5nCEUz4bpN0/maxresdefault.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://static.wikia.nocookie.net/disney/images/7/7f/Mickey_Mouse_Clubhouse_theme.png/revision/latest?cb=20180506175201',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://preview.redd.it/u3rj7kign7o21.jpg?auto=webp&s=ec254b7cc12f391eb8d6c1a7380eef2aa786213e',
        preview: true,
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
