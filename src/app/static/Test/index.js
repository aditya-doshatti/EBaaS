var express = require('express');
var config = require('./config/config.json')
var path = require('path');

// route imports
// ********************** need to import each an every route file********************************
var employee = require('./routes/employee.js')
var salary = require('./routes/salary.js')


var app = express();
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Declare routing
//************************ need to specify routing over here **************************************
app.use("/salary",salary)
app.use("/employee",employee)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))