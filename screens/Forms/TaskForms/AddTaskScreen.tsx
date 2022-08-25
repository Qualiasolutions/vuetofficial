import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';

import { Text, useThemeColor } from 'components/Themed';
import {
  fixedTaskForm,
  flexibleTaskForm,
  taskBottomFieldTypes,
  taskOneOffMiddleFieldTypes,
  taskRecurrentMiddleFieldTypes,
  taskTopFieldTypes
} from './taskFormFieldTypes';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { View } from 'react-native';

export default function AddTaskScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddTask'>) {
  const username = useSelector(selectUsername);
  const { data: userDetails } = useGetUserDetailsQuery(username);
  const { t } = useTranslation();
  const [createSuccessful, setCreateSuccessful] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setCreateSuccessful(false);
    }, [])
  );

  const fieldColor = useThemeColor({}, 'almostWhite')

  const taskTopFields = taskTopFieldTypes();
  const [taskTopFieldValues, setTaskTopFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskTopFields)
  );

  const taskRecurrentMiddleFields = taskRecurrentMiddleFieldTypes();
  const [taskRecurrentMiddleFieldValues, setTaskRecurrentMiddleFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskRecurrentMiddleFields)
  );

  const taskOneOffMiddleFields = taskOneOffMiddleFieldTypes();
  const [taskOneOffMiddleFieldValues, setTaskOneOffMiddleFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskOneOffMiddleFields)
  );

  const taskBottomFields = taskBottomFieldTypes();
  const [taskBottomFieldValues, setTaskBottomFieldValues] = useState<FieldValueTypes>(
    createInitialObject(taskBottomFields)
  );

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView>
        {createSuccessful ? (
          <Text>{t('screens.addTask.createSuccess')}</Text>
        ) : null}
        <View>
          <TypedForm
            fields={taskTopFields}
            formValues={taskTopFieldValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setTaskTopFieldValues(values)
            }}
            inlineFields={true}
            fieldColor={fieldColor}
          />
        </View>
        {
          taskTopFieldValues.recurrence
          ? (
            <TypedForm
              fields={taskRecurrentMiddleFields}
              formValues={taskRecurrentMiddleFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskRecurrentMiddleFieldValues(values)
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          ) : (
            <TypedForm
              fields={taskOneOffMiddleFields}
              formValues={taskOneOffMiddleFieldValues}
              onFormValuesChange={(values: FieldValueTypes) => {
                setTaskOneOffMiddleFieldValues(values)
              }}
              inlineFields={true}
              fieldColor={fieldColor}
            />
          )
        }
        <TypedForm
          fields={taskBottomFields}
          formValues={taskBottomFieldValues}
          onFormValuesChange={(values: FieldValueTypes) => {
            setTaskBottomFieldValues(values)
          }}
          inlineFields={true}
          fieldColor={fieldColor}
        />
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}
