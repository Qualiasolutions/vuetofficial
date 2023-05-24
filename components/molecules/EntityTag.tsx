import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useThemeColor } from "components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { EntityTabParamList, RootTabParamList, SettingsTabParamList } from "types/base";
import { EntityResponseType } from "types/entities";
import { BlackText } from "./TextComponents";

export default function EntityTag({ entity }: { entity: EntityResponseType }) {
  const navigation = useNavigation<
    | BottomTabNavigationProp<RootTabParamList>
    | StackNavigationProp<EntityTabParamList>
    | StackNavigationProp<SettingsTabParamList>
  >();
  const greyColor = useThemeColor({}, 'grey');

  return <Pressable
    onPress={() => {
      (navigation.navigate as any)('EntityNavigator', {
        screen: 'EntityScreen',
        initial: false,
        params: { entityId: entity.id }
      })
    }}
  >
    <BlackText text={entity.name} style={[styles.tag, { backgroundColor: greyColor }]} />
  </Pressable>
}


const styles = StyleSheet.create({
  tag: {
    fontSize: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    height: 16,
    marginRight: 2
  }
})