import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { TransparentView } from 'components/molecules/ViewComponents';

export default function BackOnlyHeader(props: NativeStackHeaderProps) {
  const navigationState = props.navigation.getState();
  if (navigationState.index === 0) {
    return null;
  }

  return (
    <TransparentView
      style={{ height: 30, padding: 0, paddingLeft: 20, marginBottom: 30 }}
    >
      <HeaderBackButton
        tintColor={props.options.headerTintColor}
        onPress={props.navigation.goBack}
      />
    </TransparentView>
  );
}
