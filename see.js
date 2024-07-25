const fs = require('fs');

fs.readFile('wee.txt','utf-8',(err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log(data);
    }
})

// fs.writeFile('wee.txt','Hloo','utf-8',(err,data)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(data);
//     }
// })

// fs.appendFile('wee.txt','welcome guys','utf-8',(err,data)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(data);
//     }
// })