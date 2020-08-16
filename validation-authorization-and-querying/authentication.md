###### [[Module Home](README.md)]

# Authentication

Authentication is the process of verifying a requester's identity.

HTTP, the protocol that is used to communicate across the web is 'stateless', meaning it will not remember information from one request to the next. Let's say you make a request to get your tweets. In plain English, you would make a get request to Twitter saying 'Hello, I am user A and I would like my tweets please'. Twitter would check to make sure you are user A and return your first 100 tweets. If you then sent a second get request asking for the next 100 tweets, Twitter would not know who you are even though you just made a request. This is why we need some form of authentication in our apps, it's a way to ensure our server and client know who is making requests each time a request is made.

The steps behind authentication are as follows:
1. You register for a website with a set of credentials (usually an email and password), and that record is stored in a database.
2. Later, when you want to log in, you send that set of credentials back to the website.
3. If the credentials you provided match an existing record in the database then you're allowed in.

## How Authentication Works

There are two common user authentication patterns:

* **Username (or email) / Password**: Users register on your site/app with a username and password. On subsequent visits to your site, they login with that username and password, and you verify that they are correct.
* **OAuth2**: Users sign in using a separate social media account, like Facebook, Twitter, etc. You only need to store that user's identity on that site to log them into your site/app.

_This course will be focusing on username/password authentication method_.

## Why Authentication Is Important
There are many reasons you might want authentication for your site/application:
1. If you are storing sensitive information that should be viewable by certain people only.
2. Your application performs transactions.
3. You would like to have personalizations.
4. You are trying to build a unique community of engaged visitors.

When logging in a user by username/email and password, you'll typically have an endpoint defined on your site that takes a payload with username and password properties and compares them against your database.

However, doing a simple lookup on a username/email and password can be a huge security risk. If someone gets access to your database, they can get access to your user's passwords. This is why you should never store passwords directly (in plain text) in your system.

* Storing passwords in your database allows anyone who gains access to your database full access to all of your user's private information - both on your site and potentially others (people have a tendency use the same password for things).
* A developer of a site really shouldn't have access to sensitive information such as passwords (developers having access is considered bad practice).

Well built sites **hash** their passwords. **Hashing** is basically a way to encrypt a password in a way that can _never_ be reversed. Password authentication works by transforming passwords into a hash, and storing that hash in the database in place of the plain text password.

