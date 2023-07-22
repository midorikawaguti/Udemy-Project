
const Tour = require('./../models/tourModels');




/************************************* HTTP method: GET All Tour***********************************/
//When someone hit this route /api/v1/tours we send back to the client, the json file
exports.getAllTours =  async(req, res) =>{
    try{
        //BUILD QUERY
        //1) Filtering
        const queryObj = {...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);


        //2)Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

       let query = Tour.find(JSON.parse(queryStr));

       
       //3) Sorting
       if (req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
       } else{
        query = query.sort('-createdAt');
       }

        //EXECUTE QUERY
        const tours = await query;

        //const query = Tour.find()
        // .where('duration')
        // .equals(5)
        // .where('difficulty')
        // .equals('easy');

         //SEND RESPONSE
        res.status(200).json({
           status: 'success', 
           results: tours.length,  
           data:{
               tours
           }
        });
    } catch(err){
        res.status(404).json({
            status:'fail',
            message: err
        })
    };
};



//Request for POST - send data from the client to the server 
/************************************* HTTP method: POST to create a new tour***********************************/
exports.createTour = async (req, res)  =>{
try{
    const newTour = await Tour.create(req.body);

    res.status(201).json({ 
        status:'success',
        data:{
            tour:newTour
        }
    });
}catch (err){
    res.status(400).json({
        status: 'fail',
        message: 'Invalid data sent'
    })
    }
};


/************************************* HTTP method: GET one Tour***********************************/
exports.getTour = async (req, res) =>{
    try{
        const tour = await Tour.findById(req.params.id);

        res.status(201).json({ 
            status:'success',
            data:{
                tour
            }
    });
    }catch (err){
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent'
        })
        }
    };
   

/************************************* HTTP method: PATH  -- update the data ***********************************/
exports.updateTour =  async (req, res) =>{
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators: true
        })
        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

/**************************************** HTTP method: DELETE  ************************************************/
exports.deleteTour = async (req, res) =>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id, req.body);

        res.status(200).json({
            status:'success',
            data:{
                tour
            }
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};