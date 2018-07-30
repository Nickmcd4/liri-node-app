require("dotenv").config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var nodeArgs = process.argv;
var command = process.argv[2];
// Create an empty string for holding the full query
var query = "";

// Capture all the words in the query (again ignoring the first three Node arguments)
for (var i = 3; i < nodeArgs.length; i++) {

  // Build a string with the query.
  query = query + " " + nodeArgs[i];
}


var movieTitle = ""
var songTitle = ""

//if the third argument is "movie-this", run the imdb function
if (command === "movie-this") {
  omdbNow();
}

function omdbNow() {
  //query becomes movie title
  movieTitle = query;
  //console.log(movieTitle);



  //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  if (!movieTitle) {
    movieTitle = "Mr Nobody";
    console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");
    // console.log("LOOK HERE" + movieTitle);
  }

  //request OMDB for movie info 
  request("http://www.omdbapi.com/?t=" + movieTitle + "&apikey=trilogy", function (error, response, body) {
    //signifies successful request
    if (!error && response.statusCode === 200) {
      var movieData = JSON.parse(body);
      // console.log(movieData);
      console.log("Title:" + movieData.Title + "\n");
      console.log("Release Year:" + movieData.Year + "\n");
      console.log("IMDB Rating:" + movieData.imdbRating + "\n");
      console.log("Rotten Tomatoes Rating:" + movieData.Ratings[1].Value + "\n");
      console.log("Produced in:" + movieData.Country + "\n");
      console.log("Language:" + movieData.Language + "\n");
      console.log("Plot:" + movieData.Plot + "\n");
      console.log("Actors:" + movieData.Actors + "\n");


    }

  })
}































//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*IMBD-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*//


// if(command === "movie-this" && nodeArgs !== undefined){
// // Then run a request to the OMDB API with the movie specified
// var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";


// request(queryUrl, function(error, response, body) {

//   // If the request is successful
//   if (!error && response.statusCode === 200) {

//     // Parse the body of the site and recover just the imdbRating
//     // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//     console.log("Title of the movie:         " + JSON.parse(body).Title);
//     console.log("Release Year: " + JSON.parse(body).Year);
//     console.log("IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
//     console.log("Rotten Tomato Rating of the movie:   " + JSON.parse(body).Ratings[2].Value);
//     console.log("Produced in:   " + JSON.parse(body).Country);
//     console.log("Language:   " + JSON.parse(body).Language);
//     console.log("Plot:   " + JSON.parse(body).Plot);
//     console.log("Actors:   " + JSON.parse(body).Actors);
//   }
// });

// }
// if(command === "movie-this" && nodeArgs===""){
// // Then run a request to the OMDB API with the movie specified
// var queryUrl = "http://www.omdbapi.com/?t=" + "mr_nobody" + "&y=&plot=short&apikey=trilogy";


// request(queryUrl, function(error, response, body) {

//   // If the request is successful
//   if (!error && response.statusCode === 200) {

//     // Parse the body of the site and recover just the imdbRating
//     // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).

//     console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");

//   }
// });

// }