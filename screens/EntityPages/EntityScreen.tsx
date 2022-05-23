import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from 'components/calendars/Calendar';
import SquareButton from 'components/molecules/SquareButton';
import { Text, View } from 'components/Themed';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { selectTasksByEntityId } from 'reduxStore/slices/tasks/selectors';
import { RootTabParamList } from 'types/base';

export const EntityScreen = ({
  navigation,
  route
}: NativeStackScreenProps<RootTabParamList, 'EntityScreen'>) => {
  if (!route.params?.entityId) {
    return null
  }

  const entity = useSelector(selectEntityById(parseInt(route.params.entityId)))
  if (!entity) {
    navigation.navigate('NotFound')
    return null
  }
  const tasks = useSelector(selectTasksByEntityId(parseInt(route.params.entityId)))
  
  console.log(entity)
  console.log(tasks)

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.entityHeader}>
          <Text style={styles.entityTitle}>{entity.name}</Text>
          <SquareButton
            fontAwesomeIconName='pencil'
            fontAwesomeIconSize={20}
            onPress={() => {navigation.navigate('EditEntity', { entityId: entity.id })}}
          />
        </View>
        <View style={styles.calendarContainer}>
          <Calendar tasks={tasks}/>
        </View>
        <View style={styles.addTaskWrapper}>
          <SquareButton fontAwesomeIconName='plus' onPress={() => navigation.navigate('AddTask')}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    height: '100%'
  },
  contentContainer: {
    padding: 10,
    height: '100%'
  },
  entityHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#efefef',
    borderBottomWidth: 2,
    paddingBottom: 10
  },
  entityTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 20
  },
  calendarContainer: {
    height: '80%',
    paddingBottom: 10,
    borderBottomColor: '#efefef',
    borderBottomWidth: 2
  },
  addTaskWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingRight: 20
  }
})