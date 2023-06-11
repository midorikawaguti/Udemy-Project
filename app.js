//app.js has all the express configuration

const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

//1)Middlewares
app.use(morgan('dev'));

app.use(express.json()); 

app.use((req, res, next)=>{
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    next();
})



const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/4-NATOURS/dev-data/data/tours-simple.json`)
);
    
/************************************* HTTP method: GET***********************************/
const getAllTours = (req, res) =>{
    console.log(req.requestTime);

    res.status(200).json({
       status: 'success', 
       requestedAt: req.requestTime,
       results: tours.length,  
       data:{
           tours
       }
    });
};

/*-----------------hit this endpoint with ID ----------------*/
const getTour = (req, res) =>{
console.log(req.params); 
const id = req.params.id*1; 

    if(id>tours.length){
        return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
        })
    }

        const tour = tours.find(el=>el.id === id) 

    res.status(200).json({
       status: 'success', 
       results: tours.length,  
       data:{
           tour
       }
    });
};

/************************************* HTTP method: POST***********************************/
const createTour = (req, res)  =>{

    const newId = tours[tours.length -1].id + 1; 
    const newTour = Object.assign({id: newId}, req.body); 

    tours.push(newTour); 

    fs.writeFile(`${__dirname}/4-NATOURS/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({ 
            status:'success',
            data:{
                tour:newTour
            }
        });
    });
}

/************************************* HTTP method: PATH  -- update the data ***********************************/

const updateTour = (req, res) =>{
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    res.status(200).json({
        status:'success',
        data:{
            tour:'<Update tour here...>'
        }
    });
};

/************************************* HTTP method: DELETE  ***********************************/

const deleteTour = (req, res) =>{
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
};

const getAllUsers = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: "This route is not yet defined"
    })
}

const getUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: "This route is not yet defined"
    })
}

const updateUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: "This route is not yet defined"
    })
}

const deleteUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: "This route is not yet defined"
    })
}

const createUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: "This route is not yet defined"
    })
}

// Routes
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.patch('/api/v1/tours/:id', updateTour);

app
.route('/api/v1/tours')
.get(getAllTours)
.post(createTour);

app.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour);

app.route('/api/v1/users')
.get(getAllUsers)
.post(createUser);

app.route('/api/v1/users/:id')
.get(getUser)
.patch(updateUser)
.delete(deleteUser);

//To start up the server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});




