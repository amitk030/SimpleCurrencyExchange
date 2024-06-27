import React from 'react';
import {Linking, StyleSheet} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {shareApp, themes} from '../utils';

const theme = themes.defaultTheme;

const CustomDrawerContent = props => {
  const items = [
    {
      icon: 'share-social-outline',
      text: 'Share',
      action: 'share',
    },
    {
      icon: 'hand-left-outline',
      text: 'Support',
      action: 'support',
      linking:
        'mailto:am.kumar1293@gmail.com?subject=Reporting any problem faced',
    },
    {
      icon: 'construct-outline',
      text: 'Feedback',
      action: 'feedback',
      linking:
        'mailto:am.kumar1293@gmail.com?subject=Suggestions for improvements',
    },
  ];

  const onPress = item => {
    console.log(item, 'item');
    switch (item.action) {
      case 'share':
        return shareApp();
      case 'support':
        return Linking.openURL(item.linking);
      case 'feedback':
        return Linking.openURL(item.linking);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label=""
        icon={() => (
          <Icon name="grid-outline" color={theme.textColor} size={20}>
            {' '}
            Menu Options
          </Icon>
        )}
        style={styles.menu}
      />
      {items.map((item, index) => (
        <DrawerItem
          key={index}
          label=""
          icon={() => (
            <Icon
              name={item.icon}
              color={theme.textColor}
              size={20}
              onPress={() => onPress(item)}>
              {` ${item.text}`}
            </Icon>
          )}
        />
      ))}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  menu: {borderBottomWidth: 1, borderBottomColor: theme.textColor},
});

export default CustomDrawerContent;
