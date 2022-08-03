const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || '5000';
const pool = require('./db');
app.listen(port, () => {
    console.log('App started on port ' + port);
});

app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors({origin: '*'}));
