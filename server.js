/*
CSC3916 HW3
File: Server.js
Description: Web API scaffolding for Movie API
 */
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

// router.get('/movies', (req, res) => {
//     var movie = Movie.findOneMovie(req.body.title);

//     if(!movie){
//         res.status(404).send({success: false, message: 'Query failed. Movie not found.'});
//     } else {
//         if(req.body.title == movie.title) {
//             var movieToken = { id: movie.title };
//             var token = jwt.sign(movieToken, process.env.UNIQUE_KEY)
//             res.status(200).json({success: true, message: 'GET movies', token: token});
//         }
//         else{
//             res.status(404).send({success: false, message: 'Query failed.'});
//         }
//     }
// });

// router.post('/movies', (req, res) => {
//     if(!req.body.title){
//         res.json({success: false, msg: 'Please include movie title.'})
//     }else {
//         var newMovie = new Movie()
//         newMovie.title = req.body.title;
//         newMovie.releaseDate = req.body.releaseDate;
//         newMovie.genre = req.body.genre;
//         newMovie.actorList = req.body.actorList;
//     }
//     Movie.saveMovie(newMovie); //no duplicate checking
//     var token = jwt.sign(newMovie, process.env.UNIQUE_KEY);
//     res.status(200).json({success: true, message: 'movie saved', token: token});
// });

// router.delete('/movies', authController.isAuthenticated, (req, res) => {
//     var movie = Movie.findOneMovie(req.body.title);

//     if(!movie){
//         res.status(404).send({success: false, message: 'Query failed. Movie not found.'});
//     } else{
//         if(req.body.title == movie.title){
//             Movie.removeMovie(movie);
//             res.status(200).json({success: true, message: 'movie deleted'});
//         }
//         else{
//         res.status(404).send({success: false, message: 'Query failed. Movie not found.'});
//         }
//     }
// });

// router.put('/movies', authJwtController.isAuthenticated, (req, res) => {
//     var movie = Movie.findOneMovie(req.body.title);

//     if(!movie){
//         res.status(404).send({success: false, message: 'Query failed. Movie not found.'});
//     } else{
//         if(req.body.title == movie.title){
//             Movie.updateMovie(movie.id, movie);
//             var movieToken = {title: movie.title};
//             var token = jwt.sign(movieToken, process.env.UNIQUE_KEY)
//             res.status(200).json({success: true, message: 'movie updated', token: token});
//         }
//         else{
//         res.status(404).send({success: false, message: 'Query failed. Movie not found.'});
//         }
//     }
// });

router.route('/testcollection')
    .delete(authController.isAuthenticated, (req, res) => {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    }
    )
    .put(authJwtController.isAuthenticated, (req, res) => {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        var o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    }
    );

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