Most authentication systems use an algorithm called [bcrypt](https://en.wikipedia.org/wiki/Bcrypt) to hash passwords. This is what we will be using for password hashing in this class.


## Token Based Authentication

Once you've determined that a user is allowed to log into the system, we need a way for them to identify themselves to the rest of your application (without the need to send their username and password with every request). This can be handled through the use of tokens.

#### Token Based Authentication Flow
<img width="857" alt="jwt-token-flow" src="https://user-images.githubusercontent.com/2818462/55676601-35169a80-58a6-11e9-9f98-1733ac2e0c9b.png">

With token based authentication, the login endpoint returns a few pieces of information.
* An **access token** that can be used for subsequent calls to the API
* A **refresh token** that can be used to generate a new _unexpired_ token
* Access point information for where to send the **refresh token**

Access tokens will be passed in the header for all requests to an API. This is how the API will know if the request has permission or not for the API resource being accessed. 

Request headers are used for passing a token as headers are encrypted, and we want to keep our sensitive information secure. A specialized header that exists to address this method of passing information is the [Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) header. 

## Session Based Authentication
Another common approach to authentication is called a session. In this approach the client will provide the user's details (usually username and password) and the server will compare those to whatever is stored in the database. If the comparison is successful, a session will be issued for that user. The session ID will be returned to the client and the client can use that session ID in subsequent requests.

The client typically stores the session ID in a cookie which it then provides on all subsequent requests. This is unlike token based authentication where the client holds all the information about themselves in a token. In the session based approach, the server holds all the information about the user.

Session's provide an easy way to 'logout' a user. When a user logs out, the client will send a request to the server which will then invalidate that session. Any calls made with that session ID will not be allowed access to information. 

## Token vs session based authentication
Token based authentication can be thought of like a support ticket that contains a bunch of information about your support claim. Let's say there was a customer support desk that didn't have a computer or telephone or any other electronic system. When a customer needs help with something, they are issued a ticket that is filled out with all the information about their problem. The customer support rep, signs the ticket and tells the customer to bring the ticket back the next day for more help. The next day, there is a new customer support rep, the customer presents their ticket to this rep, who then verifies the signature, reads all about their case and can continue to help them. This is a how token based authentication works.

A session based system can be thought of in a slightly different way. Take the same example above, but give the customer support people phones and computers. When a customer calls with a problem, the customer support rep enters all their information in the computer and gives the customer an ID. When that customer calls back again, they give that ID and a new customer support rep can access their case using the ID on the computer.

The difference is where the state of the user is being managed. In the case of token based authentication, the client is being given the information needed to manage the state of the user. With session based authentication, the server manages the state of the user, usually either in the form of a cache or database table containing session information.

## JWT Tokens

For the purposes of this course, we are going to use a popular token solution called JWT tokens. These are tokens that contain information about the user that are signed by the server. This signature is what provides the authentication, only a server with the appropriate secret is able to create or decode the signature.

### How do JWT Tokens work?

JWT Tokens are JSON objects with a digital signature that transmit information between a server and a client.  This pattern creates a standard way for services to communicate between each other. JWT tokens can be used in many situations, between a frontend client and a backend server, or between backend microservices. They are relatively quick to implement in a project, performant and easy to include in requests.

JWT tokens contain three main parts: the header, the payload and the signature.
* The header: contains information about how the signature should be created. 
* The payload: contains whatever information you'd like the JWT token to hold. This is usually non-sensitive information about the user, for instance an ID or username. It could also potentially contain information about when the token expires. 

These two parts of the token are JSON objects that have been base64 encoded. This is easily decoded in any programming language which is why sensitive information about a user should not be stored in the token.

* The signature: this creates the tamper-proof nature of the token. It is created by taking the base64 encoded header and payload and mixing it up with a secret. This secret is a string that you set on your server and you do not share with anyone (not even github)!

There are many different 'mixtures' for creating the signature. These are referred to as algorithms. One of the the more common is the HMAC class of algorithms which uses a cryptographic hash function and a secret key to encode and decode the token information. Therefore any parties with the secret key can create and validate tokens. RSA and ECDSA algorithms allow tokens to be created by only one service as opposed to any service with the secret. They take longer to create and are larger in size.  

When a request comes in with a JWT token, the server will take the base64 encoded header and payload and mix it up with it's secret. It will then compare the result of this mixture with the signature provided on the token. If those two pieces of data match, the JWT token is valid and the request can proceed.

The client is responsible for storing the JWT token and sending it to the server any time it wants to make a request. The client implementation is up to the developer. Some common practices include storing the JWT token in a cookie, or use the `Authentication` header to pass it to the server.

### Complications with JWT Tokens
JWT Tokens are tamper proof. If someone tried to provide different information in the payload than what was originally provided, the signature would not match the one created by the server and the request would not go through.

However, if someone was able to intercept the JWT token, they could make requests as that user. This is why it's important to always use HTTPs so that the contents of requests can't be easily viewed. JWT tokens are also commonly used with an authentication pattern called OAuth that requires tokens to be reissued at short intervals. This means that stolen tokens would soon become invalid.

If a JWT Token is used for malicious purposes, unfortunately it cannot be invalidated because the client holds the information. It is therefore common to keep a list of blacklisted tokens in a database or cache of some kind so that bad tokens can be rejected.

### Try it
In [this code along](https://github.com/HackerYou/con-ed-full-stack/tree/notes-starter), we are going to try implementing JWT token based authentication. 

You can find [the completed code along here](https://github.com/HackerYou/con-ed-full-stack/tree/note-finished).

