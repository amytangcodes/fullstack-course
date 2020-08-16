###### [[Module Home](README.md)]

# React

## Basics
### Mounting An App

```jsx
ReactDOM.render(<App />, document.getElementById('root'));
```
The above syntax is used to render a component, the "`App`" component, to a document node with an `id` equal to `root`.

```html
<div id="root"></div>
```

The above HTML would be all you need to have your react app render on the page.

> Of course, you would also need a `<script>` tag pointing to the JavaScript file that had your react app in it.

The `ReactDOM.render()` method takes two parameters. The first parameter is a string of HTML, and the second parameter is the location in the document, or the DOM, to render that HTML within.

The Following are all semantically the same:

```jsx
ReactDOM.render(
  <Fact info='The best ninja turtle is Donatello' />,
  document.getElementById('root')
);
```

```jsx
ReactDOM.render(
  '<h1>Fact: The best ninja turtle is Donatello</h1>',
  document.getElementById('root')
);
```

```javascript
ReactDOM.render(
  React.createElement(
    'h1',
    null,
    'Fact: The best ninja turtle is Donatello'
  ),
  document.getElementById('root')
);
```

```javascript
React.createElement(
  type,
  [props],
  [...children]
);
```
### Documentation:
* [`createElement()`](https://reactjs.org/docs/react-api.html#createelement)
* [Example Usage](https://reactjs.org/docs/react-without-jsx.html)

### Caveats:
You cannot use the attribute `class` on an element because `class` is a reserved word in JavaScript.

```jsx
ReactDOM.render(
  <h1 class="greeting">Hello!</h1>, // Cannot do this
  document.getElementById('app')
);
```

You must instead use the attribute `className`.

```jsx
ReactDOM.render(
  <h1 className="greeting">Hello!</h1>, // Can do this
  document.getElementById('app')
);
```

All elements require a closing `/` at the end. Elements such as `<input>`, which in HTML does not require a closing `/`, would, in JSX.

```jsx
<input type='text' /> // Must include slash before closing `>`
```

## Components

> [Class Component](https://reactjs.org/docs/react-api.html#reactcomponent)

The majority of all components you create will be using the `Component` API.

```jsx
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hi friends!</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

> [Class PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent)

In very simple cases, _where you meaningfully know_, **props and state are very simple**, you can use the `PureComponent` API. The difference between `Component` and `PureComponent` is that `Component` doesn't implement the `shouldComponentUpdate()` lifecycle method. `PureComponent` does implement it, but with a **shallow** prop and state comparison.

```jsx
class App extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Hi friends!</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
```

> Function Component

```jsx
function App() {
  return (
    <div>
      <h1>Hi friends!</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
```

## Events
Events are typically made up of two parts:
1. The event itself (eg. user clicks a button)
2. The event handler (eg. function to handle action)

```jsx
class Button extends React.Component {
  handleClick() {
    alert('You clicked it!');
  }

  render() {
    return (
      <button onClick={this.handleClick}>Click me!</button>
    );
  }
}
```

## State

> [Simple State Management](https://reactjs.org/docs/state-and-lifecycle.html#using-state-correctly)

```jsx
class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 12
    };
  }

  render() {
    return (
      <div>
        The count is {this.state.counter}.
      </div>
    );
  }
}
```

1. Add a simple event handler.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  // We'll have an issue with `this`
  //
  // 1. Add `this` binding (in constructor, or render method)
  // 2. Add arrow functions
  handleClick() {
    this.setState({
      counter: this.state.counter + 1
    });
  }

  render() {
    return (
      <div>
        <p>The count is {this.state.counter}.</p>
        <button onClick={this.handleClick.bind(this)}>
          Increment
        </button>
      </div>
    );
  }
}
```

2. Asynchronous State

```jsx
class Day extends React.Component {
  constructor(props) {
    super(props);
    this.apiKey = '4dda959d-3d91-45a1-9d12-247374814dc5';
    this.url = 'https://holidayapi.com/v1/holidays';
    this.state = {
      holidays: null
    };
  }

  componentDidMount() {
    // INFO: Doing this for ease of reading
    const key = `key=${this.apiKey}`;
    const year = `year=${this.props.year}`;
    const month = `month=${this.props.month}`;
    const day = `day=${this.props.day}`;
    const country = 'country=US';

    // Fetch data
    fetch(`${this.url}?${key}&${country}&${year}&${month}&${day}`)
      .then((res) => res.json())
      .then((data) => {

        // Set state with fetched data
        // NOTE: we have access to `this` in a lifecycle method
        this.setState({
          holidays: data.holidays
        });
      });
  }

  render() {
    return (
      <>
        <p>
          {
            this.state.holidays
              ? `${this.state.holidays.map(h => h.name).join(', ')}.`
              : 'There are no holidays.'
          }
        </p>
      </>
    )
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      days: [
        { month: '01', day: '01', year: 2018 },
        { month: '03', day: '17', year: 2018 },
        { month: '12', day: '25', year: 2018 },
      ]
    }
  }

  render() {
    return (
      <>
        <Day
          month='03'
          day='17'
          year='2018'
        />
      </>
    )
  }
}
```

## `this`

1. You get access to `this` inside lifecycle methods
2. You need to bind `this` into your own handler methods

## Props
Props are considered **details on how a component should render** itself. Props should be considered read-only.

## Lifecycle
React components have lifecycle methods that React will use under the covers.

![react-lifecycles](https://user-images.githubusercontent.com/2818462/67442852-6c456280-f5d0-11e9-9f2a-1df791ea51cd.jpeg)
