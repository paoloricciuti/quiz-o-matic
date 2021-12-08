'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("chats", "hours", {
      type: Sequelize.STRING,
      defaultValue: "$10$$12$$14$"
    });
    await queryInterface.addColumn("answers", "time_to_answer", {
      type: Sequelize.INTEGER,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chats', 'hours', {});
    await queryInterface.removeColumn('answers', 'time_to_answer', {});
  }
};
