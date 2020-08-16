# Quiz

## Question 1

> Find the bug

```javascript
function Artist(name) {
  this.name = name;
}

Artist.prototype.paintings = [];
Artist.prototype.addWork = function addWork(painting) {
  this.paintings.push(painting);
}
Artist.prototype.listWorks = function listWorks() {
  console.log(this.paintings);
}

const vanGogh = new Artist('Vincent van Gogh');
vanGogh.addWork('Sorrow');
vanGogh.addWork('The Potato Eaters');
vanGogh.addWork('Sunflowers');
vanGogh.addWork('The Starry Night');

const picasso = new Artist('Pablo Picasso');
picasso.addWork('The Weeping Woman');
picasso.addWork('Mona Lisa');

vanGogh.listWorks();
picasso.listWorks();
```

## Question 2

> Convert into ES6 Class and extend a Person class

```javascript
function Artist(name) {
  this.name = name;
}

Artist.prototype.paintings = [];
Artist.prototype.addWork = function addWork(painting) {
  this.paintings.push(painting);
}
Artist.prototype.listWorks = function listWorks() {
  console.log(this.paintings);
}
```
