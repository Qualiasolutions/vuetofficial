import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Calendar from 'components/calendars/Calendar';
import SquareButton from 'components/molecules/SquareButton';
import { Text, View } from 'components/Themed';
import { ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectEntityById } from 'reduxStore/slices/entities/selectors';
import { selectTasksByEntityId } from 'reduxStore/slices/tasks/selectors';
import { RootTabParamList } from 'types/base';

export const EntityScreen = ({
  navigation,
  route
}: NativeStackScreenProps<RootTabParamList, 'EntityScreen'>) => {
  const entity = useSelector(selectEntityById(parseInt(route.params.entityId)))
  const tasks = useSelector(selectTasksByEntityId(parseInt(route.params.entityId)))
  
  console.log(entity)
  console.log(tasks)

  return (<View style={styles.container}>
    <View style={styles.entityHeader}>
      <Text style={styles.entityTitle}>{entity.name}</Text>
      <SquareButton fontAwesomeIconName='pencil' onPress={() => {navigation.navigate('EditEntity', { entityId: entity.id })}}/>
    </View>
    <View style={styles.calendarContainer}>
      <Calendar tasks={tasks}/>
    </View>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  entityHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  entityTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  calendarContainer: {
    height: '50%',
  }
})