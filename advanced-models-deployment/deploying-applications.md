# Deploying Applications
In order for an application to be viewable by the world at large, we have to host it somewhere. For fullstack applications, we have created our own server that we can use to serve our front end code. We also have a database. Both our server and our database therefore need to be hosted somewhere that the rest of the world can access. 

## Deploying Front end Websites
When deploying a purely front end website, we trust the server to be responsible for making sure that our static assets (HTML, CSS, JavaScript, fonts, images, etc.) are delivered to the client successfully. When it comes to web hosting, most common hosting providers rely on an HTTP Server called <a href="https://httpd.apache.org/">Apache Web Server</a>. When your website receives requests, Apache knows which static assets to send back in response (or a 404 if it can't find the file you're looking for!)

All of this is usually configured for you by your hosting provider, which is expecting you to upload static files. So you just upload your files to your desired folder, and you're good to go.

### Some of the common places you may have hosted websites in the past:
- Website Hosting Providers (DreamHost, SiteGround, HostGator, Bluehost, etc)
- Static Site Generators (GitHub Pages, Netlify)

### Some of the common ways you have deployed those websites on to the web
- File Managers/FTP
- Git (GitHub, Netlify)

## Deploying Fullstack Applications
`express` (via NodeJS) has the ability to host a web server baked right into it. So we don't need to use any of the hosting providers listed above.

Let's try creating a server that can serve front end code:

1. Create a new folder, called `express-hello-world`
```shell
mkdir express-hello-world
cd express-hello-world
```

2. Initialize an empty package.json and install express
```shell
npm init -y
npm install express --save
```

3. Create a server.js
```shell
touch server.js
```

4. Inside server.js:
```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/another-page', (req, res) => {
  res.send('<h2>Another page!</h2>')
})

app.listen(3000, () => {
  console.log('Hello World listening on port 3000.')
})
```

5. Run this from the command line:
```shell
nodemon server.js
```

Visit this in your browser, and you'll see that we're able to receive a request to `localhost:3000/` and `localhost:3000/another-page` and we receive back some HTML.

6. We can also handle 404s using a wildcard route (put this one last):

```javascript
app.get('*', (req, res) => {
   res.status(404).send("Sorry, that web page doesn't exist 🤷🏻‍")
})
```

## Does this mean you have to write all your HTML in the body of a res.send?
No, that's bonkers! We can send external HTML files through express.

First, let's move our `Hello World` code into a file called `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hello World!</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>
```

then, let's update our route path:

```javascript
const express = require('express')
const path = require('path')
const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
```
The code above is doing the following:
- `path` is a module that allows us to explicitly describe the location of the file we're looking for without running into gotchas around where this file is run
- `sendFile` allows us to send back a whole file instead of just some HTML
- `__dirname` refers to the directory that `server.js` lives in

Now when you visit `/`, you'll see that `index.html` is being delivered to you!

## Does this mean I have to set an explicit route for EVERY file?
No, that would also be bonkers. Let's restructure our app a little bit. Create a folder called 'public', and put your `index.html` in there.

```shell
mkdir public
mv index.html public/
```

Now let's update our express code a little bit:
```javascript
// remove this route
// app.get('/', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'))
// })

// add this line
app.use('/', express.static('public'))
```

Try visiting `localhost:3000/` - you'll see that it still serves you `index.html`! Not only that, but let's create another file in the public folder, called `about.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>About</title>
</head>
<body>
  <h1>About</h1>
