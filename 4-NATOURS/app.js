//1) app.js has all the express configuration

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/**********  1) MIDDLEWARES  ***********/
app.use(morgan('dev'));
app.use(express.json());



// Create a Middleware: middleware is basically a function that can modify the incoming request data

app.use((req, res, next)=>{
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    next();
})


// 3) ROUTE

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//4) START THE SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});



    


