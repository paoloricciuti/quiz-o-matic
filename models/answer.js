'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Answer.belongsTo(models.User, { constraints: false });
      Answer.belongsTo(models.Chat, { constraints: false });
      Answer.belongsTo(models.Poll, { constraints: false });
    }
  };
  Answer.init({
    poll_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    chat_id: DataTypes.STRING,
    answer: DataTypes.INTEGER,
    time_to_answer: DataTypes.INTEGER,
    correct: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Answer',
    underscored: true,
  });
  return Answer;
};