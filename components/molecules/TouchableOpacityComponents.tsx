import { type ElementConfig, type ComponentType } from 'react';
import { TouchableOpacity as DefaultTouchableOpacity } from 'react-native';


type TouchableOpacityProps = DefaultTouchableOpacity["props"]


export function TouchableOpacity (props: TouchableOpacityProps) {
  return <DefaultTouchableOpacity {...props}/>
}