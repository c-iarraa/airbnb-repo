'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
 options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 up: async (queryInterface, Sequelize) => {
   options.tableName = 'Bookings';
   return queryInterface.bulkInsert(options, [
     {
       spotId: 1,
       userId: 1,
       startDate: '10-10-2022',
       endDate: '10-15-2022',
     },
     {
       spotId: 2,
       userId: 2,
       startDate: '11-11-2022',
       endDate: '11-16-2022',
     },
     {
       spotId: 3,
       userId: 3,
       startDate: '12-12-2022',
       endDate: '12-17-2022',
     }
   ], {});
 },


 down: async (queryInterface, Sequelize) => {
   options.tableName = 'Bookings';
   const Op = Sequelize.Op;
   return queryInterface.bulkDelete(options, {
     spotId: { [Op.in]: [1, 2, 3, 4] }
   }, {});
 }
};
