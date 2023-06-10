const fs = require('fs'); // return a object that contain functions
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./1-NODE-FARM/modules/replaceTemplate')


// //SERVER - more efficient! ready only once the templates and Json file. There is no need to read the data each time it is requested. It can be done once in the beginer.
// const replaceTemplate = (temp, product) =>{
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC}/g, 'not-organic');
//     return output;
// }

const tempOverview= fs.readFileSync(`${__dirname}/1-NODE-FARM/template/template-overview.html`, `utf-8`);
const tempCard= fs.readFileSync(`${__dirname}/1-NODE-FARM/template/template-card.html`, `utf-8`);
const tempProduct= fs.readFileSync(`${__dirname}/1-NODE-FARM/template/template-product.html`, `utf-8`);

const data = fs.readFileSync(`${__dirname}/1-NODE-FARM/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);

console.log(slugify('Fresh Avocados', {lower:true}));

const slugs = dataObj.map(el=>slugify(el.productName, {lower:true}));
console.log(slugs);

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // console.log(url.parse(req.url, true))
    const {query, pathname} = url.parse(req.url, true);
    // const pathName = req.url;

    //Overview page
    if(pathname === '/' || pathname ==='/overview'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //el=element what holds the data
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    //Product page
    } else if (pathname ==='/product'){
        res.writeHead(200, {'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    //API
    } else if (pathname ==='/api'){
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(data);
    }

    //Not found
    else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-word'
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () =>{
    console.log('Listening to request on port 8000');
});


//SERVER
// const server = http.createServer((req, res) => {
//     const pathName = req.url;
//     if(pathName === '/' || pathName ==='/overview'){
//         res.end('This is the overview');
//     } else if (pathName ==='/product'){
//         res.end('This is the product');
//     } else if (pathName ==='/api'){
//         fs.readFile(`${__dirname}/1-NODE-FARM/dev-data/data.json`, `utf-8`, (err, data) =>{
//             const productData = JSON.parse(data);
//             res.writeHead(200,{'Content-type': 'application/json'})
//             res.end(data);
//         })
//     }
//     else{
//         res.writeHead(404, {
//             'Content-type': 'text/html',
//             'my-own-header': 'hello-word'
//         });
//         res.end('<h1>Page not found!</h1>');
//     }
// })
// server.listen(8000, '127.0.0.1', () =>{
//     console.log('Listening to request on port 8000');
// });



// //BLOCKING, SYNCHRONOUS WAY
// //READ FILE
// const textIn = fs.readFileSync('/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/input.txt', 'utf-8');
// console.log(textIn);


// //WRITE FILE
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/output.txt',textOut);
// console.log('File written!');

// //non-BLOCKING, ASYNCHRONOUS WAY
// fs.readFile(`/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/start.txt`, `utf-8`,(err, data1) => {
//     if(err) return console.log('ERROR!');
//     fs.readFile(`/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/${data1}.txt`, 'utf-8',(err, data2) =>{
//         console.log(data2);
//         fs.readFile(`/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/append.txt`, 'utf-8',(err, data3) =>{
//             console.log(data3);

//             fs.writeFile('/Users/midorikawaguti/DevProject/Udemy-Project/1-NODE-FARM/txt/final.txt',`${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('Your file has been written ');
//             });
//         });
//     });
// });
// console.log('Will read file!');