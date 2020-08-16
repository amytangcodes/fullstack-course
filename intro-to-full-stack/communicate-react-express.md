###### [[Module Home](README.md)]

# Communicating Between React and Express

## Jawber: A Job Hunting Application 

Now that we've gotten some experience with setting up API endpoints in Express, let's work to link a React application to a back end that we create.

Start by cloning the repo found [here](https://github.com/HackerYou/con-ed-full-stack-jawber-starter). It has the front end already completed, and we will be writing the back end code to link to the existing front end: 

```bash
git clone https://github.com/HackerYou/con-ed-full-stack-jawber-starter.git
```

Install the dependencies:

```bash
npm install
```

Let's start by getting our project running, so that we are able to see the effects of the changes in our code. The front end portion of the application is a React application that was bootstrapped with create-react-app. Typically, to start a create-react-app application, there is a start script that uses the command `react-scripts start` to get the app running. If you look in the `package.json` file of Jawber, we are still doing that, however, we are specifying that this is starting our client. We can run our client side application by typing:

```shell
npm run start:client
```

You should see the application open in your browser.

Next, let's get the back end of our application running. In order to run the back end, we will use the server start command available in our `package.json` file. We will start our server by running:

```shell
npm run start:server
```

You should see your code hanging in the terminal, indicating that our server is ready for our requests.

Let's start by looking at our endpoints. We will be working inside of `jobRoutes.js`, which is nested inside of `api/routes/jobs`. We will be writing the code for a route that will fetch all of the jobs, and then we will write the code for another route that will allow us to add a job.

_Note: It is within the routes file that, following our lessons on database, we will eventually be interacting with the database, and pushing and retrieving data._


You will see that we defined an array at the top of the file that is holding our job objects. This is taking the place of our database temporarily, and is holding all of the jobs that we have added so far. We have a `'/'` endpoint that, when a GET request is made, will return the array.

We have to ensure that we are first bringing Express into the file, and we will be using the Router object from Express. The following should be added to the top of the file:

```js
// jobRoutes.js
const express = require('express');
const router = express.Router();
```

Now that we have the necessary imports, we can write our stub for completing a GET request to the `/` endpoint:

```js
// jobRoutes.js
router.route('/')
  .get((req, res) => {
    // 1. Respond with the array of jobs

  });
```

As we saw previously, let's use the response object to send a response of the array of jobs.

```js
// jobRoutes.js
router.route('/')
  .get((req, res) => {
    // 1. Respond with the array of jobs
    res.status(200).send({
      data: jobs
    });
  });
```

Great! Now we are returning the array of jobs that we have stored. 

Let's work to write the code for the end point that will allow us to add a new job to our array. The stub for this functionality is as follows:

```js
// jobRoutes.js
router.route('/add')
  .post((req, res) => {
    // 1. Grab the new job information from the request body.

    // 2. Push the job to our job array.

    // 3. Respond with the updated jobs array.

  });
```

We will first need to destructure the different pieces of information that are coming from the request body. We can do that with the following line: 

```js
// jobRoutes.js
router.route('/add')
  .post((req, res) => {
    // 1. Grab the new job information from the request body.
    const { title, company, link } = req.body;

    // 2. Push the job to our job array.

    // 3. Respond with the updated jobs array.

  });
```

Next, let's get the new job into the array.

```js
// jobRoutes.js
router.route('/add')
  .post((req, res) => {
    // 1. Grab the new job information from the request body.
    const { title, company, link } = req.body;

    // 2. Push the job to our job array.
    jobs.push({
      title: title,
      company: company,
      link: link
    });

    // 3. Respond with the updated jobs array.

  });
```

Finally, we now can return the jobs array as it has been updated.

```js
// jobRoutes.js
router.route('/add')
  .post((req, res) => {
    // 1. Grab the new job information from the request body.
    const { title, company, link } = req.body;

    // 2. Push the job to our job array.
    jobs.push({
      title: title,
      company: company,
      link: link
    });

    // 3. Respond with the updated jobs array.
    res.status(200).send({
      data: jobs
    });
  });
```

Amazing! We've now introduced some endpoints that we can interact with from our front end. Let's switch over to the front end code and add the calls in.

We will be editing the `Jobs.js` and `JobForm.js` files as these are where we are making the calls to the endpoints that we've just added. Let's start in the `Jobs.js` file where you will see a comment in the `useEffect` to complete the API call there.

```js
// Jobs.js
useEffect(() => {
  // Make call to /api/jobs here
}, []);
```

_Note_: `useEffect` utilizes the new React Hooks API. For our purposes, you can think of it here as taking the place of `componentDidMount`. 

We have configured our API to prepend our requests with /api/jobs (we will discuss this process in greater detail in the future), so the endpoint that we are going to hit here is at the URL: `http://localhost:3000/api/jobs`.

Let's add the Axios request in:

```js
// Jobs.js
useEffect(() => {
  // Make call to /api/jobs here
  const jobData = axios.get('http://localhost:3000/api/jobs');
}, []);
```

We are going to use another Hook to update our state for us, which is in the function `setJobs`. This is very similar to doing `this.setState()` which you may have seen in the past.

```js
// Jobs.js
useEffect(() => {
  // Make call to /api/jobs here
  const jobData = axios.get('http://localhost:3000/api/jobs');
  jobData.then(results => {
    setJobs(results.data.data)
  });
}, []);
```

We won't see anything at this point, as we don't have any jobs in there! You're welcome to add some jobs into the array that we declared in `jobRoutes.js` to see the jobs start to populate. This would be of the format:

```js
const jobs = [{title: 'Time Traveller', company: 'Not Yet Invented', link: 'www.nowisthefuture.com'}];
```

Let's work on the job form where we are adding in jobs through the front end. This will be calling our `add` endpoint, and will allow us to add new jobs into our array.

In `JobForm.js`, you will see a function called `handleAddJob`. This function has access to the necessary job data in order to create a job object that we can push with our request.

```js
// JobForm.js
function handleAddJob() {
  // Make request to add job here
}
```

Let's pass the necessary information alongside our POST request.

```js
// JobForm.js
function handleAddJob() {
  // Make request to add job here
  const jobData = axios.post('http://localhost:3000/api/jobs/add', {
    title: jobTitle,
    company: jobCompany,
    link: jobLink
  });
}
```

Amazing! We are now adding the job to our array. Try adding a job, and give the page a refresh to ensure that the job shows up.

For a little added flair, we can do a fun state change to update the jobs that are appearing on the page without a refresh. In the starter code, we passed the `addJob` function as a prop that updates the state of our jobs array. Let's add this in just to make the experience a little more user friendly.

```js
// JobForm.js
function handleAddJob() {
  // Make request to add job here
  const jobData = axios.post('http://localhost:3000/api/jobs/add', {
    title: jobTitle,
    company: jobCompany,
    link: jobLink
  });
  jobData.then(results => {
    addJob(results.data.data[0].title, results.data.data[0].company, results.data.data[0].link)
    setOpen(false)
  });
}
```

Try adding a new job now. Wow! That looks amazing. The hunt truly begins. Great job!



