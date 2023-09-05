import {getObject, storeObject} from './AsyncStorage';

const API_HOST = 'https://api.exchangerate.host';

export const currencySymbols = async () => {
  try {
    let currencies = await fetch(`${API_HOST}/symbols`);
    currencies = await currencies.json();
    return currencies.symbols;
  } catch (e) {
    console.log('unable to return currency symbols');
    return null;
  }
};

export const latestCurrencyRates = async (base = 'USD') => {
  try {
    console.log(base, 'base currency');
    let rates = await fetch(`${API_HOST}/latest?base=${base}`);
    rates = await rates.json();
    await storeObject('rates', rates);
    return rates;
  } catch (e) {
    console.log('unable to fetch latest rates');
    return await getObject('rates');
  }
};
