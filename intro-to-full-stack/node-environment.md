###### [[Module Home](README.md)]

# Node Environment

Node is a JavaScript run time that allows us to execute JavaScript on the server. Under the hood, Node uses the V8 Engine which is the same engine that powers Google Chrome. Node can run in a great deal of places, such as: on a server, and on different kinds of hardware (robots, space suits, etc). Finally, Node can also do input/output operations (read from files, create files, delete files, etc).

We will be using Node for running our API, communicating with our database, and controlling our build.

Node Package Manager (`npm`) is the default package manager for Node. This simplies the installation and management of software packages which contain all of the files that are required for a module. There are many helpful packages available in npm that allow us to not have to write all of the functionality required for our app from scratch.  

## Your first Node Application

Open a text editor and create a new file called `hello.js` with the following contents:

```js
console.log("Hello, World");
```

Now let's try running this file. In a terminal, navigate to the directory that the file is in, and run:

```shell
node hello.js
```

Success! You should see `Hello, World` outputted to the command line.

You can run any Node program by running `node (filename)` from the command line. Node is JavaScript, and allows us to write JavaScript in the same way that we are already familiar with. _Some_ of the functions available in the browser (like `console.log`) are available in Node.

## Passing Data to a Node program

We can also pass data to a Node program!

Modify the `hello.js` file that you previously created to contain the following:

```js
const name = process.argv[2];

console.log(`Hello, ${name}!`);
```

Return to the command line, and run your file as follows:

```shell
node hello.js (YOUR NAME HERE)
```

Arguments are stored in `process.argv`, which is an array of arguments in the order they were passed in. 

Add the following `console.log` above the existing `console.log` in `hello.js`:

```js
console.log(process.argv);
```

If you return to your command line, you will see an array printed out along the lines of the following:

```shell
[
  '/usr/local/bin/node', '/path/to/file/hello.js', (your name)
]
```

Note that the first two arguments are node itself, and the name of the file that you're executing. Don't forget that arrays are 0 indexed! This is the reason behind why we access our passed in name value using `process.argv[2]`.


## Environment Differences

Within your browser, the global object (which provides variables and functions that are available anywhere), is named `window`. For Node, the name of this global object is `global`. 

- `window` vs `global`

```javascript
// Browser
console.log(window); // Our global object

// Node
console.log(global); // Our global object
```

### process.env

This is a global variable that's injected by Node at runtime for the application to use. The `process.env` variable is an object, and each of it's properties can be accessed through using our familiar dot notation (i.e. `process.env.{PROPERTY_NAME}`). At any point within your node code, you can add the line `console.log(process.env)` to see the environment variables that your application has access to.

The `process.env` variable is immensely useful when looking to deploy our applications later on. Server addresses change from our familiar localhost of `127.0.0.1` when we go to deploy an application to production. This leads to challenges of having our databases on the same machine as we'd have to continuously discover the machine that our application is running on when configuring our database, and this leads to many deployment complications. The suggested approach is to specify `process.env.PORT` for both our server and database which enables the system to handle all of that confusion for us.

## Require vs. Import

