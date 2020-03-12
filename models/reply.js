'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    comment: DataTypes.STRING,
    TweetId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet)
    Reply.belongsTo(models.User)
  };
  return Reply;
};