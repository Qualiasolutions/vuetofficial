import { useLayoutEffect } from 'react';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { headerWithBackgroundColor } from 'headers/utils/headerMappings';

export default function useColouredHeader(
  backgroundColor: string,
  tintColor: string,
  title: string
) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    const options: Partial<NativeStackNavigationOptions> = {
      title,
      headerTintColor: tintColor,
      headerShown: true,
      header: headerWithBackgroundColor(backgroundColor)
    };
    navigation.setOptions(options);
  }, [backgroundColor, tintColor, title]);
}
