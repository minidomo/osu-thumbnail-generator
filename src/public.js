const config = require('../config.json');

window.onload = () => {
    document.getElementById('username0').textContent = config.username0;
    document.getElementById('username1').textContent = config.username1;
    document.getElementById('title').textContent = config.title;
    document.getElementById('round').textContent = config.round;
    document.getElementById('message-middle').textContent = config.message.middle;
    document.getElementById('message-custom').textContent = config.message.custom;
};