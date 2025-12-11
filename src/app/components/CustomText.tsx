import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

const CustomText: React.FC<TextProps> = (props) => {
  const { style, ...otherProps } = props;
  
  return (
    <RNText
      {...otherProps}
      style={[styles.defaultFont, style]}
    />
  );
};

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Roboto-Regular',
  },
});

export default CustomText;
