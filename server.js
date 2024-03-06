const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/api', (req, res) => {
  const delay = Math.floor(Math.random() * 1000) + 1;
  setTimeout(() => {
    const currentTime = new Date().getTime();
    if (currentTime - req.app.locals.lastRequestTime < 1000) {
      res.status(429).send('Too Many Requests');
    } else {
      req.app.locals.lastRequestTime = currentTime;
      res.send({ index: req.body.index });
    }
  }, delay);
});

app.locals.lastRequestTime = new Date().getTime();

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
