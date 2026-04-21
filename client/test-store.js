const Store = require('electron-store');
const store = new Store();
console.log('stocks:', store.get('stocks'));
