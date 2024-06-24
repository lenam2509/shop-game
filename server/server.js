var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var dotenv = require('dotenv');
dotenv.config();




app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/order', require('./routes/order.route'));


app.get('/api', function (req, res) {
    res.json({ message: 'Welcome to my application' });
});







app.get('/', function (req, res) {
    res.json({ message: 'Hello World!' });
});

const port = process.env.PORT || 2509;
app.listen(port, function () {
    console.log(`server is running at http://localhost:${port}`);
}
);


