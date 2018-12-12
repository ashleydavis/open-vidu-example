const express = require('express');
const morganBody = require('morgan-body');
var proxy = require('http-proxy-middleware')

const app = express();
morganBody(app);
app.use(express.static('static'));

console.log("Proxy target: " + process.env.PROXY_TARGET);   

// Proxy API.
app.use('/', proxy({ 
    target: process.env.PROXY_TARGET,
    changeOrigin: false,
    secure: false,
    logLevel: "debug",
    ws: true,
}));

app.listen(process.env.PORT || 80);
