import {getObject, storeObject} from './AsyncStorage';

const API_KEY = '55b6bbc5ebe2c1365212a9fa';

const API_HOST = `https://v6.exchangerate-api.com/v6/${API_KEY}/`;

export const currencySymbols = async () => {
  try {
    let symbols = {};
    let currencies = await fetch(`${API_HOST}/codes`);
    currencies = await currencies.json();
    if (currencies.supported_codes) {
      currencies.supported_codes.forEach(element => {
        symbols[element[0]] = {code: element[0], description: element[1]};
      });
    }
    await storeObject('symbols', symbols);
    return symbols;
  } catch (e) {
    console.log('unable to return currency symbols');
    return await getObject('symbols');
  }
};

export const latestCurrencyRates = async (base = 'USD') => {
  try {
    let rates = await fetch(`${API_HOST}/latest/${base}`);
    rates = await rates.json();
    await storeObject('rates', rates);
    return rates;
  } catch (e) {
    console.log('unable to fetch latest rates');
    return await getObject('rates');
  }
};
