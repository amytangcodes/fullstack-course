###### [[Module Home](README.md)]

# JavaScript Refresher

## `let` & `const` vs `var`

### `const`
  - Must be initialized
  - Cannot reassign a variable if defined as `const`
    - Only true for primative types: `String`, `Number`, `undefined`, `null`, `boolean`, and `Symbol`

  - Defines a pointer to a "*thing*"
  - Q: what "*thing*" = container?
  ```javascript
  const myVar = [];

  // Is this allowed?
  myVar.push('hello');
  ```

### `let` vs `var`
#### Block Scope vs. Function Scope
  - JavaScript is a `Function` scoped language

```javascript
function something() {
  var planet = 'Earth';
  console.log(planet); // Earth
}

console.log(planet); // undefined
```

Block Scope Examples:
```javascript
// This will work correctly
{
  var x = 'hello';
}

console.log(x);
```

```javascript
// This will NOT work
{
  let x = 'hello';
}

console.log(x);
```

## Arrow Functions
### Arrow Function Syntax
```javascript
const add = function(a, b) {
  return a + b;
}
```
```javascript
const add = (a, b) => {
  return a + b;
}
```
```javascript
const add = (a, b) => a + b;
```
### Arrow Functions and `this` keyword
  - `this` determined by the **scope** of the **caller**
  - Array functions **inherit** parent **scope**

```javascript
// Step 1
const picasso = {
    fullName: 'Pablo Picasso',
    paintings: ['Guernica', 'Girl before a Mirror', 'Portrait of Dora Maar'],
    listPaintings: function() {
                              // function block breaks `this` scope
        this.paintings.forEach(function(painting) {
            console.log(`${this.fullName}'s paintings include: ${painting}`);
        });
    }
}

picasso.listPaintings()
```
```javascript
// Step 2
const picasso = {
    fullName: 'Pablo Picasso',
    paintings: ['Guernica', 'Girl before a Mirror', 'Portrait of Dora Maar'],
    listPaintings: function() {
                            // correct `this` scope
        this.paintings.forEach((painting) => {
            console.log(`${this.fullName}'s paintings include: ${painting}`);
        });
    }
}

picasso.listPaintings()
```
```javascript
// Step 3
const picasso = {
    fullName: 'Pablo Picasso',
    paintings: ['Guernica', 'Girl before a Mirror', 'Portrait of Dora Maar'],
                // arrow function breaks scope again
    listPaintings: () => {
        this.paintings.forEach((painting) => {
            console.log(`${this.fullName}'s paintings include: ${painting}`);
        });
    }
}

picasso.listPaintings()
```

## Array Functions
 - Callback signature: `map`, `filter`, and `forEach`
```javascript
function callback(item, index, array) {}
```

### [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  - Creates an array with same length
  - Does not mutate source array

```javascript
const numberArray = [ 1, 2, 3, 4, 5 ];
const stringArray = numberArray.map((itemInArray) => {
  return itemInArray.toString();
});

// Can also be written
const alsoStringArray = numberArray.map((itemInArray) => itemInArray.toString());
```

### [Filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
  - Creates a new array
  - Does not mutate source array

```javascript
// Version 1
const numberArray = [ 1, 2, 3, 4, 5, 6 ];
const evenNumberArray = numberArray.filter((itemInArray) => {
  if (itemInArray % 2 === 2) {
    return true;
  } else {
    return false;
  }
});

console.log(evenNumberArray) // [ 2, 4, 6 ]
```

```javascript
// Version 2
const numberArray = [ 1, 2, 3, 4, 5, 6 ];
const evenNumberArray = numberArray.filter((itemInArray) => {
  if (itemInArray % 2 === 2) {
    return true;
  }
  return false;
});

console.log(evenNumberArray) // [ 2, 4, 6 ]
```

```javascript
// Version 3
const numberArray = [ 1, 2, 3, 4, 5, 6 ];
const evenNumberArray = numberArray.filter((itemInArray) => {
  return itemInArray % 2 === 2;
});

