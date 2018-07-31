require("dotenv").config();

var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var cmd     = require('node-command-line'),
    Promise = require('bluebird');


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
} else if (command === "my-tweets") {
  getTweets();
}
//If the third argument is "spotify-this-song, run spotify function"
else if (command === "spotify-this-song") {
  spotifyThis(songTitle);
}
//if third argument is do-what-i-say
else if (command === "do-what-it-says") {
  doWhatItSays();
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
      var OMDBresult =
        //Logs information requested in the console
        "Title:" + movieData.Title + "\n" +
        "Release Year:" + movieData.Year + "\n" +
        "IMDB Rating:" + movieData.imdbRating + "\n" +
        "Rotten Tomatoes Rating:" + movieData.Ratings[1].Value + "\n" +
        "Produced in:" + movieData.Country + "\n" +
        "Language:" + movieData.Language + "\n" +
        "Plot:" + movieData.Plot + "\n" +
        "Actors:" + movieData.Actors + "\n";

      //display this!
      console.log(OMDBresult);
      //Log this!!
      logTxt(OMDBresult);

    }

  })


}


//This will show your last 20 tweets and when they were created at in your terminal/bash window.
function getTweets() {

  var parameters = {
    screen_name: 'bearcreekwilson',
    limit: 20
  };

  client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      console.log("============BEHOLD MY MOST RECENT TWEETS============");

      for (var i = 0; i < tweets.length; i++) { //loops through tweets in object(see below)
        //create a variable that can be logged in my .txt file
        // console.log(tweets);
        var twitterResult =

          "@" + tweets[i].user.screen_name + ":" + " " + tweets[i].text + "\r\n" + "This tweet was brought to you at: " + tweets[i].created_at + "\n";

        // screen_name + ":" + tweets[i].text + "\n";
        // console.log(tweets[i].user.screen_name);
        // console.log(tweets[i].text + "\n");

        console.log(twitterResult);
        logTxt(twitterResult);
      }
    }
  })

}

function spotifyThis(songTitle) {
  songTitle = query;

  if (!songTitle){
    songTitle = "the sign";
  }

  spotify.search({
    type: 'track',
    query: songTitle,
    limit: 10
  }, function (err, data) {


    if (err) {
      return console.log('OH LAWD: ' + err);
    } 
    if(songTitle === "the sign"){
      var theSign =
      "Song Title: " + data.tracks.items[5].name + "\r\n" +
      "Artist" + data.tracks.items[5].artists[0].name + "\r\n" + 
      "Preview: " + data.tracks.items[5].preview_url + "\r\n" +
      "Album: " + data.tracks.items[5].album.name + "\n";

      console.log(theSign);
      logTxt(theSign);


      // console.log(data.tracks.items[5].artists[0]);
    }
    else {
      console.log("SEARCHING FOR.... " + songTitle + "\n");
      for (var i = 0; i < data.tracks.items.length; i++) {
        // console.log(data.tracks.items[i].artists[0].name);
        var track = data.tracks.items[i]

        var spotifyResult = //creating variable to post to log.txt
          "Song Title: " + track.name + "\r\n" +
          "Artist: " + track.artists[0].name + "\r\n" +
          "Preview: " + track.preview_url + "\r\n" +
          "Album: " + track.album.name + "\n";

        console.log(spotifyResult);
        logTxt(spotifyResult);
      }
    }





  })
}




//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
function doWhatItSays(){
fs.readFile("random.txt", "utf8", function(error, data){


  if (error) {
    return console.log(error);
  }

  // console.log(data);

  var songinText = data.split(",");

  console.log(songinText[0]);

  cmd.run('node ' + " " + 'liri.js' + " " + songinText[0] + " " + songinText[1]);
  
  
})

}











































//In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.

function logTxt(result) {
  //Make sure we append each command you run to the log.txt file.
  //Does not overwrite your file each time you run a command.
  fs.appendFile("dataLog.txt", result + "\n", function (err) {


    if (err) {
      console.log("OH GAWD" + err);
    } else {
      console.log("Good Lookin'! I've added this to your log ( ͡° ͜ʖ ͡°)");
    }
  });

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