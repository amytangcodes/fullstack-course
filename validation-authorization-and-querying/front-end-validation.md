###### [[Module Home](README.md)]

# Frontend Validation

Validation on the front end generally has to do with two areas:

* User interactions with the application (form validation)
* Requests sent from the application to an API (handling bad requests)

These two items are sometimes coupled together, but sometimes they are not. When an API changes without the knowledge of an application owner, there might be inconsistencies that will need to be handled.

## Detecting Validation Errors in JavaScript

Let's start by setting up an API request so that we can outline how we might go about capturing errors with the request.

We will use the `jsonplaceholder` API as a way to get a quick response that we can practise our error handling with. When we have been using the `res` object to return from our API, we have been including a status to indicate that the request was successful. This is often an integer value of `200` or `201`. 

Contrary to this, integer values are also used to indicate that something might have gone wrong with the request. A status code of `500` for example can indicate that something is wrong with the server of the API, and a status code of `400` can indicate that something was wrong with the request itself. 

Oftentimes API documentation will note any status codes that are unique to the API and the meaning behind them.

Let's use `fetch` to set up a call to the `jsonplaceholder` test API, that has documentation available [here](https://jsonplaceholder.typicode.com/):

```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
```

Now that we are making the request, let's handle the response in a `.then` function. It is good practice to `console.log` the response in order to know exactly what is being returned:

```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => console.log(response));
```

You will notice the response has three separate properties that help us in identifying if the request experienced any issues. These three fields are `ok`, `status`, and `statusText`. We can destructure these properties from the `response` object so that we can use them to do error checking and handling.

We can access these properties as follows:

```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then((response) => {
    const { ok, status, statusText } = response;
    console.log(ok);
    console.log(status);
    console.log(statusText); 
  });
```

We can do checks that might look like the following:

```javascript
fetch('https://jsonplaceholder.typicode.com/todos/1')
.then((response) => {
  const { ok, status, statusText } = response;
  if (ok) {
    // All went according to plan; proceed.
  } else if (status === 500) {
    // Something went wrong with the server; handle it.
  } else if (status === 400) {
    // Something was wrong with our request; handle it.
  }
});
```

Amazing, we can handle these errors within the conditional statements however we choose. To note, it is an excellent user experience to return a specific error based on precisely went wrong.

## Detecting Validation Errors in React

State is often used in React as a way of managing errors in our application. We can update the state wherever the error is thrown, and then can use the state object to print the error wherever we desire in our application.

The following is an example of how state can be passed via props to different components in an application, and then be displayed in those sub components. Of course, in a real world application, your `componentDidMount` lifecycle method shouldn't simply throw an error every time, however, the same pattern of setting an error state can be used in any area of the application that is throwing an error.

```jsx
class Header extends Component {
  render() {
    return (
      <h1>{this.props.errors}</h1>
    )
  }
}

class App extends Component {
  state = {
    data: {

    },
    errors: null
  }

  componentDidMount() {
    this.setState({
      errors: 'Uh oh, something is broken!'
    })
  }

  render() {
    return (
      <div className="App">
        <Header title={this.props.title} errors={this.state.errors} />
        <h2>Here we are, having a party as per usual.</h2>
      </div>
    );
  }
}

```

### Error Boundaries

In React version 16, React introduced Error Boundaries. The idea behind this is that a JavaScript error in one part of an application should not break the entire app. The official tagline for Error Boundaries is as follows:

```
Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.
```

The way to think about them is as `try-catch` blocks, but for the components themselves.

Error Boundaries introduce new lifecycle methods that allow for simplified catching and handling of errors. A standard class component changes into an Error Boundary in the event that it defines one of, or both of the following lifecycle methods: `static getDerivedStateFromError()` or `componentDidCatch()`.

`static getDerivedStateFromError`: This is used to render the fallback UI when an error is thrown in the component.

`componentDidCatch`: This lifecycle method allows us to log out the actual error itself.

The Codepen available [here](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) illustrates using these concepts in practise. 

For more reading on Error Boundaries in React, the official React documentation has great descriptions available [here](https://reactjs.org/docs/error-boundaries.html).


### Material UI

#### Snackbars Component Example

Snackbars is a great Material UI component that allows us to display brief messages (such as errors), and is a very nice and clean way of offering some error handling in our application.

```jsx
class Header extends Component {
  state = {
    showError: false
  }

  handleErrorClose = () => {
    this.setState({
      showError: false
    })
  }

  componentDidMount() {
    const { errors } = this.props;
    if (errors !== "") {
      this.setState({
        showError: true
      })
    }
  }

  render() {
    const { title, errors } = this.props;
    return (
      <header>
        <h1>{title}</h1>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={this.state.showError}
          onClose={this.handleErrorClose}
          message={
            <span id="message-id">
              {errors}
            </span>
          }
        />
      </header>
    )
  }
}

class App extends Component {
  state = {
    data: {

    },
    errors: null
  }

  componentDidMount() {
    this.setState({
      errors: 'Uh oh, something is broken!'
    })
  }

  render() {
    return (
      <div className="App">
        <Header title={this.props.title} errors={this.state.errors} />
        <h2>Having a party!</h2>
      </div>
    )
  }
}
```

Try out this code within your own codebase, or within [CodeSandbox](https://codesandbox.io/dashboard) and you should be able to see the error pop up on the bottom of the screen. 

If you're trying it out in CodeSandbox, don't forget to add `@material-ui/core` as a dependency. Play around with the different props being passed to the Snackbars component, and also try changing up where the error is being thrown!

You can read more about Snackbars component [here](https://material-ui.com/components/snackbars/). This component could be a great addition to any of the React applications that you are buiding!

## Form Validation

JavaScript is great for handling form validation for us! There are many libraries that handle a lot of the fundamental validations for us, however, an example of vanilla JavaScript validation could look something like the following:

```javascript
if (document.myForm.name.value === "") {
  alert("Please provide your name!");
}
```

These checks will vary immensely based on the business rules that your project / your company's project is looking to implement. Unfortunately, there are no hard-fast rules that this course can teach you about that at this point in time.
