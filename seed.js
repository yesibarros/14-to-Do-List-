// node seed.js for run this
const { Item } = require('./models');

Item.bulkCreate([
    { title: 'Comprar Pan' },
    { title: 'Lavar al Perro' },
    { title: 'Sacar entradas para el Cine' },
]);
