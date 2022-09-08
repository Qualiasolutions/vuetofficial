import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor, View } from 'components/Themed';
import { ImageBackground, StyleSheet } from 'react-native';

export const headerBackgroundMapping = {} as { [key: string]: React.ElementType | undefined };

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  }
});