console.log(evenNumberArray); // [ 2, 4, 6 ]
```

### [Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
  - Returns a new variable
  - Different callback signature
  - Different function signature

Callback Signature
```javascript
function callback(accumulator, currentValue, currentIndex, sourceArray) {}
```

```javascript
const numberArray = [ 1, 2, 3, 4, 5, 6 ];
const nextArray = numberArray.reduce(
  (acc, value) => {
    return acc.concat(value.toString());
  },
  [] // Initial Value
);

console.log(nextArray); // [ '1', '2', '3', '4', '5', '6' ]
```

Create an enumerator of fruits
```javascript
const fruits = [
  'apple',
  'orange',
  'strawberry',
  'peach',
  'banana',
];
const fruitEnum = fruits.reduce(
  (acc, value, index) => {
    return Object.assign({}, acc, { [value]: index });
  },
  {} // Initial Value
);

console.log(fruitEnum);
```

### [ForEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/foreach)
  - Iterates over array elements

```javascript
const numberArray = [ 1, 2, 3, 4, 5 ];
numberArray.forEach((itemInArray) => {
  console.log(itemInArray);
});

// 1
// 2
// 3
// 4
// 5

// Returning in a forEach ends the iteration
numberArray.forEach((itemInArray) => {
  if (itemInArray === 4) {
    return;
  }
  console.log(itemInArray);
});

// 1
// 2
// 3
// 5
```

## [Class Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
### Prototypes and Classes in JavaScript
#### Object Oriented Programming
  - Classes / Instances : Recipe / Cake

#### [Prototypal Inheritance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
  - *dunder* proto
    - [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)
    - [Blog Post](https://2ality.com/2012/10/dunder.html) _by [Axel Rauschmayer](https://twitter.com/rauschma)_
  - **Side Effect:** Reference properties _(where things get tricky)_

```javascript
// Create an empty constructor function
function Person() {}

// Add property name, age to the prototype property of the Person constructor function
Person.prototype.name = "Ashwin";
Person.prototype.age = 26;
Person.prototype.friends = ['Jadeja', 'Vijay'], // Arrays are of reference type in JavaScript
Person.prototype.sayName = function () {
  console.log(this.name);
}

// Create objects using the Person constructor function
const person1 = new Person();
const person2 = new Person();

// Add a new element to the friends array
person1.friends.push("Amit");

console.log(person1.friends); // Output: "Jadeja, Vijay, Amit"
console.log(person2.friends); // Output: "Jadeja, Vijay, Amit"
```

  - Fix Reference Properties *(local property declaration)*

```javascript
function Character() {
  this.health = 100;
  this.location = {
    x: 0,
    y: 0,
  }
  this.equipment = [];
  this.walk = function() {
    // ...code to make a character walk around
  }
  this.attack = function() {
    // ...code to make a character attack
  }
}

const player = new Character();
const enemy = new Character();

// Add new item to players equipment list
player.equipment.push('sword');

console.log(player.equipment); // [ 'sword' ]
console.log(enemy.equipment); // []
```

#### ES6 _(ECMAScript 2015)_ Classes
  - Syntactic Sugar

```javascript
class Character {
  constructor() {
    this.health = 100;
    this.location = {
      x: 0,
      y: 0,
    }
    this.equipment = [];
  }

  walk() {
    // ...code to make a character walk around
  }
  attack() {
    // ...code to make a character attack
  }
}

const player = new Character();
const enemy = new Character();
```

#### Classes and Extends
  - `super` call in `constructor` method

```javascript
class Person {
  constructor() {
    this.location = {
      x: 0,
      y: 0,
    }
  }

  walk() {
    // ...code to make a character walk around
  }
}
class Character extends Person {
  constructor() {
    super();
    this.health = 100;
    this.equipment = [];
  }

  run() {
    // ...code to make a character run around
  }

  attack() {
    // ...code to make a character attack
  }
}

const player = new Character();
const enemy = new Character();
```
