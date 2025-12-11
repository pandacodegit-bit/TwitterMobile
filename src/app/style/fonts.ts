export const fonts = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  semiBold: 'Roboto-SemiBold',
  bold: 'Roboto-Bold',
  light: 'Roboto-Light',
  thin: 'Roboto-Thin',
  black: 'Roboto-Black',
};

export const getFontFamily = (weight?: '300' | '400' | '500' | '600' | '700' | '800' | '900') => {
  switch (weight) {
    case '300':
      return fonts.light;
    case '400':
      return fonts.regular;
    case '500':
      return fonts.medium;
    case '600':
      return fonts.semiBold;
    case '700':
      return fonts.bold;
    case '800':
    case '900':
      return fonts.black;
    default:
      return fonts.regular;
  }
};
