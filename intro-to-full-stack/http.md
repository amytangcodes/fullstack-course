###### [[Module Home](README.md)]

# HTTP

HTTP stands for _Hypertext Transfer Protocol_, and it is the way in which computers deliver data (webpages, funny gifs, API data) to one another.

Any time you type a URL into your browser bar and hit enter, you are making an HTTP request. If you've ever made an AJAX request to an API, under the hood, that request employs HTTP.

Broadly speaking, HTTP is divided into two pieces: a _request_ that the client makes to an external location (like a server) for a piece of data (often called a 'resource') and the _response_ that comes back from that external location (the data that was requested).

For example, when you navigate to `www.junocollege.com`, you are making a **request** to the server where our website is hosted, and the website issues a **response** to your request (by delivering the website itself).

When you log in to your Twitter account, the Twitter website makes a **request** to the Twitter server for your feed, and the server offers a **response** in the form of all the tweets that belong in your feed.


[Resource](http://www.ntu.edu.sg/home/ehchua/programming/webprogramming/http_basics.html): These are some technical docs on the basics of HTTP.

## HTTP Request Structure
![http-request-packet-basics-diagram][http-request]

[http-request]: https://user-images.githubusercontent.com/2818462/53857159-24bb8900-3fa3-11e9-9f5b-ab86e4956b1f.png "Basic image of http packet"

HTTP **Requests** have _four_ major components:

* **URL** - What external location we are making the request to. Could be to `http://pokeapi.co/api/v2/` to get a list of pokemon, for example.
* **Method** - What we want to DO at that external location:
  * **GET** - When we want to RETRIEVE data about a resource
  * **POST** - We want to CREATE some new data at the URL we provided
  * **PUT** - We want to REPLACE the resource at the URL we provided with a new resource we are providing
  * **PATCH** - We want to UPDATE the resource
  * **DELETE** - We want to REMOVE the resource
* **Headers** - Headers typically contain additional information about the request that is coming through. Headers can contain anything, but usually include:
  * **Accept** - Let's the server know which types of data the client can understand - usually we set this as JSON.
  * **Content-Type** - The format of the request that the client is sending. This can be `application/json` if we are sending JSON, or `application/x-www-form-encoded` for sending form data.
* **Body** - In addition to Headers, your request can also have a `body`, which contains additional details about what the client would like the server to do. In a POST request, the body will contain information about the resource you are creating. For example, if sending a POST request to register a new user, the request body can contain information about the user's email and password.

## HTTP Response Structure
![http-response-packet-basics-diagram][http-response]

[http-response]: https://user-images.githubusercontent.com/2818462/53858057-8a5d4480-3fa6-11e9-9593-4e903b8ebd3e.png "Basic image of http response packet"

HTTP **Responses** have three major components:

* **Status Code** - These are used to indicate if a request has been successfully completed. You may be familiar with the common `404 Error`. 404 is an example of a status code that indicates that the browser was able to communicate with the server, however, the server was unable to find the requested information. A status code of `200` is often used to indicate that a successful request was made. You can read more about status codes from the resources [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) and [here](https://httpstatuses.com/)

* **Headers** - Additional information can be passed in response headers, as would be passed in the headers of a request. For example, the `Content-Type` header can be used in your response to specify the content types that your requests should return. Since multiple types can be defined, the `Content-Type` in the response header can be used to explicitly identify the actual type that is being returned from the server. You can read more about headers [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) 

* **Body** - The response body will contain the information that is returned from the specified API endpoint. Not all responses will have a body. For example, responses with a status code of `201` or `204` usually do not have have a response body. You can read more about response bodies [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)


## Exercise

We're going to use a tool to help us make API requests. This tool will help us visualise what is occurring with the request. Insomnia works by allowing us to specify the URL that we would like to make a request to, as well as allowing us to specify a request body and send any headers. Once the request is sent, it will show us the response that the server provides. This is an effective method for providing fast feedback in seeing if our API is functioning as expected.

### Step 1 - Download and install our API tool

Insomnia can be installed for Mac, Windows, and Linux at the link [here](https://insomnia.rest/download/).

Alternatively, if you have a Mac and would prefer to use the command line (and have the Homebrew package manager installed), Homebrew can be used to complete the installation. The following are the commands you can run in your command line:

```shell
$ brew update
$ brew install insomnia
```

Once the installation has completed, open up the newly installed application.

### Step 2 - Running our first request

Create a new workspace

<img width="250" alt="Image of the create workspace button in Insomnia" src="https://hychalknotes.s3.amazonaws.com/create_workspace_insomnia--conedfullstack.png">


- Workspaces allow us to group related requests that pertain to a specific project.
- It is not imperative to always create a new workspace when making a new request, however, it is strongly advised to create a new workspace when starting on a new API project.


Create our first request

You can select the 'New Request' button from the main pane in Insomnia. Additionally, you can elect to use the shorthand of `ctrl-N` / `cmd-N`.

<img width="250" alt="Image of the create workspace button in Insomnia" src="https://hychalknotes.s3.amazonaws.com/new_request_insomnia--conedfullstack.png">


We are able to provide a name for our request that allows us to remember what a specific request is doing. For example, `Get all Pokemon`, `Get a specific Pokemon`, etc. This helps immensely with organization.

<img width="450" alt="Image of the new request button in Insomnia" src="https://hychalknotes.s3.amazonaws.com/new_request_information--conedfullstack.png">

We are able to add customizations to our request through the request pane in Insomnia. This includes adding the full URL at the top with the endpoint specified, identifying the type of HTTP method, including a body with the request of multiple different types, including headers, query parameters, and more.

<img width="250" alt="Image of the customizable request pane in Insomnia that allows for a URL to be specified, information to be passed with the requset, and the HTTP method to be customized" src="https://hychalknotes.s3.amazonaws.com/requestpane_insomnia--conedfullstack.png">


Insomnia provides a response pane directly within the tool that makes it clear exactly what has come back from the API. This includes the response body, the status code, the amount of time that the request took to return a response, and the overall size of the response object.

<img width="250" alt="Image of the response pane in the Insomnia tool" src="https://hychalknotes.s3.amazonaws.com/responsepane_insomnia--conedfullstack.png">

This flow of testing out each of the endpoints in your API is an imperative step in the development process as it is the quickest way to test if you are receiving an expected response.


#### **Extra:**
These are some other services that allow you to play with API's and HTTP verbs.
- `ReqRes`, which can be found [here](https://reqres.in/), allows developers to test out front end code by receiving realistic API responses from sending requests to the service.
- `Jsonplaceholder` is a service that allows us to make requests to a URL and get a JSON response. Instructions on use can be found [here](https://jsonplaceholder.typicode.com/).
- There are also great alternatives to Insomnia that function very similarly, and allow for testing out our API. An excellent option is `Postman` which can be found [here](https://www.getpostman.com/).
