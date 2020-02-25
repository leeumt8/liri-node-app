// reqs and initial vars/consts
require("dotenv").config();
var fs = require("fs");
var moment = require("moment");
var axios = require("axios");
var keys = require("./keys.js");
const Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);


//argv vars
let command = process.argv[2];
let search = process.argv[3];

// case switch 
switch (command) {
    case "concert-this":
        concertThis(search);
        break;
    case "spotify-this-song":
        spotifyThis(search);
        break;
    case "movie-this":
        movieThis(search);
        break;
    case "do-what-it-says":
        randomThis();
        break;
};

//conert-this function
function concertThis(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function(response) {
            if (response.data[0].venue) {
                console.log("Venue: " + response.data[0].venue.name);
                console.log("Location: " + response.data[0].venue.city);
                var eventTime = moment(response.data[0].datetime);
                console.log("Event Time: " + eventTime.format("dddd, MMMM, Do YYYY"));
            } else {
                console.log("No results, please refer to the guide.");
            }
        }
    ).catch(function (error) {
        console.log(error);
    });
};

//spotify-this function
function spotifyThis(song) {
    spotify.search({type: 'track', query: song}).then(function(response) {
        if (response.tracks.total === 0) {
            defaultSpotify();
        } else {
            console.log("Artist: " + response.tracks.items[0].artists[0].name);
            console.log("Track: " + response.tracks.items[0].name);
            console.log("Preview URL: " + response.tracks.items[0].preview_url);
            console.log("Album: " + response.tracks.items[0].album.name);
        }
    }).catch(function (error) {
        console.log(error);
        console.log("No results found, but here's 'The Sign'");
    });
};

//default spotify function
function defaultSpotify() {
    spotify.search({type: 'track', query: 'The Sign'}).then(function(response) {
        for (var i = 0; i < response.tracks.length; i++) {
            if (response.tracks.items[i].artists[0].name === "Ace of Base") {
                console.log("Artist: " + response.tracks.items[0].artists[0].name);
                console.log("Track: " + response.tracks.items[0].name);
                console.log("Preview URL: " + response.tracks.item[0].preview_url);
                console.log("Album: " + response.tracks.items[0].album.name);
                i = response.tracks.items.length;
            }
        }
    }).catch(function (error) {
        console.log(error);
        console.log("No results found, but here's....wait....")
    });
};

//movie-this function
function movieThis(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
            if (response.data.Title) {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("Rating: " + response.data.imdbRating);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            } else {
                movieThis("Mr. Nobody");
            }
        }
    ).catch(function (error) {
        console.log(error);
        console.log("No results found.");
    });
};

//random this function
function randomThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        var dataArray = data.split(",");
        spotifyThis(dataArray[1]);
        if (error) {
            return console.log(error);
        }
    })
}