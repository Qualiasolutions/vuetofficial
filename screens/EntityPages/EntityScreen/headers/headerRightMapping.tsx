import { TransparentView } from 'components/molecules/ViewComponents';
import { useThemeColor } from 'components/Themed';
import { Image, Pressable, StyleSheet } from 'react-native';

const EditPressable: React.ElementType = ({ route, navigation }) => {
  const backgroundColor = useThemeColor({}, 'lightPrimary');
  return (
    <TransparentView style={styles.wrapper}>
      <Pressable
        onPress={() =>
          navigation.navigate('EditEntity', { entityId: route.params.entityId })
        }
        style={[styles.pressable, { backgroundColor }]}
      >
        <Image
          source={require('assets/images/edit.png')}
          style={styles.editImage}
        />
      </Pressable>
    </TransparentView>
  );
};

export const headerRightMapping = {
  default: EditPressable
} as { [key: string]: React.ElementType | undefined };

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center'
  },
  editImage: {
    height: 27,
    width: 31
  },
  pressable: {
    padding: 10,
    borderRadius: 10,
    flex: 0,
    width: 'auto'
  }
});
