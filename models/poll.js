'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Poll.belongsTo(models.Chat, { constraints: false });
      Poll.hasMany(models.Answer, { constraints: false });
    }
  };
  Poll.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    chat_id: DataTypes.STRING,
    correct_option: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Poll',
    underscored: true,
  });
  return Poll;
};