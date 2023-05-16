import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditAccountDetailsScreen from "screens/EditAccountDetailsScreen";
import { EditAccountTypeScreen } from "screens/EditAccountTypeScreen";
import { EditPhoneNumberScreen } from "screens/EditPhoneNumberScreen";
import EditSecurityScreen from "screens/EditSecurityScreen";
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
      <MyAccountStack.Screen
        name="EditAccountDetails"
        component={EditAccountDetailsScreen}
      />
      <MyAccountStack.Screen
        name="EditSecurity"
        component={EditSecurityScreen}
      />
    </MyAccountStack.Navigator>
  )
}
