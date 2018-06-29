import idb from 'idb';

/**
 * Opens the indexed database.
 */
function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('currency-converter-db', 1, (upgradeDb) => {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('currencies');
        upgradeDb.createObjectStore('exchange-rates');
    }
  });
}

/**
 * Handle the communication with the currencies API.
 */
export class CurrencyService {
  constructor(apiUrl) {
    this._apiUrl = apiUrl;
    this._exchangeRates = new Map();
    this._dbPromise = openDatabase();
  }

  /**
   * Returns a promises that resolves into a list of all available currencies.
   *
   * @return {Promise}
   */
  getCurrencies() {
    return fetch(`${this._apiUrl}/currencies`).then(response => {
      return response.json();
    });
  }

  /**
   * Returns a Promise that resolves into the current exchange rate between from and to
   * currencies.
   *
   * @param {String} from
   * @param {String} to
   *
   * @return {Promise}
   */
  getExchangeRate(from, to) {
    const key = `${from}_${to}`;

    if (this._exchangeRates.has(key)) {
      return Promise.resolve(this._exchangeRates.get(key));
    }

    // If we reach this step, then we have to hit the network to get the exchange rate.
    return fetch(`${this._apiUrl}/convert?q=${key}`).then(response => {
      return response.json();
    }).then(data => {
      this._exchangeRates.set(key, data.results[key]);
      return data.results[key];
    });
  }

  /**
   * Saves the given currencies into the indexed database for offline use.
   *
   * @param {Array} currencies
   */
  saveCurrencies(currencies) {
    return this._dbPromise.then(db => {
      const transaction = db.transaction('currencies', 'readwrite');
      const store = transaction.objectStore('currencies');

      store.put(currencies, 'currencies');
    });
  }

  /**
   * Saves the given exchange rate into the indexed database for offline use.
   *
   * @param {Object} exchangeRate
   */
  saveExchangeRate(exchangeRate) {
    return this._dbPromise.then(db => {
      const transaction = db.transaction('exchange-rates', 'readwrite');
      const store = transaction.objectStore('exchange-rates');

      store.put(exchangeRate, exchangeRate.id);
    });
  }

  /**
   * Returns the list of currencies saved in the indexed database.
   *
   * @return {Promise<Array>}
   */
  getCurrenciesFromDb() {
    return this._dbPromise.then(db => {
      const transaction = db.transaction('currencies');
      const store = transaction.objectStore('currencies');

      return store.get('currencies');
    });
  }

  /**
   * Returns the exchange rate with the given key in the indexed database.
   *
   * @param {String} key
   *
   * @return {Promise<Object>}
   */
  getExchangeRateFromDb(key) {
    return this._dbPromise.then(db => {
      const transaction = db.transaction('exchange-rates');
      const store = transaction.objectStore('exchange-rates');

      return store.get(key);
    });
  }
}
