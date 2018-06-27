import { Converter } from './converter';

const API_URL = 'https://free.currencyconverterapi.com/api/v5';
const converter = new Converter(API_URL);


/**
 * Calls the given function when the DOM is loaded.
 *
 * @param {Function} fn
 */
const ready = function(fn) {
  if (typeof fn !== 'function') return;

  // If document is already loaded, run method.
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    return fn();
  }

  // Otherwise, wait until document is loaded.
  document.addEventListener('DOMContentLoaded', fn, false);
}


/**
 * Returns the first element matching the selector or a dummy element.
 *
 * @param {String} selector
 * @return {HTMLElement}
 */
const getElement = function(selector) {
  return document.querySelector(selector) || document.createElement('_');
}


/**
 * Populates select options with the list of currencies.
 *
 * @param {Array} currencies
 */
const populateOptions = function(currencies) {
  const selects = document.querySelectorAll('.form-Select');
  let selected;

  selects.forEach((select, index) => {
    for (let currency of currencies) {
      // Preselect the XAF and the USD, XAF is the currency used in my Country ;-).
      // I might detect the preselected currencies based on the user's browser.
      // But that's a task for another day.
      if ((index === 1 && currency.id === 'XAF') || (index === 0 && currency.id === 'USD')) {
        selected = true;
      } else {
        selected = false;
      }

      select.options[select.options.length] = new Option(currency.currencyName, currency.id, false, selected);
    }
  });
}


/**
 * Returns a Promise that resolves in the value of the given amount converted
 * from the `fromCurrency` to the `toCurrency`.
 *
 * @param {Number} fromCurrency
 * @param {Number} toCurrency
 * @param {Number} amount
 *
 * @return {Promise}
 */
const convert = function(fromCurrency, toCurrency, amount) {
  return converter.getExchangeRate(fromCurrency, toCurrency).then(exchangeRate => {
    return amount * exchangeRate.val;
  });
}


/**
 * Entry point of our program. To be launched when the DOM is loaded.
 */
const main = function() {
  const selectFrom = getElement('.form-Select-from');
  const selectTo = getElement('.form-Select-to');
  const inputFrom = getElement('.form-Control-from');
  const inputTo = getElement('.form-Control-to');
  const swapButtons = document.querySelectorAll('.btn-SwapButton');

  selectFrom.addEventListener('change', () => {
    convert(selectFrom.value, selectTo.value, inputFrom.value).then(result => {
      inputTo.value = result;
    });
  });

  selectTo.addEventListener('change', () => {
    convert(selectFrom.value, selectTo.value, inputFrom.value).then(result => {
      inputTo.value = result;
    });
  });

  inputFrom.addEventListener('input', () => {
    convert(selectFrom.value, selectTo.value, inputFrom.value).then(result => {
      inputTo.value = result;
    });
  });

  inputTo.addEventListener('input', () => {
    convert(selectTo.value, selectFrom.value, inputTo.value).then(result => {
      inputFrom.value = result;
    });
  });

  swapButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const newFromCurrency = selectTo.value;
      const newToCurrency = selectFrom.value;

      button.blur();

      selectFrom.value = newFromCurrency;
      selectTo.value = newToCurrency;
      convert(selectFrom.value, selectTo.value, inputFrom.value).then(result => {
        inputTo.value = result;
      });
    });
  });

  converter.getCurrencies().then(data => {
    populateOptions(Object.values(data.results));
    convert(selectFrom.value, selectTo.value, inputFrom.value).then(result => {
      inputTo.value = result;
    });
  }).catch(error => {
    console.log(error);
  });
}


/**
 * Start the main function when the DOM is loaded.
 */
ready(main);
