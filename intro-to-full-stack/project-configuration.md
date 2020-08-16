# Project Configuration

Now that we've seen how to set up a small API using Express, let's learn how we can connect it to a front end React application.

The code for this example lives in <a href="https://github.com/HackerYou/fs-masterclass-boilerplate"> Full Stack Boilerplate</a>. If you'd like to clone it down for a project, please feel free to use it!

1. Let's start by cloning down the shell for our boilerplate.
```shell
git clone https://github.com/HackerYou/fs-masterclass-boilerplate
```

This has the API you've built in the previous lesson, as well as a fresh install of `create-react-app`.


2. We're going to need to run our express server AND our react app at the same time, and having two terminal windows open is a pain. So let's install a package called `concurrently` (_Note:_ This step is optional. You are definitely more than welcome to have multiple terminal windows open).
```shell
npm install concurrently --save-dev
```

3. If you don't have nodemon installed globally, don't forget to install that as well:
```shell
npm install nodemon --save-dev
```

4. Now let's update your `package.json`. I'll post the code here and we can talk through what we're changing:
```json
{
  "name": "react-express-boilerplate",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "express": "^4.16.2",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-scripts": "1.1.1"
  },
  "proxy": "http://localhost:3001/",
  "scripts": {
    "client": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject",
    "server": "nodemon lib/server.js --ignore src/",
    "start":
      "concurrently --kill-others-on-fail \"npm run server\" \"npm run client\""
  },
  "devDependencies": {
    "concurrently": "^3.5.1"
  }
}
```

5. Let's try running it now, and debug any errors together!
```bash
npm run start
```

6. Now let's add a little test code to our React app to make sure it can successfully get responses from our Express server. To do that, we'll need to use an HTTP library, so let's install axios:
```bash
npm install axios --save
```

7. Finally, add the following in your `src/App.js`:
```jsx
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

class App extends Component {
  async componentDidMount () {
    try {
      const response = await axios.get('/healthcheck')
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```

### Try it on your own!
- Create a new project folder for your final class project, and and add this boilerplate in. 
- Commit your project to github!
- If you'd like to explore other methods of running your react/node processes in parallel, take a look at <a href="https://github.com/tmux/tmux/wiki">Tmux!</a>

