import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Text,
} from 'react-native';
import {currencySymbols, latestCurrencyRates} from '../CurrencyAPI';
import CurrencyPicker from './CurrencyPicker';
import Font from 'react-native-vector-icons/Ionicons';
import {themes} from '../utils';
import {getData, storeData} from '../AsyncStorage';
import Ads from '../Ads';
// import NetInfo from '@react-native-community/netinfo';

const theme = themes.defaultTheme;

// const getNetInfo = NetInfo.addEventListener(state => {
//   console.log("Connection type", state.type)
//   console.log("is Connected", state.isConnected)
// });

// getNetInfo();
const Home = () => {
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const syms = await currencySymbols();
      const primary = await getData('primaryCurrency');
      const rates = await latestCurrencyRates(primary || 'USD');
      setSymbols(syms);
      setLatestRates(rates);
      setCodes(Object.keys(syms));
      setPrimaryCurrency(primary || 'USD');
      setLoading(false);
    }
    fetchSymbols();
  }, []);

  const handlePrimaryCurrencyChange = async value => {
    setPrimaryCurrency(value);
    const rates = await latestCurrencyRates(value);
    const quantity =
      primaryCurrencyQuantity * rates.conversion_rates[secondaryCurrency];
    setSecondaryCurrencyQuantity(quantity.toFixed(5).toString());
    setLatestRates(rates);
    storeData('primaryCurrency', value);
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
    const rates = latestRates.conversion_rates;
    const quantity = primaryCurrencyQuantity * rates[value];
    setSecondaryCurrencyQuantity(quantity.toFixed(5).toString());
  };

  const conversion = (value, choice) => {
    const rates = latestRates.conversion_rates;
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
    const secondaryQuantity =
      primaryCurrencyQuantity * rates.conversion_rates[secondary];
    setSecondaryCurrencyQuantity(secondaryQuantity.toFixed(5).toString());
    setLatestRates(rates);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size={Dimensions.get('window').height / 6}
          color={theme.backgroundColor}
        />
      ) : (
        <>
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
            cursorColor={theme.backgroundColor}
          />
          <View style={styles.switch}>
            <Pressable style={styles.button} onPress={onSwitchPress}>
              <Font
                name="swap-vertical-outline"
                color={'white'}
                size={Dimensions.get('window').height / 20}
              />
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
            cursorColor={theme.backgroundColor}
          />
          {/* <Pressable style={styles.conversionButton} onPress={onSwitchPress}>
            <Text style={styles.conversionButtonText}>
              {'ALL CURRENCIES  '}
            </Text>
            <Font
              name="arrow-forward-outline"
              color={'white'}
              size={Dimensions.get('window').height / 20}
            />
            <Font
              name="swap-vertical-outline"
              color={'white'}
              size={Dimensions.get('window').height / 20}
            />
          </Pressable> */}
        </>
      )}
      <Ads />
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
    height: Dimensions.get('window').height / 15,
    width: Dimensions.get('window').width - 30,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    fontSize: Dimensions.get('window').height / 30,
    marginBottom: 20,
    fontFamily: 'monospace',
    color: theme.backgroundColor,
    borderColor: theme.backgroundColor,
  },
  picker: {
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').height / 15,
  },
  switch: {
    alignItems: 'center',
    fontSize: Dimensions.get('window').height / 15,
    marginBottom: 20,
  },
  button: {
    width: Dimensions.get('window').width - 250,
    backgroundColor: theme.backgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 15,
    borderRadius: 5,
  },
  conversionButton: {
    width: Dimensions.get('window').width - 100,
    backgroundColor: theme.backgroundColor,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 15,
    borderRadius: 5,
    marginTop: 10,
  },
  conversionButtonText: {
    color: 'white',
    fontSize: Dimensions.get('window').height / 34,
  },
});

export default Home;
