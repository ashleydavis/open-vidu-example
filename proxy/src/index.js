const express = require('express');
const morganBody = require('morgan-body');

const app = express();
morganBody(app);
app.use(express.static('static'));

app.listen(process.env.PORT || 80);
