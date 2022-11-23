'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      options.tableName = 'Reviews';
      return queryInterface.bulkInsert(options, [
        {
          spotId: 1,
          userId: 1,
          review: 'loved it, everything was perfect. I will be coming back here sooner or later',
          stars: 5
        },
        {
          spotId: 2,
          userId: 2,
          review: 'Great place to stay! I would love to come here again',
          stars: 4
        },
        {
          spotId: 3,
          userId: 3,
          review: 'not the cleanest place but it got the job done',
          stars: 3
        },
      ], {});
    },

    down: async (queryInterface, Sequelize) => {
      options.tableName = 'Reviews';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        spotId: { [Op.in]: [1, 2, 3] }
      }, {});
    }
  };
