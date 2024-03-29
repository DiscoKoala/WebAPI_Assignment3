/**
 * Created by shawnmccarthy on 1/22/17.
 */
'use strict;';
//Include crypto to generate the movie id
var crypto = require('crypto');
module.exports = function () {
    return {
        userList: [],
        /*
         * Save the user inside the "db".
         */
        save: function (user) {
            user.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
            this.userList.push(user);
            return 1;
        },
        /*
         * Retrieve a user with a given id or return all the users if the id is undefined.
         */
        find: function (id) {
            if (id) {
                return this.userList.find(function (element) {
                    return element.id === id;
                });
            }
            else {
                return this.userList;
            }
        },
        findOne: function (name) {
            if (name) {
                return this.userList.find(function (element) {
                    return element.username === name;
                });
            }
            else {
                return this.userList;
            }
        },
        /*
         * Delete a user with the given id.
         */
        remove: function (id) {
            var found = 0;
            this.userList = this.userList.filter(function (element) {
                if (element.id === id) {
                    found = 1;
                }
                else {
                    return element.id !== id;
                }
            });
            return found;
        },
        /*
         * Update a user with the given id
         */
        update: function (id, user) {
            var userIndex = this.userList.findIndex(function (element) {
                return element.id === id;
            });
            if (userIndex !== -1) {
                this.userList[userIndex].username = user.username;
                this.userList[userIndex].password = user.password;
                return 1;
            }
            else {
                return 0;
            }
        },
        //  /*
        //  * Functions for manipulating movie data
        //  */
//          updateMovie: function (id, movie) {
//             var movieIndex = this.movieList.findIndex(function (element) {
//                 return element.id === id;
//             });
//             if (movieIndex !== -1) {
//                 this.userList[movieIndex].title = movie.title;
//                 this.userList[movieIndex].id = movie.id;
//                 return 1;
//             }
//             else {
//                 return 0;
//             }
//         },

//         saveMovie: function (movie) {
//             movie.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
//             this.movieList.push(movie);
//             return 1;
//         },

//         removeMovie: function (id) {
//             var found = 0;
//             this.movieList = this.movieList.filter(function (element) {
//                 if (element.id === id) {
//                     this.movieList.slice(element);
//                     found = 1;
//                 }
//                 else {
//                     return element.id !== id;
//                 }
//             });
//             return found;
//         },

//         findMovie: function (id) {
//             if (id) {
//                 return this.movieList.find(function (element) {
//                     return element.id === id;
//                 });
//             }
//             else {
//                 return this.movieList;
//             }
//         },

//         findOneMovie: function (name) {
//             if (name) {
//                 return this.movieList.find(function (element) {
//                     if(element.title === name){
//                         return element;
//                     }
//                 });
//             }
//             else {
//                 return this.userList;
//             }
//         }
    
    };
};