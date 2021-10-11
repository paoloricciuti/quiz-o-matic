'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('polls', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      chat_id: {
        type: Sequelize.STRING,
        references: { model: 'chats', key: 'id', as: 'chat_id' }
      },
      correct_option: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('polls');
  }
};