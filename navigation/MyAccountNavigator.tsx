import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EditAccountTypeScreen } from "screens/EditAccountTypeScreen";
import { EditPhoneNumberScreen } from "screens/EditPhoneNumberScreen";
import MyAccountScreen from "screens/MyAccountScreen";
import { MyAccountTabParamList } from "types/base";

const MyAccountStack = createNativeStackNavigator<MyAccountTabParamList>();

export function MyAccountNavigator() {
  return (
    <MyAccountStack.Navigator
      initialRouteName="MyAccount"
      screenOptions={{
        headerShown: false
      }}
    >
      <MyAccountStack.Screen
        name="MyAccount"
        component={MyAccountScreen}
      />
      <MyAccountStack.Screen
        name="EditPhoneNumber"
        component={EditPhoneNumberScreen}
      />
      <MyAccountStack.Screen
        name="EditAccountType"
        component={EditAccountTypeScreen}
      />
    </MyAccountStack.Navigator>
  )
}