</body>
</html>
```

Try navigating to that - you'll see that it works no problem! But we never used `sendFile`, so how did express know to send us `about.html`?

The key is express's `static` method. Essentially, if a user visits `/`, express will look in the `public` folder for any files that match any part of the request that came after the `/` if it finds a match (in the case of `about.html`), it will send that file!

And that's all there is to it - you now built your own very simple webserver.

## But right now our projects work fine and we're not using Express to host them?

It's true - this is our flow right now <img src="https://www.fullstackreact.com/assets/images/articles/cra-with-server/flow-diagram-2.png" />

 Right now we're relying on Webpack's dev server to host the front end of our application.

Our express server has only been responsible for serving up our API routes.

But since our app is somewhat small, we're going to teach our API server how to also be responsible for serving static files (aka our front end). Like this:

<img src="https://www.fullstackreact.com/assets/images/articles/deploy-cra-wserver-heroku/deploy-strategy-heroku-only-diagram.png" />

There are benefits/drawbacks to this approach as to opposed to hosting your front and back end completely separately, but for projects of up to quite a significant scale this kind of strategy should be fine.

## Setting up your Express server to host your React app
- Let's start by cloning down the boilerplate:
```shell
git clone https://github.com/HackerYou/fs-masterclass-boilerplate.git
npm install
```

- Next, let's run JUST the server (not the front end!)
```shell
npm run server
```

- If you visit localhost:3001, you'll see the following:
```javascript
Cannot GET /
```

That's because we don't have an server routes that we can access from `/`. Let's set it up so that it serves our front end.

When we've been working on our React app, we've been running it in `development` mode - that means that the code has been unminified, and helpful errors have been included that slow the website down but make it easier to develop.

To prepare our application to be launched on to the web, we'll need to launch it in `production` mode. Doing this is very simple, just type the following command:

```shell
npm run build
```

You'll notice you now have a new folder in your root, `build`, with a static production ready version of your front end app. We're going to teach our express server how to run that code. Inside your `server.js`:

### So what's different about running a build?
- Uglify JS
- Minify CSS
- Optimize SVGs
- Generates sourcemaps
- Outputs a compiled `index.html` 

among other things (check out the webpack production config for `create-react-app` <a href="https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js">here</a>)

```javascript
const path = require('path')

app.use('/', express.static(path.join(__dirname, '../build')))
```

Now, whenever you visit `/`, your express server serves up `build/index.html`

There's a big gotcha here that we need to talk about, and that's handling 404s. Remember that in a single page app, we never leave `index.html`, since every other page is just a 'virtual page view' handled by our `react-router` and rendered by our React app.

That means that if you're at: `http://localhost:8080/` or you're at `http://localhost:8080/stores/123`, you should still land on your `index.html`.

Right now, if you visit `http://localhost:8080/stores/123`, you'll see:

```shell
Cannot GET /stores/123
```

Express has no way of knowing that `/stores/123` is actually part of the React app that lives in `index.html`. It assumes you're trying to access some other part of your application - maybe a route in your API, something like that. It isn't sure.

We need to tell Express that if it sees a file path that it doesn't recognize, it should assume that it means it should show our React app and let `react-router` handle what part of our React app to display. The way we can leverage this by using the wildcard `*`:

```javascript
// at the bottom of your server.js
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})
```

And that's it! Now your express server is also capable of hosting the front end of your code!

## What does this have to do with our projects?
Well, your projects have 3 major components:
* Your MongoDB instance
* Your Express API
* Your React Frontend

When we deploy your application, we need to deploy all three parts. We can't just upload your front end React app without your API, and we can't deploy your API without your Mongo database.

We could launch them separately (just like how any front end apps you've used in the past take advantage of 3rd-party APIs like Google Places), but since they're all part of your application, why not look for an all-in-one strategy that let's you deploy all three of them at once?

We are going to use a service called Heroku to host our applications. Head to the Deploying With Heroku Lesson to learn how to deploy an app using Heroku. 

## Fullstack Hosting Services
There are many other services besides Heroku that companies will use to host their stack (front end, back end services and databases). 

These services typically are usually either `PaaS` (platform as a service) or an `IaaS` (infrastructure as a service). 

`PaaS` are services that require less setup. They come with many options already configured for you. As opposed to an `IaaS` which will require more configuration but will also therefore give you more flexibility.

Common `IaaS` include:
* Amazon Web Services (AWS)
* Google Cloud Platform (GCP)
* Microsoft Azure
* Digital Ocean

Other `PaaS` include:
* Cloud Foundry
* Google App Engine 
* Amazon Web Services Elastic Beanstalk

When considering which platform to use, you should think about the following:
* How many people will be visiting your site? What will the associated cost for the resources needed to meet this demand?
* How easy is it to scale both horizontally and vertically? Horizontally means adding more machines while vertically is upgrading to a more powerful machine
* Where are the data centres located for this company? This could affect the speed at which they can access the internet
* Uptime/downtime of the host
* How easy and secure are their tools?
* What systems they have in place for monitoring the service?
* The price tiers of the service and what you get/don’t get as a result? Some services provide a certain number of live time per tier or a certain amount of storage per tier
* Additional perks like free domain name or SSL
* If the free tier has an expiration date, what will the cost be of migrating to a paid plan?

We are going to use Heroku because it has great documentation, an easy to use CLI tool and a free tier that stays free.

There is a whole community in the Web Development space that focuses on solving the problems of hosting an application online called DevOps. They spend their time ensuring that a site remains live no matter what kind of code is added to it! They also work with problems such as load balancing (ensuring that there are enough instances of an application running for the amount of traffic), continuos integration for deployment and performance monitoring. 
