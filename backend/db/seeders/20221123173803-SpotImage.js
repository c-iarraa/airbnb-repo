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
        url: 'https://artincontext.org/wp-content/uploads/2022/07/Biggest-House-in-the-World-848x530.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://i.pinimg.com/736x/ae/6f/ac/ae6fac72fd18b901ef70682f66c6a800.jpg',
        preview: false,
      },
      {
        spotId: 3,
        url: 'https://943thepoint.com/files/2022/01/attachment-5-1-1.JPG',
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
