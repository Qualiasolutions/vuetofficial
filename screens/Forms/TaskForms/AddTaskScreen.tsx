import { useThemeColor } from 'components/Themed';

import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import {
  TransparentView,
  WhitePaddedView,
  WhiteView
} from 'components/molecules/ViewComponents';
import { StyleSheet } from 'react-native';
import { FullPageSpinner } from 'components/molecules/Spinners';
import useGetUserDetails from 'hooks/useGetUserDetails';
import useColouredHeader from 'headers/hooks/useColouredHeader';
import dayjs from 'dayjs';
import { RootTabScreenProps } from 'types/base';
import AddDueDateForm from 'components/forms/AddDueDateForm';
import AddTaskForm from 'components/forms/AddTaskForm';
import AddTransportTaskForm from 'components/forms/AddTransportTaskForm';
import AddAccommodationTaskForm from 'components/forms/AddAccommodationTaskForm';
import AddAnniversaryForm from 'components/forms/AddAnniversaryForm';
import DropDown from 'components/forms/components/DropDown';
import { BlackText } from 'components/molecules/TextComponents';
import EntityAndTagSelector from 'components/forms/components/TagSelector';

const formTypes = [
  {
    value: 'TASK',
    label: 'Task'
  },
  {
    value: 'APPOINTMENT',
    label: 'Appointment'
  },
  {
    value: 'DUE_DATE',
    label: 'Due Date'
  },
  {
    value: 'ACTIVITY',
    label: 'Going Out'
  },
  {
    value: 'TRANSPORT',
    label: 'Getting There'
  },
  {
    value: 'ACCOMMODATION',
    label: 'Staying Overnight'
  },
  {
    value: 'ANNIVERSARY',
    label: 'Birthday / Anniversary'
  }
];

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hidden: {
    height: 0,
    overflow: 'hidden'
  },
  addNewLabel: {
    marginRight: 10
  },
  dropdownContainer: {
    flex: 1
  }
});

type AddTaskScreenProps = RootTabScreenProps<'AddTask'>;

export type FormType =
  | 'TASK'
  | 'APPOINTMENT'
  | 'DUE_DATE'
  | 'ACTIVITY'
  | 'TRANSPORT'
  | 'ACCOMMODATION'
  | 'ANNIVERSARY';

export default function AddTaskScreen({
  route,
  navigation
}: AddTaskScreenProps) {
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetails();
  const [tagsAndEntities, setTagsAndEntities] = useState<{
    tags: string[];
    entities: number[];
  }>({
    tags: [],
    entities: []
  });
  const [formType, setFormType] = useState<FormType | ''>(
    route.params?.type || ''
  );

  const headerBackgroundColor = useThemeColor({}, 'secondary');
  const headerTintColor = useThemeColor({}, 'white');
  const headerTitle = {
    '': 'Add task',
    TASK: 'Add task',
    APPOINTMENT: 'Add Appointment',
    ACTIVITY: 'Add Activity',
    DUE_DATE: 'Add Due Date',
    TRANSPORT: 'Add Transport',
    ACCOMMODATION: 'Add Accommodation',
    ANNIVERSARY: 'Add Birthday / Anniversary'
  }[formType];

  useColouredHeader(headerBackgroundColor, headerTintColor, headerTitle);

  useEffect(() => {
    setFormType(route.params?.type || '');
  }, [route]);

  const taskDefaults = useMemo(() => {
    const currentTime = new Date();
    const defaultStartTime = new Date(currentTime);
    defaultStartTime.setMinutes(0);
    defaultStartTime.setSeconds(0);
    defaultStartTime.setMilliseconds(0);
    defaultStartTime.setHours(defaultStartTime.getHours() + 1);

    const defaultEndTime = new Date(defaultStartTime);

    if (formType === 'TASK') {
      defaultEndTime.setMinutes(defaultStartTime.getMinutes() + 15);
    }
    if (formType === 'APPOINTMENT' || formType === 'ACTIVITY') {
      defaultEndTime.setHours(defaultStartTime.getHours() + 1);
    }

    const defaultDuration = 15;
    const defaultEarliestActionDate = dayjs(new Date()).format('YYYY-MM-DD');
    const dateNow = new Date();
    const defaultDueDate = dayjs(dateNow).format('YYYY-MM-DD');

    return {
      title: route.params?.title || '',
      start_datetime: defaultStartTime,
      end_datetime: defaultEndTime,
      date: defaultDueDate,
      duration: defaultDuration,
      recurrence: null,
      earliest_action_date: defaultEarliestActionDate,
      due_date: defaultDueDate,
      entities: route.params?.entities || [],
      members: route.params?.members || (userDetails ? [userDetails.id] : []),
      tags: route.params?.tags || []
    };
  }, [formType, route.params, userDetails]);

  const dueDateDefaults = useMemo(() => {
    const dateNow = new Date();
    const defaultDueDate =
      route.params?.date || dayjs(dateNow).format('YYYY-MM-DD');

    return {
      date: defaultDueDate,
      title: route.params?.title || '',
      duration: 15,
      entities: route.params?.entities || [],
      tags: route.params?.tags || []
    };
  }, [route.params]);

  if (!userDetails) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentFullPageScrollView>
      <TransparentView style={styles.container}>
        <TransparentView>
          {/* <WhitePaddedView>
            <EntityAndTagSelector
              value={tagsAndEntities}
              onChange={(newTagsAndEntities) => {
                setTagsAndEntities(newTagsAndEntities);
              }}
            />
          </WhitePaddedView> */}
          <WhitePaddedView style={styles.typeSelector}>
            <BlackText text={t('common.addNew')} style={styles.addNewLabel} />
            <DropDown
              value={formType}
              items={formTypes}
              setFormValues={(value) => {
                setFormType(value as FormType);
              }}
              listMode="MODAL"
              containerStyle={styles.dropdownContainer}
              // disabled={
              //   !(
              //     tagsAndEntities.entities.length > 0 ||
              //     tagsAndEntities.tags.length > 0
              //   )
              // }
            />
          </WhitePaddedView>
          <TransparentView style={formType !== 'DUE_DATE' && styles.hidden}>
            <AddDueDateForm
              defaults={dueDateDefaults}
              onSuccess={() => navigation.goBack()}
              inlineFields={true}
            />
          </TransparentView>
          <TransparentView style={formType !== 'TRANSPORT' && styles.hidden}>
            <AddTransportTaskForm
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
              inlineFields={true}
            />
          </TransparentView>
          <TransparentView
            style={formType !== 'ACCOMMODATION' && styles.hidden}
          >
            <AddAccommodationTaskForm
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
              inlineFields={true}
            />
          </TransparentView>
          <TransparentView
            style={
              !['TASK', 'APPOINTMENT', 'ACTIVITY'].includes(formType) &&
              styles.hidden
            }
          >
            <AddTaskForm
              formType={
                formType === 'TASK' ||
                formType === 'APPOINTMENT' ||
                formType === 'ACTIVITY'
                  ? formType
                  : 'TASK'
              }
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
              inlineFields={true}
            />
          </TransparentView>
          <TransparentView style={formType !== 'ANNIVERSARY' && styles.hidden}>
            <AddAnniversaryForm
              defaults={taskDefaults}
              onSuccess={() => navigation.goBack()}
              inlineFields={true}
            />
          </TransparentView>
        </TransparentView>
      </TransparentView>
    </TransparentFullPageScrollView>
  );
}
