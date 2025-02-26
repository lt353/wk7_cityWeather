/*
Name: Lindsay Trenton
Original Author: Debasis Bhattacharya
Assignment: City Name Weather App with OpenWeather API

Description: This code creates a Node.js server using Express, fetches weather data from the OpenWeather API based on a city name input, and displays the results on a webpage. What I have changed is from the professors original code is it uses my own API key (stored in secrets), it now searches by city name instead of zip code, and it outputs more information than previously (including humidity, feels like temperature, and wind speed).

Date: 2/26/2025
Packages Used:
  - express: Used to create the server and handle HTTP requests.
  - https: Used to send and receive data from external servers (OpenWeather API).
  - body-parser: Used to parse form data submitted by the user (city name input).
Environment Variables:
  - lindsayKey: Stores the OpenWeather API key for authentication.
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

//app.use is a middleware function that allows us to use the body-parser 
app.use(bodyParser.urlencoded({extended: true}));

// sets up the root route ("/") to show the index.html file
// __dirname gives the path to the current folder
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html") // sends the HTML file to the browser
});

// handles what happens when someone submits the form
app.post("/", function(req, res) {
    // grabs the city name input from the form and converts it to a string, which it should be anyways
    var city = String(req.body.cityInput);
    // prints the city name to the console to check if it works
    console.log(req.body.cityInput);

    // sets the temperature units to Fahrenheit
    const units = "imperial";
    // gets the API key from the environment variable I created using Secrets. I had to remember to recreate this secrets key as it caused an error when I assumed it was saved from the previous assignment.
    const apiKey = process.env['lindsayKey'];
    /* builds the URL we’ll use to get weather info from OpenWeather
     * https://api.openweathermap.org is the base URL
     * /data/2.5/weather is the path to the API endpoint
     * ?q=" + city +  "&units=" + units + "&APPID=" + apiKey are the multiple query parameters which are key-value pairs. 
     */
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&units=" + units + "&APPID=" + apiKey;
    
    // this gets the data from Open WeatherPI by making a GET request to the URL
    https.get(url, function(response){
    console.log(response.statusCode); // prints the status code on console
        
    // listens for chunks of data coming from the API
    response.on("data", function(data){
        //Deserialization - meaning converting the data into a JavaScript object called weatherData
        const weatherData = JSON.parse(data); 
        const temp = weatherData.main.temp;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;
        const feelsLike = weatherData.main.feels_like; 
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"; // creates the URL for the weather icon
            
            // Displays the weather info on the page
            res.write("<h1> The weather is " + weatherDescription + "<h1>");
            res.write("<h2>The temperature in " + city + " is " + temp + "°F, though it feels like " + feelsLike + "°F. <br> Likely because the humidity is " + humidity + "% and the wind speed is " + windSpeed + "m/h.<h2>");
            res.write("<img src=" + imageURL +">");
            res.send();
        });
    });
})

//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function() {
console.log ("Server is running on port")
});
