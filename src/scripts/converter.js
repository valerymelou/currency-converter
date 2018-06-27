/**
 * Handle the communication with the currencies API.
 */
export class Converter {
  constructor(apiUrl) {
    this._apiUrl = apiUrl;
    this._exchangeRates = new Map();
  }

  /**
   * Returns a promises that resolves into a list of all available currencies.
   *
   * @return {Promise}
   */
  getCurrencies() {
    return fetch(`${this._apiUrl}/currencies`).then(response => {
      if (response.ok) {
        return response.json();
      }

      throw new Error('An error occurred while performing your request. Please try again later.');
    }).catch(error => {
      console.log('There has been a problem with your fetch operation: ', error.message);
    })
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
      if (response.ok) {
        return response.json();
      }

      throw new Error('An error occurred while performing your request. Please try again later.');
    }).then(data => {
      this._exchangeRates.set(key, data.results[key]);
      return data.results[key];
    }).catch(error => {
      console.log('There has been a problem with your fetch operation: ', error.message);
    });
  }
}
