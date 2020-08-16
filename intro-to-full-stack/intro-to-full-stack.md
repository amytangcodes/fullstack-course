###### [[Module Home](README.md)]

## What is "the full stack"?

Full stack is a combination of front end (also referred to as client side) and back end (also referred to as server side) to create and work on application code that crosses browser, server and database. 

Full stack developers generally have awareness of both the client side and the server side, and are able to work with any component of an application's technical stack.

<img src="https://user-images.githubusercontent.com/2818462/53781744-0f2d5d00-3ed8-11e9-9fb4-10005d4fb29b.png">

## What is our "full stack"?

Our stack will utilize JavaScript on the back end. JavaScript has become an immensely popular back end language due to its familiarity to developers coming from a variety of backgrounds, lack of necessity of compilation, a large number of shared libraries, and much more.

<img src="https://user-images.githubusercontent.com/2818462/53781773-308e4900-3ed8-11e9-966a-6d22f4f5931e.png">

Full Stack developers typically build **web applications**:
- Website + API + Database = Web Application

For this class, this will look like:
- React + Node (Express) + MongoDB = Your Final Project

This will be our stack. And since it allows us to deliver an end to end solution, we can call it a **full stack**.

## Languages

We will use the following languages in the class:

Front end languages:
- HTML
- CSS
- JavaScript (ES6)

Back end languages:
- JavaScript (ES6) - more explicitly: Node.js

## Technologies

Front end technologies:
- React: A JavaScript library that is used for building user interfaces.
  - `react-router`: This allows us to build a single page web application with navigation without the page refreshing as the user navigates around the application.
- Axios: A promise based HTTP client that allows us to make queries to an API.

Back end technologies:
- Express: This allows us to simplify our routing, and provides immensely helpful methods to keep our HTTP requests simplified and clean.
- MongoDB: This is a popular and great choice for the database since data is organized into JSON documents, which interacts nicely with our JavaScript stack. 
- Mongoose: This is utilized for our connection between Node and MongoDB. It is known as an Object Data Modelling Library (ODM). It includes built-in type casting, validation, query building, business logic hooks, and more, out of the box.
- JSON Web Tokens: This is a module that we can use to generate a randomized token for us. It also gives us some handy token validation methods.

Other technologies we will cover/discuss:
- Heroku: Used to deploy our applications and host a live server that we can make requests to.
- `create-react-app`: Used to provide the initial set up for a web app that provides all of the files and configurations that we need to get started.
- Compass: This is a GUI for MongoDB that allows us to explore our database, interact with our data, and debug and optimize everything related to our database.
- Webpack: This is a module bundler that allows us to manage our build process.