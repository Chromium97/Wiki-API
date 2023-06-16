const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//connecting to local db
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

//schema creation
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

//model creation
const Article = mongoose.model("Article", articleSchema);


//requests targeting all articles through chaining
app.route('/articles').get((req, res) => {
    //find the articles in db, send to user
    Article.find().then(articles => {
        res.send(articles);
    }).catch((err) => {
        console.log(err);
        res.status(500);
    })
}).post((req, res) => {
    //create a new article, if successful, send success message if article is made
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save().then(articles => {
        res.send('Added article!');
    }).catch((err) => {
        console.log(err);
        res.status(500);
    });
}).delete((req, res) => {
    //delete all articles from db
    Article.deleteMany().then(articles => {
        res.send('Deleted all articles')
    }).catch((err) => {
        console.log(err);
        res.status(500);
    });
});

//requests targeting specific articles
app.route('/articles/:articleTitle').get((req, res) => {
    //store searched parameter
    let searchedArticle = req.params.articleTitle;

    //find based of searchedArticle and return to user
    Article.findOne({ title: searchedArticle }).then(foundArticle => {
        res.send(foundArticle);
    }).catch((err) => {
        console.log(err);
        res.status(500);
    })
}).put((req, res) => {
    //store searched parameter
    let searchedArticle = req.params.articleTitle;

    //find and update based of searchedArticle and return success message to user
    Article.updateOne({ title: searchedArticle }, { title: req.body.title, content: req.body.content }).then(article => {
        res.send('Successfully updated article');
    }).catch((err) => {
        console.log(err);
        res.status(500);
    })
}).patch((req, res) => {
    //store searched parameter
    let searchedArticle = req.params.articleTitle;

    //find and patch based of searchedArticle and return success message to user
    Article.updateOne({ title: searchedArticle }, { $set: req.body }).then(updatedArticle => {
        res.send('Successfully patched article')
    }).catch((err) => {
        console.log(err);
        res.status(500);
    })
}).delete((req, res) => {
    //store searched parameter
    let searchedArticle = req.params.articleTitle;

    //find and delete based of searchedArticle and return success message to user
    Article.deleteOne({ title: searchedArticle }).then(deletedArticle => {
        res.send('Successfully deleted article');
    }).catch((err) => {
        console.log(err);
        res.status(500);
    })
});

//app start up
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});