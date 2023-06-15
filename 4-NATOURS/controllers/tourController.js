const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/************************************* HTTP method: GET All Tour***********************************/
//When someone hit this route /api/v1/tours we send back to the client, the json file
exports.getAllTours = (req, res) =>{
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



//Request for POST - send data from the client to the server 
/************************************* HTTP method: POST to create a new tour***********************************/
exports.createTour = (req, res)  =>{
    const newId = tours[tours.length -1].id + 1; 
    const newTour = Object.assign({id: newId}, req.body); 
    tours.push(newTour); 
    
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({ 
            status:'success',
            data:{
                tour:newTour
            }
        });
    });
}


/************************************* HTTP method: GET one Tour***********************************/
exports.getTour = (req, res) =>{
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
       };
   

/************************************* HTTP method: PATH  -- update the data ***********************************/
exports.updateTour =  (req, res) =>{
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

/**************************************** HTTP method: DELETE  ************************************************/
exports.deleteTour =  (req, res) =>{
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