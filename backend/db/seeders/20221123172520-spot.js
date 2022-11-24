'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots'
    return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: '24025 La Paz Way',
      city: 'Hayward',
      state: 'California',
      country: 'USA',
      lat: 37.6578426,
      lng: -122.0994482,
      name: 'Tow Mater',
      description: 'small, affordable, and cute little townhouse',
      price: 1400,
    },
    {
      ownerId: 2,
      address: '74017 Inglewood Street',
      city: 'Hayward',
      state: 'California',
      country: 'USA',
      lat:  37.668819,
      lng:  -122.080795,
      name: 'Doc Hudson',
      description: 'small, not so cute two bedroom apartment',
      price: 1500,
    },
    {
      ownerId: 3,
      address: '97943 Hotdiggidydog Road',
      city: 'Hayward',
      state: 'California',
      country: 'USA',
      lat:  37.668819,
      lng:  -122.080795,
      name: 'Mickey Mouse',
      description: 'silly, little goofy house unique in its own way',
      price: 2600
    },
  ]);
},


down: async (queryInterface, Sequelize) => {
  options.tableName = 'Spots';
  const Op = Sequelize.Op;
  return queryInterface.bulkDelete(options, {
    address: { [Op.in]: ['24025 La Paz Way', '74017 Inglewood Street', '97943 Hotdiggidydog Road'] }
  }, {});
}
};
