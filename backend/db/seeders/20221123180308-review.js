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
          startDate: 'Great place to stay! I would love to come here again',
          stars: 4
        },
        {
          spotId: 3,
          userId: 3,
          startDate: 'not the cleanest place but it got the job done',
          stars: 3
        },
        {
          spotId: 4,
          userId: 4,
          startDate: 'this place is a steal. I absolutely loved this stay',
          stars: 4
        }

      ], {});
    },

    down: async (queryInterface, Sequelize) => {
      options.tableName = 'Reviews';
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete(options, {
        spotId: { [Op.in]: [1, 2, 3, 4] }
      }, {});
    }
  };
