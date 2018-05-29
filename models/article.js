module.exports = function (sequelize, DataTypes) {
  var Article = sequelize.define("Article", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    urlToImage: DataTypes.STRING,
    publishedAt: DataTypes.DATE
  }, {
    timestamps: false,
    indexes: [{
      unique: true,
      fields: ['url']
    }]
  });

  return Article;
};