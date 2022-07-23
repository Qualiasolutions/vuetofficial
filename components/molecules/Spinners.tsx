import { useThemeColor } from 'components/Themed';
import { ActivityIndicator } from 'react-native';
import { WhiteContainerView } from './ViewComponents';

export function FullPageSpinner() {
  return (
    <WhiteContainerView>
      <ActivityIndicator color={useThemeColor({}, 'primary')} />
    </WhiteContainerView>
  );
}
