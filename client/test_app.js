const Store = require('electron-store');
const store = new Store();
store.set('stocks', [{ key: 'test', symbol: 'sz000333', name: '美的集团', visible: true }]);
console.log(store.get('stocks'));