The fundamental reasoning behind Node using the `require` keyword as opposed to the `import` keyword is that Node and the Chrome V8 engine are older than ES6. JavaScript ES6 is where the `import` keyword ultimately got introduced. As of Node version 12.3.1, `import` specifiers are able to be used within Node. For consistency, it is recommended that the `require` keyword continue being used for the foreseeable future. The release notes indicating that the `import` keyword is being included can be found [here](https://nodejs.org/api/esm.html#esm_code_import_code_specifiers).

The `require` keyword is incredibly useful as it has a great deal of functionality built in. `require` is built into Node and is not part of the standard JavaScript API. The fundamental purpose of the `require` keyword is to import modules. Modules are imported from the `node_modules` folder that gets generated when `npm install` is run from the project's root. Modules can be required using a relative path if the module is locally saved in the project, or just specifying the module name will default to look in the `node_modules` folder of the current working directory.

You can find more information about the `require` keyword within Node [here](https://nodejs.org/api/modules.html#modules_require_id).

## Modules

Modules allow us the ability to load JavaScript files into one another. Like partials in SASS, they permit us to chunk out our code into separate smaller files, and import them on a need-to-use basis.

In Node, each separate module has its own scope. This means that other modules are not able to access functions defined in another module, unless they are explicitly exposed. In order for a module to expose its contents, they must be assigned to `module.exports` or `exports`.

`module`: Module is an object that is a reference to the current module that the module keyword is used in. module is not global, but is actually local to each module file.

`module.exports`: This is an object that is created by `module`. 

`exports`: This is simply a shorthand reference to `module.exports`. This variable gets assigned the value of `module.exports` prior to the module being evaluated. 

`module.exports` vs. `exports`

These objects are not able to be used entirely interchangably. It is important to note that if a value is assigned to `exports`, it does not automatically get bound to `module.exports`. 

The following is the example provided from the Node documentation available [here](https://nodejs.org/api/modules.html#modules_exports_shortcut).
```js
module.exports.hello = true; // Exported from require of module
exports = { hello: false }; // Not exported, and is only available within the module itself.
```

Once the contents of the module have been exported, another module is able to import the module using the previously mentioned `require` keyword.

Let's build a quote generator module! We will create a file called `quotes.js` that will contain the functions that generate our quotes for us:

```js
// quotes.js
const jadenSmithQuotes = [
  "How Can Mirrors Be Real If Our Eyes Aren't Real?",
  "Lately People Call Me Scoop Life",
  "If A Book Store Never Runs Out Of A Certain Book, Does That Mean That Nobody Reads It, Or Everybody Reads It",
  "The Great Gatsby Is One Of The Greatest Movies Of All Time, Coachella"
]

const jadenSmithQuote = () => {
  const randomJadenQuote = Math.floor(Math.random() * jadenSmithQuotes.length);
  return jadenSmithQuotes[randomJadenQuote];
};
```

Now we can generate quotes, but only inside our `quotes.js` module! What if we want to generate quotes inside of our main application, like say, `buzzfeed.js`?

Well, we can use `module.exports` object like this in order to make our `jadenSmithQuote` generator function available wherever we choose to import it:

```js
// quote.js
module.exports = {
  jadenSmithQuote: jadenSmithQuote
}
```

and then we can import the function inside of a new file, `buzzfeed.js` that we create in the same directory. In order to complete the import, we will use the `require` keyword.

```js
// buzzfeed.js
const quotes = require('./quotes.js');

const quote = quotes.jadenSmithQuote();
const anotherQuote = quotes.jadenSmithQuote();

console.log(quote);
console.log(anotherQuote);
```

## Module Practise

We are going to create a basic calculator module in Node!

First, let's create a file called `calc.js` which will be the module that has functions that will complete our calculations for us. Let's also create a file called `main.js` where we will get any user input and import our module and call our calculation functions.

We'll start with our `calc.js` module. In this file, we will export our `add` and `subtract` calculation functions.

We will use `module.exports` to complete the function exports. We can add the following to our file:

```js
// calc.js
module.exports = {
  add: (a,b) => parseInt(a) + parseInt(b),
  subtract: (a,b) => parseInt(a) - parseInt(b)
}
```

Now let's add the user interaction. We will get the numbers, and the operation that we are using for the calculation from the command line using our `process.argv` array.

```js
// main.js
const a = process.argv[2];
const b = process.argv[3];
const operator = process.argv[4];
```

When performing a calculation, we need to ensure that we are passing the arguments in the appropriate order.

Let's also make sure that we're importing the calculation module. Recall that we use the `require` keyword for this.

```js
// main.js
const calc = require('./calc.js');
```

We can utilize a switch statement to determine which operator is being used for the calculation. Let's add the following underneath our variable declarations:

```js
// main.js
switch(operator) {
  case '+': {
    console.log('Complete the addition here!');
    break;
  }
  case '-': {
    console.log('Complete the subtraction here!');
    break;
  }
}
```

Finally, we want to ensure that we are using our `calc.js` module to actually complete the calculations within our switch statement.

```js
// main.js
switch(operator) {
  case '+': {
    console.log(calc.add(a,b));
    break;
  }
  case '-': {
    console.log(calc.subtract(a,b));
    break;
  }
}
```

And that's it! Now we have a fun node calculator that we can run from the command line. We can run it as follows:

```shell
node main.js 1 2 +
```

or

```shell
node main.js 4 2 - 
```

Amazing! What a fun calculator.
