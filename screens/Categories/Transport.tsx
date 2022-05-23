import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from 'components/Themed';
import { useSelector } from 'react-redux';

import { selectAllEntities } from 'reduxStore/slices/entities/selectors';
import {
  EntityResponseType,
  CarResponseType,
  CarParsedType
} from 'types/entities';
import { getDateStringFromDateObject } from 'utils/datesAndTimes';
import { FontAwesome } from '@expo/vector-icons';
import { RootTabScreenProps } from 'types/base';

const parseCarResponse = (res: CarResponseType): CarParsedType => {
  return {
    ...res,
    MOT_due_date: res.MOT_due_date ? new Date(res.MOT_due_date) : null,
    insurance_due_date: res.insurance_due_date
      ? new Date(res.insurance_due_date)
      : null,
    service_due_date: res.service_due_date
      ? new Date(res.service_due_date)
      : null
  };
};

const dueDateField = (name: string, date: Date | null) =>
  date ? (
    <View style={styles.dueDateField}>
      <Text>{name}</Text>
      <Text>{getDateStringFromDateObject(date)}</Text>
    </View>
  ) : null;

type TransportScreenProps = RootTabScreenProps<'Transport'>

export default function Transport({ navigation }: TransportScreenProps) {
  const allEntities = useSelector(selectAllEntities);
  const flatEntities = Object.values(allEntities.byId);
  const allCars: CarParsedType[] = flatEntities
    .filter((entity: EntityResponseType) => entity.resourcetype == 'Car')
    .map((car) => parseCarResponse(car));
  const carList = allCars.map((car: CarParsedType) => (
    <View key={car.id} style={styles.entityListing}>
      <View style={styles.entityData}>
        <View style={styles.entityTopData}>
          <Text style={[styles.entityName, styles.entityTopText]}>
            {car.name}
          </Text>
          <Text style={styles.entityTopText}>{car.registration}</Text>
        </View>
        {dueDateField('MOT', car.MOT_due_date)}
        {dueDateField('Insurance', car.insurance_due_date)}
        {dueDateField('Service', car.service_due_date)}
      </View>
      <View style={styles.listingBottom}>
        <TouchableOpacity
          style={styles.squareButton}
          onPress={() => {
            navigation.navigate('EntityScreen', { entityId: car.id });
          }}
        >
          <FontAwesome name="eye" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  ));
  return (
    <ScrollView style={styles.container}>
      {carList}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.squareButton}
          onPress={() => {
            navigation.navigate('AddEntity', { entityType: 'Car' });
          }}
        >
          <FontAwesome name="plus" size={30} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  entityListing: {
    paddingVertical: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#efefef'
  },
  entityData: {
    maxWidth: 200
  },
  listingBottom: {
    alignItems: 'flex-end'
  },
  entityTopData: {
    marginBottom: 10
  },
  entityTopText: {
    fontSize: 18
  },
  entityName: {
    fontWeight: 'bold'
  },
  dueDateField: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3
  },
  squareButton: {
    backgroundColor: '#cccccc',
    padding: 5,
    borderRadius: 5
  },
  bottomButtons: {
    alignItems: 'flex-end',
    paddingTop: 20
  }
});
