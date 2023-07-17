const express = require('express');
const sassMiddleware = require('node-sass-middleware');

const path = require('path');
const app = express();
const port = 3000;

app.use(
    sassMiddleware({
        src: path.join(__dirname, 'scss'),
        dest: path.join(__dirname, 'public', 'styles'),
        debug: true,
        outputStyle: 'compressed',
        prefix: '/styles'
    })
);

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});