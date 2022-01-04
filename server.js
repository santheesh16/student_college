// Import npm packages
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')

global.__basedir = __dirname + "/..";

const app = express();
const PORT = process.env.PORT || 8000; // Step 1

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const excelRoutes = require('./routes/excel');
const labRoutes = require('./routes/lab');
// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('tiny'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', excelRoutes);
app.use('/api', labRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname,'client/build')));

  app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  })
}

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
