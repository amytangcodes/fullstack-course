###### [[Module Home](README.md)]

# MongoDB

## Overview

A piece of software that facilitates the storage and processing of data is a database. We'll be using MongoDB for this class. MongoDB is a "NoSQL" database, meaning that it doesn't use the SQL standards or model for storing and working with data.

MongoDB is a **document store**, which means that data is organized into documents that look a lot like JavaScript objects. MongoDB is flexbile enough that your documents can look just like JavaScript with arrays, nested objects, data types like booleans, numbers, and strings, etc. You can't store functions in MongoDB, but otherwise pretty much everything can be stored in a Mongo document.

## NoSQL (Non-Relational) vs. SQL (Relational) Databases

Relational databases are a system of expressing the connection between different discrete pieces of data. They usually store data in tables and rows. It looks like this:

```shell
ID|    NAME          | HOUSE       |
--|------------------|-------------|
1 | Harry Potter     | Gryiffindor |
2 | Hermione Granger | Gryffindor  |
3 | Draco Malfoy     | Slytherin   |
```

MongoDB does not use SQL, and is referred to as non-relational. In MongoDB, the above database may be represented as:

```JSON
{
    "id": 1,
    "name": "Harry Potter",
    "house": "Gryffindor"
},
{
    "id": 2,
    "name": "Hermione Granger",
    "house": "Gryffindor"
}
{
    "id": 3,
    "name": "Draco Malfoy",
    "house": "Slytherin"
}
```

This leads to the question of why would one Database Management System be used over another?

While relational databases have been used in systems for many years, modern applications have requirements that non-relational databases have been built to address.

Modern application rely on having a _flexible data model_ that allow for simplified storage and relation of data of any structure. 

Furthermore, non-relational databases focus on _scalability_. They allow for almost unlimited growth with faster lookup times.

Finally, non-relational systems provide consistency across all systems. They are designed to run across nodes and automatically synchronize data across the servers.

In summary, non-relational databases make it simpler to modify data due to the lack of interwoven relationships that you would find within a relational database. The lack of these relationships, however, eliminate the capabilities of completing more advanced queries that allow for accessing and representing our data in different ways.

For a more in depth read through on these database systems, read the article from MongoDB's documentation [here](https://www.mongodb.com/scale/relational-vs-non-relational-database) (note that they may have a _slight_ bias as they are a non-relational database company).

## Structure of MongoDB

In MongoDB, databases hold `collections` of `documents`. Collections are the non-relational version of tables that you have perhaps seen in relational databases. Collections group related documents within the database. For example, we can have a `users` collection that will contain documents that represent all of the users we have in our system.

Documents are data records that are stored as BSON documents. BSON documents are a binary representation of JSON, and follow the familiar JSON structure. Documents are composed of field-and-value pairs that have the following structure:

```bson
{
  field1: value1,
  field2: value2,
  field3: value3
}
```

If we have a `users` collection in our database, a single `user` document may look like:

```json
{
  "first_name": "John",
  "last_name": "Wick",
  "email": "johnlovesdogs@email.com",
  "occupation": "Retired, with the occasional contract"
}
```

## Getting Started with MongoDB

### Installing MongoDB

#### macOS

