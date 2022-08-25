import { useThemeColor } from 'components/Themed';
import { ColorName } from 'constants/Colors';
import { ActivityIndicator, ViewStyle } from 'react-native';
import { TransparentPaddedView, WhiteContainerView } from './ViewComponents';

export type SpinnerProps = {
  spinnerColor?: ColorName,
  style?: ViewStyle
}
export function PaddedSpinner( { spinnerColor = 'primary', style = {} }: SpinnerProps ) {
  return (
    <TransparentPaddedView style={style}>
      <ActivityIndicator color={useThemeColor({}, spinnerColor)} size='large' />
    </TransparentPaddedView>
  );
}

export function FullPageSpinner( { spinnerColor = 'primary', style = {} }: SpinnerProps ) {
  return (
    <WhiteContainerView style={style}>
      <ActivityIndicator color={useThemeColor({}, spinnerColor)} size='large' />
    </WhiteContainerView>
  );
}
