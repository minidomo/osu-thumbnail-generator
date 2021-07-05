const loadData = () => {
    $.getJSON('../data.json', (data) => {
        document.getElementById('username0').textContent = data.players[0].username;
        document.getElementById('username1').textContent = data.players[1].username;
        document.getElementById('title').textContent = data.title;
        document.getElementById('round').textContent = data.round;
        document.getElementById('message-middle').textContent = data.message.middle;
        document.getElementById('message-custom').textContent = data.message.custom;
    });
};

const updateColor = () => {
    Vibrant.from('../assets/image4.png').getPalette((err, palette) => {
        if (err) {
            console.error(err);
            return;
        }
        const [r, g, b] = palette.Vibrant.getRgb();
        document.documentElement.style.setProperty('--main-color', `rgba(${r},${g},${b},1)`);
        document.documentElement.style.setProperty('--transparent-color', `rgba(${r},${g},${b},.4)`);
    });
};

window.onload = () => {
    loadData();
    updateColor();
};
