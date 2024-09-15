# Seen

Made by Abhay Bestrapalli, Mason Fang, Orion Foo, and Nathan Xiong.

![alt text](https://media.discordapp.net/attachments/975839431468650589/1152843721168134285/image.png?width=1846&height=906)

## How it works



## Features

Our website has three main features for visualizing location data:

- **User Heat Map** - displays a heat map for the user's location data. See where you spend most of your time!
- **Combined Heat Map** - displays a heat map for all users' location data combined. See where everyone is spending most of their time!
- **Path Markers** - displays a set of markers for where the user has been in that day, and draws a path indicating the user's path for that day. The path decreases in opacity as time progresses so you can understand your entire path easier. See where you've been today!

We enable secure login with Google authentication.

Our heat map is based on the amount of time spent in a building. The more time between your location clicks, the more we increase your heat at the location. Your location is determined to be the MIT building your reported location is closest to. 

## What we used

We used the following technologies:
* [Vanta.js](https://leafletjs.com/) for providing smooth and clean animated website backgrounds. 
* [Node.js](https://nodejs.org/en) 
* [MongoDB](https://www.mongodb.com/)
* [React](https://react.dev/)
* [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
