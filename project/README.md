# Project 

## Prerequisites
You _should_ have a GitHub repository already created, in which your project will live after you're finished cloning and initilizing the project.

> Visit this page to create a new repository in your account: <br />
> `https://github.com/new`

## Setup
Copy the `project/` directory into a new location on your computer.

```
# Example Copy Command
$ cp -R project/ ~/junocollege/some-new-folder
               ^                              ^
               |                              |
        HAS backslash                         |
                                        NO backslack
```

Inside the new project folder (eg. ~/some-new-folder) run the following command:
`git init`. This will initialize an empty git repository in this folder.

### Install Dependencies
To begin using this repository please run the following command.
> `npm install`

### Getting Started
Running the following command will prompt you to enter some information. This
well setup this folder to now point at the repository that you enter while
filling in the prompt.

```shell
npm run init
```

You will be prompted for the following things:
1. **Project Name**: The name you want to call the project
2. **GitHub username**, and **GitHub repository**: Your GitHub username and the name of the repository you created to hold this project.
> Ex. hackeryou/tomatoproject
3. **Author**: Your name.

Once you've completed the prompts, you'll be shown what the project package file will look like. An example is listed below. Simply type `y` or `yes` to complete the process.
```
{
  "name": "tomatoproject",
  "version": "1.0.0",
  "description": "HackerYou Fullstack Masterclass Project",
  "main": "index.js",
  "scripts": {
    "init": "node scripts/init.js",
    "test": "react-scripts test",
    "start:server": "nodemon api/server.js --ignore client",
    "start:client": "react-scripts start",
    "build:client": "react-scripts build",
    "git:remote:set": "git remote set-url origin https://github.com/hackeryou/tomatoproject.git"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hackeryou/tomatoproject.git"
  },
  "keywords": [],
  "author": "Michael Perrotte",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/HackerYou/con-ed-full-stack/issues"
  },
  "homepage": "https://github.com/HackerYou/con-ed-full-stack#readme",
  "dependencies": {
    "body-parser": "^1.18.3",
    "eslint": "^5.12.0",
    "express": "^4.16.4",
    "mongoose": "^5.6.11",
    "init-package-json": "^1.10.3",
    "react": "^16.8.4",
    "react-dom": "^16.8.4"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "semistandard": {
    "ignore": [
      "build/**"
    ]
  }
}


Is this OK? (yes)
```

After this process has been completed, you'll notice that your project folder `package.json` file has had its git configuration set to your GitHub repository.

The final step of the process is to run the newly created script that the initialization process made. This script is found in the `scripts` object of the `package.json` file, with the key `git`. 

_Note: This script expects the existence of an `.git/` folder_. 

To run the script, type the following in your command line:

```shell
npm run git
```

#### Confirmation
If you run the following command in the folder, the output should have an
`origin` entry with a url to your created repository on GitHub.

```shell
git remote -v
```

## Usage

> Start API server

```
$ npm run start:server
```

> Start Webpack Server

```
$ npm run start:client
```
