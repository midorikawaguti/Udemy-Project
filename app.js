//app.js has all the express configuration

//require the "express" package
const express = require('express');

const fs = require('fs');

const app = express();

//middleware is basically a function that can modify the incoming request data.
//It's called middleware because it stands between, so in the middle of the request and the response.
//It's just a step that the request goes through while it's being processed.
app.use(express.json());

/********************************GET*************************************/

//define route -- How an application will respond to a certain request (URL)
//get = http method 
// '/' route

/*--------------------First example using SEND-------------------------------*/
//status(200).send = methods
// app.get('/', (req, res) => {
//     res.status(200).send('Hello from the server side!');
// });

/*--------------------Second example using JSON-------------------------------*/
//instead of using 'send' let's use JSON. It willl allows to send an object:

// app.get('/', (req, res) => {
//     res.status(200)
//     .json({message: 'Hello from the server side!', app:'Natours'});
// });


//PARSE: Json will be converted in a array of JS object
//module fs was required in the top
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/4-NATOURS/dev-data/data/tours-simple.json`)
);
    
//When someone hit this rout /api/v1/tours we send back to the client, the json file
app.get('/api/v1/tours', (req, res) =>{
 res.status(200).json({
    status: 'success', 
    results: tours.length,  
    data:{
        tours
    }
 });
});
/*--------------------Third example using JSON -hit this endpoint with ID -------------------------------*/
app.get('/api/v1/tours/:id', (req, res) =>{
console.log(req.params); //So, request dot params is a very nice object which automatically assigns the value to our variable, so our parameter that we defined.
const id = req.params.id*1; //Convert an string to a number

if(id>tours.length){
    return res.status(404).json({
    status: 'fail',
    message: 'Invalid ID'
    })
}

const tour = tours.find(el=>el.id === id) //we want to find the element where the ID is equal to the one that we get from the parameters.


    res.status(200).json({
       status: 'success', 
       results: tours.length,  
       data:{
           tour
       }
    });
   });


/************************************* HTTP method: POST***********************************/
/*----------------------------First example-------------------------------*/
// app.post('/', (req, res) =>{
//     res.send('You can post to this endpoint...');
// });

/*--------------------Second example-------------------------------*/

//body is the property that is gonna be available on the request, because we used that middleware a couple of moments ago.

//what we want to do now is to actually persist that data into this tour simple JSON file. We're actually gonna modify this file, 
//so that the data is saved to our fictional database here. This JSON file right now kind of works as our fictional database.

//(req, res) is a callback function that will run in the event loop
app.post('/api/v1/tours', (req, res) =>{
    // console.log(req.body);
    const newId = tours[tours.length -1].id + 1;  //figure out the id of the new object. Take the last Id and add 1 to that
    const newTour = Object.assign({id: newId}, req.body); //assign the id to a new Tour

    tours.push(newTour); // push the new tour into the tour array

    //writeFile -  We want to pass in a call-back function that is gonna be processed in the background and as soon as it's ready,it's 
    //gonna put its event in one of the event loop queue, which is then gonna be handled
    //we will really override this file so that when we restart this server, it's (tour obj) then gonna be there.
    fs.writeFile(`${__dirname}/4-NATOURS/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({ //200 stands for okay, 201 stands for created, We created a new resource on a server.
            status:'success',
            data:{
                tour:newTour
            }
        });
    });
});


/************************************* HTTP method: PATH  -- update the data ***********************************/

// app.patch('/api/v1/tours/:id',(req, res) =>{
//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             status:'fail',
//             message:'Invalid ID'
//         });
//     }
//     res.status(200).json({
//         status:'success',
//         data:{
//             tour:'<Update tour here...>'
//         }
//     });
// });


/************************************* HTTP method: DELETE  ***********************************/

app.delete('/api/v1/tours/:id',(req, res) =>{
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    res.status(204).json({
        status:'success',
        data: null
    });
});


//To start up the server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});




