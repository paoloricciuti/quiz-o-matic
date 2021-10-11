'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.hasMany(models.Poll, {
        foreignKey: "chat_id",
      })
    }
  };
  Chat.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    chat: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    hours: DataTypes.ARRAY(DataTypes.INTEGER),
    locale: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Chat',
    underscored: true,
  });
  return Chat;
};