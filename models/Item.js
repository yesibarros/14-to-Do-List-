const S = require('sequelize');
const db = require('../db');

class Item extends S.Model {}

Item.init({
  title: {
    type: S.STRING,
    allowNull: false,
  },
  isCompleted: {
    type: S.BOOLEAN,
    defaultValue: false,
  },
}, { sequelize: db, modelName: 'item' });

module.exports = Item;