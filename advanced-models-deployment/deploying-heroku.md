# Deploying to Heroku

## To get started
You will need:
* A Heroku login which can be created with an email and password on [the Heroku site](https://devcenter.heroku.com/)
* Git
* Heroku CLI

A note on creating a Heroku login, in order to attach a database to your app, you will need to provide Heroku with a credit card. You will not be charged unless you scale your app up in size. 

Install the Heroku CLI either by visiting the [Heroku site here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) or if you have brew installed you can run `brew install heroku/brew/heroku` on a Mac.

You will know you have successfully installed Heroku by typing `heroku` into your terminal. This should result in a list of Heroku commands being printed in your terminal.

```shell
$ heroku
```

First, we need to login to Heroku with the credentials we created above via the CLI by typing:
```shell
$ heroku login
```

This will open a browser and you will be prompted to login to Heroku.

We are all going to work on deploying the same app, which lives on [this branch](https://github.com/HackerYou/con-ed-full-stack/tree/heroku-deploy-code). You can clone and download this branch repo using the following command:

```shell
$ git clone --single-branch --branch heroku-deploy-code https://github.com/HackerYou/con-ed-full-stack.git heroku-deploy-code
```

## Create the Heroku app
We will create an app on Heroku to host our code. We can use Git to push our code to this app because it will be setup as a remote repository for the codebase. We will push to the Heroku remote when we want to deploy our code.

Using the following command will create a randomly named app. You can also supply a name by using `heroku apps:create myapp`. Many app names are already taken so using the random app name is probably best. 

In the local git repository where the code is that you want to deploy, type the following command:

```shell
$ heroku create
```
Great! We've created an app on Heroku. Next up, we need to create an instance of mongodb to connect to our Heroku app. Currently our database is running on our local computers, we can't have our app on Heroku connecting to our local machine. 

## Attach MongoDb to Heroku
The Heroku ecosystem has a system of 'addons' that allow us to attach additional functionality to our applications. Many popular databases like Postgres, Redis, and MySql have 'addons' with Heroku. This makes hosting and connecting your database to your app very easy since it's already in the Heroku ecosystem!

We are going to use an addon called MLab which hosts Mongo databases. 

A reminder that in order to use this addon you will need to give Heroku your credit card. If you would like to host your database, go to your Heroku account and under Account Settings > Billing, enter your credit card number.

In the terminal, let's add an add-on to our Heroku app.

```shell
$ heroku addons:create mongolab
```

This will automatically create a cloud hosted mongo db instance. Currently, you get 496mb of storage for free, anything further you will need to pay a fee. For the most up to date pricing information, please visit [mLab's website](https://mlab.com/plans/pricing/). 

Great, we've created a Mongo database and a Heroku app! These are places in the cloud waiting to host our code! Now we just need to get our code into the cloud.

### View production MongoDB

In order to debug, it is helpful to have the ability to view entries in the database we just created as an add on. We will refer to this database as our 'production' database, since it is being accessed in the production environment of our app.

Since we are have been using Compass throughout this course, the following instructions cover how to add our production database to Compass but it is possible to setup a connection to this database in other GUIs. 

First, we need to create a new user in our database that will allow Compass to access it.

Why do we need a new database user? The user that currently exists was created for our Heroku app. It allows the app to access the database. We don't want to use the same login because we don't want to ever block our app from accessing the database. To avoid this, we will create a separate database user that we can use for debugging purposes. 

Ensuring you are in the correct file path for the project, type the following:
```shell
heroku addons:open mongolab
```
This will open a browser window with the mLab interface. Under the `Users` tab, click `Add database user`.
Fill out the required fields and remember the password you enter!

Find the database connection string, called the MongodDB URI, it should look something like this:
```
mongodb://<dbuser>:<dbpassword>@ds029745.mlab.com:29845/heroku_tkt978d
```

Copy this string and open Compass. In Compass, create a new connection by copying the entire above string (replacing and with the user name and password you just created) into the connection string input. Then, select the `Fill in connection fields individually` button and ensure all fields have been entered correctly. 

Pay special attention to the `Authentication Database` field, ensure that is the name of your database. For the above string, that value would be `heroku_tkt978d`.

Now you'll be able to view records created in your production database!

## Prepare to deploy to production
While you are still developing your app, use Git as you normally would to push to Github or your remote repository of choice. Once you have code that you feel you want to deploy live for the rest of the world to see, you will need to do the following steps to get your code ready to be hosted on Heroku.

### Define a Procfile
This file will tell Heroku how to start running your server. For now, it only has one command in it.

Create a file called `Procfile` at the root of your file directory and add the following line:
```
web: node server.js
```
This is the web process of our app. We could have other processes as well that we kickoff from the Procfile. For instance, if you had a process that needs to run any time you deploy new code, you could add that to the `release` command in the Procfile. 

### Create environment variables
The server is currently using a hard coded string that points to the local Mongo DB we are running for development. We are going to use environment variables so that we can provide different values to our server depending on what environment our app is running in. 

When we are running our app locally, on our computers, this environment is typically called the 'development' environment. Once our app is hosted on Heroku, it will be running in it's 'production' environment. Our app determines this using an environment variables that is typically called `NODE_ENV`. Luckily for us, Heroku will automatically set the `NODE_ENV` environment variable to `production` when it runs our app. We can use this to our advantage and set some code to only run if the `NODE_ENV` variable is equal to `production`.

When we added the addon for MLab,  an environment variable was created for us that contains the connection string to our database. To see this environment variable, run:

```shell
$ heroku config:get MONGODB_URI
```

This will print the environment variable that the MLab add on configured in our Heroku app for us.

To see all the environment variables currently configured for our app, run this command:
```shell
$ heroku config
```

If you had other variables that change depending on what environment your app is running in, you can set environment variables either through the settings interface on the Heroku website or through the CLI by typing:

```shell
$ heroku config:set GITHUB_USERNAME=personperson
```

We need to use the  `MONGODB_URI` environment variable in our app when it is running in production mode. We will need to do the same thing for the port that has been specified in `server.js`. Our app is going to be running on the port that Heroku specifies. 

We can update both those pieces of information in the production environment by adding the following at the beginning of server.js:

```javaScript
// server.js
const DB_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/dbname';
const PORT = process.env.PORT || '8080';
```

This syntax provides fallbacks, so that if the environment variable is not set (which it will not be when we are running the code locally) we will use the string provided. There are other systems that can be used for managing environment variables that will allow you to explicitly set all your environment variables in various environments. Checkout the [dotenv library](https://www.npmjs.com/package/dotenv) for more information on a more complex setup. 

Now replace wherever you have hard coded your mongo database connection string with the `DB_STRING` variable and wherever the port is hard corded with `PORT`. 

### Production build of front end code
We are going to add some more code to our `server.js` file that will allow our server to serve our front end code. This is often referred to as the 'bundle'. 

When we deploy our app to Heroku, it will run the build script that has been provided to us by Create React App. Running this command will compile all our React code into plain old JavaScript. It will also run our code through a bunch of processes to minify it. It will then output all those files into a folder called 'build'. This is what we are going to serve from our server in order for users to see our code live on the internet! Remember during development we use a dev server (through Webpack) to serve our front end code. When we host our code on Heroku, Webpack will not be running so we need a way for our Node server to provide the code when people visit our website.  

In order for the following to work, we are going to run the build command locally, but you will not have to do this every time you deploy your app.

To build your app, run 
```shell
yarn run build
```
or 
```shell
npm run build
```

In order to serve, the `build` directory we need to add the following code to the `server.js` file:

```javaScript
// server.js at the very end of the file.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./build'));
    // only add this part if you are using React Router
    app.get('*', (req,res) =>{
        console.log(path.join(__dirname+'/build/index.html'));
        res.sendFile(path.join(__dirname+'/build/index.html'));
    });
}
```

We add these lines at the end of the file so that when a request comes into the server, it will check to see if the request matches any of the other routes first before hitting this one. 

This route is going to look inside the file system on our remote server on Heroku and find a folder called 'build' and return that to the client making the request! Since this folder contains all the code needed to show our website, the browser can then display our website. 

The second route ensures that any client side routing will still result in the `index.html` file being returned to the client. Without this route, the server would throw an error when trying to access client side routes since we have not specified how to handle those routes.

#### Deploy the code!
Great, we've made all the changes we need to make to ensure that our code can run in production. 

To recap:
1. Create a Procfile with `web: node server.js` command in it
2. Replace any hard coded variables with environment variables where the value changes depending on the environment the code is being run in (eg. database strings)
3. Add a route to the server from which the frontend build can be served
4. Create a Heroku app with a cloud hosted instance of a mongo database

Now, we will need to add and commit all the code changes we have just made. This is important, changes will not appear on Heroku that we have not added and committed through Git.

Finally, to deploy your code, type:
```
$ git push heroku heroku-deploy-code
```
Since we are using the branch `heroku-deploy-code`, we have to push that branch to Heroku. If you have changed your git configuration, you might need to run a different command here, potentially `git push heroku master`.  

This may take a few minutes, but once it's completed, you can type the following command to ensure the app is running:
```
$ heroku ps
```

This should print some stats about your current usage of Heroku as well as whether or not your app is up or down. 

If you want to open your app in a browser, type:
```
$ heroku open
```

Great! Now you have a fullstack app live on the internet!

## View Heroku logs
For debugging purposes, you can view the log of your application by typing:
```
$ heroku logs --tail
```

To exit this screen, press `ctrl + c` or `command + c`

## Additional resources
[Heroku Guide to Deployment](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