MongoDB can be installed using Homebrew or by directly installing the Tarball from the MongoDB website. Homebrew is a package manager built for macOS (think _npm_). Homebrew can be installed by running the command available [here](https://brew.sh/) from your command line. Once we have homebrew installed, we are able to run installs by typing: `brew install (package name)`

You can find the complete install guide for MongoDB using brew [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#tap-the-mongodb-homebrew-tap).

To use Homebrew as the method for installing MongoDB, go to your command line, and run the following commands:

first:
```shell
brew tap mongodb/brew
```

then:
```shell
brew install mongodb-community@4.2
```

Alternatively, if you would prefer to install mongoDB using the tarball, the instructions to do that can be found [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x-tarball/).

#### windows

Windows machines do not have `brew` available as it is a package manager specifically built for macOS. To install mongoDB on Windows, the instructions can be found [here](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/).


## Installing Compass

We're going to examine how a MongoDB is structured using a GUI called [Compass](https://www.mongodb.com/products/compass). Compass allows us to navigate different collections, and allows us to interact with the data contained in the documents within these collections.

#### macOS

You can install Compass using homebrew by entering the following command in your command line:

```shell
brew cask install mongodb-compass-community
```

Alternatively, if you would prefer to complete the install via the website, you can follow the instructions available at the link [here](https://www.mongodb.com/download-center/compass). For this, please ensure that you select the `Community Edition Stable` version.

#### windows

You can follow the instructions available at the link [here](https://www.mongodb.com/download-center/compass) to complete your install. Please ensure that you have selected the `Community Edition Stable` version.

## Using Compass To Explore a Database

1. Run mongodb process in a terminal window

**macOS**
```shell
mongod --config /usr/local/etc/mongod.conf
```

**windows**
```shell
C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe
```

_Note: `Mongod` is the daemon process that handles data requests, deals with data access, and manages background operations._

2. Open the Compass application that you installed.
3. Connect to default `localhost:27017`.
4. Create a database: `junocollege`.
![create-database](https://user-images.githubusercontent.com/2818462/55284673-5d077a80-5349-11e9-8257-f98109d8a7c2.png)
5. In the `Collection Name` box, enter `users`, as we will be creating a collection of users. 
![create-collection](https://user-images.githubusercontent.com/2818462/55284719-0d757e80-534a-11e9-837c-5b1e35bf1069.png)

#### Task 1

We are going to use the Compass GUI to add some users to the `users` collection.

Along the top bar, you will see a tab that says `DOCUMENTS`. Select this tab, and you will see a button available to `INSERT DOCUMENT`. This will open a modal that will allow you to write your own key-value pairs to give the document some content. 

_Note_: It is very bad practise to add or modify documents directly from the GUI for a Production database. It is perfectly acceptable, however, to make these modifications in your local database while you are testing. 

#### Task 2
Create a new collection called `courses`
![create-collection](https://user-images.githubusercontent.com/2818462/55284727-562d3780-534a-11e9-85b6-78e39a543b45.png)

Notice that the new collection is nested within our database. You will also notice a count value for the number of `documents` each collection has. Currently, the `users` collection has a single document. 

Let's add some new courses to our `courses` collection. Click into the collection, and select `documents` from the top tab bar. Select `INSERT DOCUMENT` and create a new document for each of the following:

```json
{
  "name": "Part Time JavaScript",
  "content": "JavaScript",
  "duration": "8 weeks"
}
```

```json
{
  "name": "Accelerated JavaScript",
  "content": "JavaScript",
  "duration": "2 weeks"
}
```

```json
{
  "name": "Part Time Web Development",
  "content": "Web Dev",
  "duration": "8 weeks"
}
```

#### Task 3
Filtering with Compass

Let's filter our courses by those that teach JavaScript. 

1. Ensure that you are in the `courses` collection that we populated in `Task 2`.
2. Within the filter bar at the top of the page, type the following:  

```json
{ content: "JavaScript" }
```
3. Select the `Apply` button to the right of the query bar.
4. You should see that the `Part Time Web Development` course is no longer present in the list, and what remains are the courses that have  content with a value of `JavaScript`.

To read more about using the query bar filtering in Compass, you can refer to the documentation [here](https://docs.mongodb.com/compass/current/query-bar/#query-bar-filter). Try adding in new documents to the collection, and see if you can complete more complex filtering.

## Exploring MongoDB With Shell Client

1. Make sure mongodb process is running in a terminal window

```shell
mongod --config /usr/local/etc/mongod.conf
```
2. Connect to your running mongodb instance with the `mongo` shell client

```shell
mongo localhost:27017
```
3. We can use the `show` command within the mongo shell client to list all databases:

```shell
show dbs
```
4. We are able to utilize the `use` command to "connect" to our `junocollege` database:

```shell
use junocollege
```

### Mongo Methods

These can be used when you are navigating Mongo through the Mongo shell on your command line.

`db.{collection-name}.find()`  
If nothing is passed to the .find method, this will return a list of all of the entries that are within the specified collection.

`db.{collection-name}.find({ ... options ... })`  
This will allow you to find entries in a collection based on specific conditions. For example, you can find an entry where the `name` key has a value of your name.

`db.{collection-name}.count()`  
This will provide a number that represents the total number of entries that are within the specified collection.

`db.createCollection('COLLECTION_NAME_HERE')`  
This will create a new collection within whatever database you are currently inside of.

`db.{collection-name}.insert()`  
This will allow you to insert a new entry into the database. This can use the same syntax that would be used to find an entry.

`db.{collection-name}.deleteMany()`  
This is used to remove documents from the specified collection. In order to remove specific documents, you can utilize `deleteOne()` in order to remove only the specified documents.
