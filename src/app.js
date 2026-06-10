const express = require('express');

const app = express();

app.get('/', (req,res)=>{
    res.send("Banking Customer Portal");
});

app.listen(3000);