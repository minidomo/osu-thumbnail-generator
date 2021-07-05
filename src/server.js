const express = require('express');
const app = express();

const PORT = 8080;

app.use(express.static('./public'));

app.listen(PORT).on('listening', () => console.log(`listening at http://localhost:${PORT}/`));