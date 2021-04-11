// server port
const port = 3000;
// Endpoint for all routes
const projectData = {};
// store users data
const usersData = [];

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();

/* Middleware */
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// routes
// POST handler
/**
 * creates a new entry on the server and stores it in usersData array
 * @param { Object } req: request object
 * @param { Object } res: response object
 */
const onPost = (req, res) => {
    // new entry
    const newEntry = {
        id: usersData.length + 1,  // increment entries id by 1
        date: req.body.date,
        temperature: req.body.temperature,
        feeling: req.body.feeling
    }
    // store entry in usersData
    usersData.push(newEntry);
    // log usersData array
    console.log(usersData);
    // copy newEntry object to projectData
    Object.assign(projectData, newEntry);
    // send back to user
    res.send(projectData);
}
// post route
app.post('/postUserData', onPost);

// GET handler
/**
 * sends the latest entry to the user
 * @param { Object } req: request object
 * @param { Object } res: response object
 */
const onGet = (req, res) => {
    // get the latest entry in usersData
    const ud = usersData[usersData.length - 1];
    projectData.id = ud.id;
    projectData.date = ud.date;
    projectData.temperature = ud.temperature;
    projectData.feeling = ud.feeling;
    // send to user
    res.send(projectData);
}
// get route
app.get('/getUserData', onGet);


// server
// server listener to show the the server has started at which date/time
const serving = () => {
    console.log(`Node server started listening at port: ${port} on ${new Date().toUTCString()}`);
}
// start server
const server = app.listen(port, serving);