import { createNativeStackNavigator, NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useThemeColor } from "components/Themed";
import EditAccountDetailsScreen from "screens/EditAccountDetailsScreen";
import { EditAccountTypeScreen } from "screens/EditAccountTypeScreen";
import { EditPhoneNumberScreen } from "screens/EditPhoneNumberScreen";
import EditSecurityScreen from "screens/EditSecurityScreen";
import MyAccountScreen from "screens/MyAccountScreen";
import { MyAccountTabParamList } from "types/base";
import { headerWithBackgroundColor } from 'headers/utils/headerMappings';
import { HeaderBackButton } from '@react-navigation/elements';
import { TransparentPaddedView, TransparentView } from "components/molecules/ViewComponents";

const MyAccountStack = createNativeStackNavigator<MyAccountTabParamList>();

const MyAccountHeader = (props: NativeStackHeaderProps) => {
  const navigationState = props.navigation.getState()
  if (navigationState.index === 0) {
    return null
  }

  return <TransparentView style={{ height: 30, padding: 0, paddingLeft: 20, marginBottom: 10 }}>
    <HeaderBackButton
      tintColor={props.options.headerTintColor}
      onPress={props.navigation.goBack}
    />
  </TransparentView>
}

export function MyAccountNavigator() {
  const primaryColor = useThemeColor({}, "primary")
  return (
    <MyAccountStack.Navigator
      initialRouteName="MyAccount"
      screenOptions={{
        headerShown: true,
        headerTintColor: primaryColor,
        header: MyAccountHeader,
      }}
    >
      <MyAccountStack.Screen
        name="MyAccount"
        component={MyAccountScreen}
        options={{ title: "", headerShown: false }}
      />
      <MyAccountStack.Screen
        name="EditPhoneNumber"
        component={EditPhoneNumberScreen}
        options={{ title: "" }}
      />
      <MyAccountStack.Screen
        name="EditAccountType"
        component={EditAccountTypeScreen}
        options={{ title: "" }}
      />
      <MyAccountStack.Screen
        name="EditAccountDetails"
        component={EditAccountDetailsScreen}
        options={{ title: "" }}
      />
      <MyAccountStack.Screen
        name="EditSecurity"
        component={EditSecurityScreen}
        options={{ title: "" }}
      />
    </MyAccountStack.Navigator>
  )
}
