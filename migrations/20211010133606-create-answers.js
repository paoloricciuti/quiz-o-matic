'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      poll_id: {
        type: Sequelize.STRING,
        references: { model: 'polls', key: 'id', as: 'poll_id', constraints: false }
      },
      user_id: {
        type: Sequelize.STRING,
        references: { model: 'users', key: 'id', as: 'user_id', constraints: false }
      },
      chat_id: {
        type: Sequelize.STRING,
        references: { model: 'chats', key: 'id', as: 'chat_id', constraints: false }
      },
      answer: {
        type: Sequelize.INTEGER
      },
      correct: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('answers');
  }
};