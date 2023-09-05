import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  Pressable,
} from 'react-native';
import {currencySymbols, latestCurrencyRates} from '../CurrencyAPI';
import CurrencyPicker from './CurrencyPicker';
import Font from 'react-native-vector-icons/Ionicons';
import {themes} from '../utils';

const theme = themes.defaultTheme;

const Home = () => {
  const [symbols, setSymbols] = useState([]);
  const [codes, setCodes] = useState([]);
  const [primaryCurrency, setPrimaryCurrency] = useState('USD');
  const [primaryCurrencyQuantity, setPrimaryCurrencyQuantity] = useState('');
  const [secondaryCurrency, setSecondaryCurrency] = useState('INR');
  const [secondaryCurrencyQuantity, setSecondaryCurrencyQuantity] =
    useState('');
  const [latestRates, setLatestRates] = useState({});

  useEffect(() => {
    async function fetchSymbols() {
      const syms = await currencySymbols();
      const rates = await latestCurrencyRates();
      setSymbols(syms);
      setLatestRates(rates);
      setCodes(Object.keys(syms));
    }
    fetchSymbols();
  }, []);

  const handlePrimaryCurrencyChange = async value => {
    setPrimaryCurrency(value);
    console.log(secondaryCurrency, 'secondary currency');
    const rates = await latestCurrencyRates(value);
    const quantity = primaryCurrencyQuantity * rates.rates[secondaryCurrency];
    // console.log(value, 'value');
    // console.log(quantity, 'quantity');
    setSecondaryCurrencyQuantity(quantity.toFixed(5).toString());
    setLatestRates(rates);
  };

  //This code can be used for offline support
  // const handlePrimaryChange = value => {
  //   setPrimaryCurrency(value);
  //   handlePrimaryCurrencyChange(value);
  //   const rates = latestRates.rates;
  //   const currencyValueInUSD = (1 / rates[value]) * primaryCurrencyQuantity;
  //   // console.log(currencyValueInUSD, 'currency value in USD');
  //   const secondaryCurrencyQun = rates[secondaryCurrency] * currencyValueInUSD;
  //   setSecondaryCurrencyQuantity(secondaryCurrencyQun.toFixed(5).toString());
  // };

  const handleSecondaryCurrencyChange = async value => {
    setSecondaryCurrency(value);
    const rates = latestRates.rates;
    const quantity = primaryCurrencyQuantity * rates[value];
    setSecondaryCurrencyQuantity(quantity.toFixed(5).toString());
  };

  const conversion = (value, choice) => {
    const rates = latestRates.rates;
    let quantity;
    if (choice === 'primary') {
      setPrimaryCurrencyQuantity(value);
      quantity = value * rates[secondaryCurrency];
      setSecondaryCurrencyQuantity(quantity.toFixed(5).toString());
    } else {
      setSecondaryCurrencyQuantity(value);
      quantity = value * (1 / rates[secondaryCurrency].toFixed(5));
      setPrimaryCurrencyQuantity(quantity.toFixed(5).toString());
    }
  };

  const onSwitchPress = async () => {
    const primary = secondaryCurrency;
    const secondary = primaryCurrency;
    setSecondaryCurrency(secondary);
    const rates = await latestCurrencyRates(primary);
    setPrimaryCurrency(primary);
    const secondaryQuantity = primaryCurrencyQuantity * rates.rates[secondary];
    setSecondaryCurrencyQuantity(secondaryQuantity.toFixed(5).toString());
    setLatestRates(rates);
  };

  return (
    <View style={styles.container}>
      <CurrencyPicker
        prompt="Select Primary Currency"
        customStyles={styles.picker}
        dropdownIconColor="white"
        selectedItem={primaryCurrency}
        items={codes}
        onValueChange={value => handlePrimaryCurrencyChange(value)}
        // customItemStyle={styles.pickerItem}
        symbols={symbols}
      />
      <TextInput
        style={styles.input}
        onChangeText={value => conversion(value, 'primary')}
        value={primaryCurrencyQuantity}
        placeholder="Enter Amount"
        inputMode="decimal"
      />
      <View style={styles.switch}>
        <Pressable style={styles.button} onPress={onSwitchPress}>
          <Font name="swap-vertical-outline" color={'white'} size={20}></Font>
        </Pressable>
      </View>
      <CurrencyPicker
        prompt="Select Secondary Currency"
        customStyles={styles.picker}
        dropdownIconColor="white"
        selectedItem={secondaryCurrency}
        items={codes}
        onValueChange={value => handleSecondaryCurrencyChange(value)}
        customItemStyle={styles.pickerItem}
        symbols={symbols}
      />
      <TextInput
        style={styles.input}
        onChangeText={value => conversion(value, 'secondary')}
        value={secondaryCurrencyQuantity}
        placeholder="Enter Amount"
        inputMode="decimal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: theme.pageBackgroundColor,
  },
  input: {
    height: 50,
    width: Dimensions.get('window').width - 30,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    fontSize: 25,
    marginBottom: 20,
    fontFamily: 'monospace',
    color: theme.backgroundColor,
    borderColor: theme.backgroundColor,
  },
  picker: {
    width: Dimensions.get('window').width - 30,
  },
  switch: {
    alignItems: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    width: Dimensions.get('window').width - 200,
    backgroundColor: theme.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 5,
  },
});

export default Home;
