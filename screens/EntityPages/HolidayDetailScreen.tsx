import ListLinkWithCheckbox from 'components/molecules/ListLinkWithCheckbox';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import React, { useCallback, useEffect, useState } from 'react';
import { useGetHolidaysQuery } from 'reduxStore/services/api/holidays';
import { Holiday } from 'reduxStore/services/api/types';
import { WhiteView } from 'components/molecules/ViewComponents';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import useGetUserDetails from 'hooks/useGetUserDetails';
import {
  useGetAllEntitiesQuery,
  useBulkCreateEntitiesMutation,
  useBulkDeleteEntitiesMutation
} from 'reduxStore/services/api/entities';
import { HolidayResponseType } from 'types/entities';
import { FullPageSpinner } from 'components/molecules/Spinners';

export default function HolidayDetailScreen({
  navigation,
  route
}: NativeStackScreenProps<EntityTabParamList, 'HolidayDetail'>) {
  const { countrycodes } = route?.params;
  let params = '';

  if (typeof countrycodes === 'string') {
    for (const code of (countrycodes as string).split(',')) {
      params = `${params}country_codes=${code}&`;
    }
  } else {
    for (const code of countrycodes) {
      params = `${params}country_codes=${code}&`;
    }
  }

  const { data: userDetails } = useGetUserDetails();
  const { data: allEntities } = useGetAllEntitiesQuery(
    userDetails?.id || -1,
    {
      skip: !userDetails?.id
    }
  );

  const previouslySelectedHolidays = (allEntities && Object.values(allEntities.byId).filter(ent => ent.resourcetype === 'Holiday')) as (HolidayResponseType[] | undefined)

  // TODO - do we want to allow settings holidays for other years too?
  const [selectedHolidays, setSelectedHolidays] = useState<Omit<HolidayResponseType, 'id'>[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [createEntities, createEntitiesResult] = useBulkCreateEntitiesMutation();
  const [deleteEntities, deleteEntitiesResult] = useBulkDeleteEntitiesMutation();
  const {
    data: holidays,
    isError,
    error
  } = useGetHolidaysQuery(`${params}years=${new Date().getFullYear()}`);

  useEffect(() => {
    if (
      previouslySelectedHolidays &&
      previouslySelectedHolidays.length > 0 &&
      holidays
    ) {
      setSelectedHolidays(
        Object.values(holidays)
          .flat()
          .filter((hol) =>
            previouslySelectedHolidays.map(holiday => holiday.string_id).includes(hol.id)
          )
          .map(hol => ({
            ...hol,
            string_id: hol.id
          }))
      );
    }
  }, [allEntities, holidays]);

  const onPress = useCallback(
    (holiday: Holiday, selected: boolean) => {
      if (selected) {
        setSelectedHolidays(
          selectedHolidays.filter((hol) => hol.string_id != holiday.id)
        );
      } else {
        setSelectedHolidays([
          ...selectedHolidays,
          {
            ...holiday,
            string_id: holiday.id,
          }
        ]);
      }
    },
    [setSelectedHolidays, selectedHolidays]
  );

  useEffect(() => {
    const save = async () => {
      if (previouslySelectedHolidays) {
        setIsSaving(true)
        const holidaysToDelete = previouslySelectedHolidays
          ?.filter(entity => !selectedHolidays.map(ent => ent.string_id).includes(entity.string_id))
        const holidaysToCreate = selectedHolidays
          ?.filter(entity => !previouslySelectedHolidays.map(ent => ent.string_id).includes(entity.string_id))
          ?.map(entity => ({ ...entity, resourcetype: 'Holiday' }))
  
        if (holidaysToDelete.length > 0) {
          await deleteEntities(holidaysToDelete);
        }

        // Nasty hack to ensure that the second cache update completes
        // before navigating to the next page
        setTimeout(async () => {
          if (holidaysToCreate.length > 0) {
            await createEntities(holidaysToCreate);
          }
  
          setTimeout(() => {
            setIsSaving(false)
            navigation.navigate('EntityList', {
              entityTypes: [ 'Holiday' ],
              entityTypeName: 'holidays',
              showCreateForm: false
            })
          }, 1000)
        }, 1000)
      }
    };

    navigation.setOptions({
      headerRight: () => <AlmostBlackText text="save" onPress={save} />
    });
  }, [selectedHolidays, previouslySelectedHolidays]);

  if (isSaving || !holidays) return <FullPageSpinner/>;

  return (
    <WhiteView style={{ flex: 1 }}>
      <WhiteFullPageScrollView>
        {Object.values(holidays)
          .flat()
          .map((holiday: Holiday) => {
            return (
              <ListLinkWithCheckbox
                key={holiday.id}
                text={holiday.name}
                subText={`${holiday.start_date}${holiday.end_date !== holiday.start_date ? ` to ${holiday.end_date}` : ''}`}
                showArrow={false}
                onSelect={async (selected) => onPress(holiday, selected)}
                navMethod={undefined}
                selected={selectedHolidays.some((cou) => cou.id == holiday.id)}
                disabled={true}
              />
            );
          })}
      </WhiteFullPageScrollView>
    </WhiteView>
  );
}
