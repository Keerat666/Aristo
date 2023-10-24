const express = require('express');
var cors = require('cors')
const app = express();
const path = require('path');
const PORT = 8009;
const gpt = require("./controllers/gpt")

require('dotenv').config();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'ui/aristo-react-ui/build')));

// Handle other routes and return the React app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui/aristo-react-ui/build/index.html'));
});


//Please don't delete this health API
app.use('/api/health', (req, res) => {
    res.send('Hello Aristo!');
  });


  app.post('/api/review',(req,res)=>{

    gpt.generatePrComments(req,res)

  })

  app.get('/api/fetchFiles',(req,res)=>{

    gpt.fetchAllFiles(req,res)

  })

  app.post('/api/fetchContent',(req,res)=>{

    gpt.fetchContentOfFile(req,res)

  })

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

module.exports = app;