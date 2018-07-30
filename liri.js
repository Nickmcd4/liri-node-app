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

// Capture all the words in the query (again ignoring the first two Node arguments)
for (var i = 3; i < nodeArgs.length; i++) {

  // Build a string with the query.
  query = query + " " + nodeArgs[i];
}



//-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*IMBD-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*//

// var movieThis = function(movieQuery) {
// 	// Load request npm module
// 	var request = require("request");

// 	// if query that is passed in is undefined, Mr. Nobody becomes the default
// 	if(movieQuery === undefined) {
// 		movieQuery = "mr nobody";
// 	}

// 	// HTTP GET request
// 	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json", function(error, response, body) {
// 	  if (!error && response.statusCode === 200) {
// 	    console.log("* Title of the movie:         " + JSON.parse(body).Title);
// 	    console.log("* Year the movie came out:    " + JSON.parse(body).Year);
// 	    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
// 	    console.log("* Country produced:           " + JSON.parse(body).Country);
// 	    console.log("* Language of the movie:      " + JSON.parse(body).Language);
// 	    console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
// 	    console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

// 	    // For loop parses through Ratings object to see if there is a RT rating
// 	    // 	--> and if there is, it will print it
// 	    for(var i = 0; i < JSON.parse(body).Ratings.length; i++) {
// 	    	if(JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
// 	    		console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
// 	    		if(JSON.parse(body).Ratings[i].Website !== undefined) {
// 	    			console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
// 	    		}
// 	    	}
// 	    }
// 	  }
// 	});
// }


// if(command === "movie-this") {
//     movieThis(query);
// }

if(command === "movie-this"){
// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";


request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("* Title of the movie:         " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
    console.log(response);
  }
});

}
