var express = require('express');
var config = require('./config/config.json')
var path = require('path');

// route imports
// ********************** need to import each an every route file********************************
var employer = require('./routes/employer.js')
var employee = require('./routes/employee.js')
var employer = require('./routes/employer.js')
var employee = require('./routes/employee.js')
var employer = require('./routes/employer.js')
var employee = require('./routes/employee.js')


var app = express();
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// Declare routing
//************************ need to specify routing over here **************************************
app.use("/employee",employee)
app.use("/employer",employer)
app.use("/employee",employee)
app.use("/employer",employer)
app.use("/employee",employee)
app.use("/employer",employer)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))