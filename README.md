# Seen
Track your day-to-day location patterns at MIT with the [MIT Heat Map](https://mit-heatmap-f60b83158200.herokuapp.com/)!

Made by Abhay Bestrapalli, Orion Foo, Nathan Xiong, and Ram Goel.

![alt text](https://media.discordapp.net/attachments/975839431468650589/1152843721168134285/image.png?width=1846&height=906)

## How it works

As you walk around MIT's campus, login to [MIT Heat Map](https://mit-heatmap-f60b83158200.herokuapp.com/) and click on your location on the map. Whenever you go to another building, click the new location on the map. We track the time spent at each location and use it to display a heat map of where you spend most of your time on campus. We also display the path of where you've visited throughout the day.

## Features

Our website has three main features for visualizing location data:

- **User Heat Map** - displays a heat map for the user's location data. See where you spend most of your time!
- **Combined Heat Map** - displays a heat map for all users' location data combined. See where everyone is spending most of their time!
- **Path Markers** - displays a set of markers for where the user has been in that day, and draws a path indicating the user's path for that day. The path decreases in opacity as time progresses so you can understand your entire path easier. See where you've been today!

We enable secure login with Google authentication.

Our heat map is based on the amount of time spent in a building. The more time between your location clicks, the more we increase your heat at the location. Your location is determined to be the MIT building your reported location is closest to. 

## What we used

We used the following technologies:
* [Leaflet.js](https://leafletjs.com/) for providing map data, and for adding features to the map. 
* [Express.js](https://expressjs.com/) and [Node.js](https://nodejs.org/en) 
* [MongoDB](https://www.mongodb.com/)  and [Mongoose](https://mongoosejs.com/docs/)
* [React](https://react.dev/)
* [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
* [MIT Building Data](https://whereis.mit.edu/)