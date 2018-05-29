const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var count = {}
module.exports = function (app) {

  app.post("/api/query", function (req, res) {
    console.log(req.body)
    res.send(JSON.stringify(req.body.params, null, 2))
  })
  function wordSort(a,b) {
    if (count[a] > count[b])
      return -1;
    if (count[a] < count[b])
      return 1;
    return 0;
  }
  // GET route for getting all of the articles
  app.post("/api/articles", function (req, res) {
    var query = {}
    // var query = {
    //   SourceId: {
    //     [Op.or]: ["cnn", "bbc-news"]
    //   },
    //   author: {
    //     [Op.or]: ["Laura Hudson",
    //     "Brian Stelter",
    //     "Analysis by Chris Cillizza, CNN Editor-at-large",
    //     "Rebecca Berg, CNN",
    //     "Alex Marquardt And Lawrence Crook Iii",
    //     "Analysis by Oren Liebermann, CNN",
    //     "macamilarinc",
    //     "Kaitlan Collins, Sarah Westwood, Pamela Brown and Juana Summers, CNN",
    //     "BBC News"
    //     ]
    //   }
    // };
    // if (req.query.source_id) {
    //   query.SourceId = req.query.source_id;
    // }
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Source
    db.Article.findAll({
      where: query
    }).then(function (dbArticle) {
      var wordsObj = {}
      
      var words = []
      dbArticle.forEach(article => {
        console.log(article.title)
        article.title.split(" ").forEach(function(word) {
          count[word] = (typeof count[word] === "undefined") ? 1 : ++count[word]
          wordsObj[word] = count[word]
        })
      });
      for (var p in wordsObj) {
        words.push(p)
      }
      var result=[]
      words.sort(wordSort)
      for (var i = 0; i<words.length; i++) {
        console.log(words[i],count[words[i]])
      }
      res.json(words);
    });
  });

  // Get route for retrieving a single article
  app.get("/api/articles/:id", function (req, res) {
    db.Article.findOne({
      where: {
       sourceId: req.params.id
      },
      include: [db.Source]
    }).then(function (dbArticle) {
      res.json(dbArticle);
    });
  });
};