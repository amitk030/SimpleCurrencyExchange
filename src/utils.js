import {Share, Alert} from 'react-native';

export const shareApp = async () => {
  try {
    const result = await Share.share({
      message:
        'Currency conversion made easy with our Simple Currency Converter!, AppLink: https://play.google.com/store/apps/details?id=com.simplecurrencyexchange',
      url: 'https://play.google.com/store/apps/details?id=com.simplecurrencyexchange',
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export const themes = {
  defaultTheme: {
    textColor: '#ffffff',
    backgroundColor: '#18392b',
    pageBackgroundColor: '#49a078',
  },
};
