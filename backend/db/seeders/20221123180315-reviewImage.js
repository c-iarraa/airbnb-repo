'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'https://static.wikia.nocookie.net/spongefan/images/e/e1/SpongeBob_house.jpg/revision/latest?cb=20180210163257'
      },
      {
        reviewId: 2,
        url: 'https://i.pinimg.com/originals/72/c0/38/72c03844c98b9db78d6a29c85faa9e0e.png'
      },
      {
        reviewId: 3,
        url: 'https://static.wikia.nocookie.net/parody/images/f/f2/Squidward_house.png/revision/latest?cb=20150906222008'
      },
      {
        reviewId: 4,
        url: 'https://static.wikia.nocookie.net/spongebob/images/d/dc/MrKrabsAndPearlsHouseStock.png/revision/latest?cb=20221112230433'
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};
