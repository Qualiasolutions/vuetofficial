import { useThemeColor } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';

import { useAnniversaryFieldTypes } from './taskFormFieldTypes';
import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
  TransparentPaddedView,
  TransparentView,
  WhitePaddedView
} from 'components/molecules/ViewComponents';
import TypedForm from 'components/forms/TypedForm';
import createInitialObject from 'components/forms/utils/createInitialObject';
import { FieldValueTypes } from 'components/forms/types';
import { StyleSheet, ViewStyle } from 'react-native';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  useCreateTaskMutation,
  useCreateTaskWithoutCacheInvalidationMutation
} from 'reduxStore/services/api/tasks';
import parseFormValues from 'components/forms/utils/parseFormValues';
import useGetUserDetails from 'hooks/useGetUserDetails';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import hasAllRequired from 'components/forms/utils/hasAllRequired';
import { useSelector } from 'react-redux';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { AnniversaryTaskType } from 'types/tasks';
import DropDown from './components/DropDown';
import { elevation } from 'styles/elevation';
import RecurrentUpdateModal from './RecurrentUpdateModal';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    zIndex: -1,
    justifyContent: 'center'
  },
  spinner: { marginTop: 20 },
  typeSelectorSection: {}
});

type AddAnniversaryFormProps = {
  defaults: {
    title: string;
    date: string;
    known_year?: boolean;
    entities: number[];
    tags: string[];
    first_name?: string;
    last_name?: string;
  };
  onSuccess: () => void;
  recurrenceOverwrite?: boolean;
  recurrenceIndex?: number;
  taskId?: number;
  inlineFields?: boolean;
  sectionStyle?: ViewStyle;
};

export default function AddAnniversaryForm({
  defaults,
  onSuccess,
  recurrenceOverwrite,
  recurrenceIndex,
  taskId,
  inlineFields,
  sectionStyle
}: AddAnniversaryFormProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<AnniversaryTaskType>('BIRTHDAY');
  const { data: userDetails } = useGetUserDetails();

  const [createTask, createTaskResult] = useCreateTaskMutation();
  const [createTaskWithoutCacheInvalidation, createTaskWithoutMutationResult] =
    useCreateTaskWithoutCacheInvalidationMutation();

  const taskObj = useSelector(selectTaskById(taskId || -1));

  const isSubmitting =
    createTaskResult.isLoading || createTaskWithoutMutationResult.isLoading;

  const fieldColor = useThemeColor({}, 'almostWhite');

  const [anniversaryFieldValues, setAnniversaryFieldValues] =
    useState<FieldValueTypes>({});
  const [loadedFields, setLoadedFields] = useState<boolean>(false);
  const [resetState, setResetState] = useState<() => void>(() => () => {});

  const anniversaryFields = useAnniversaryFieldTypes(type, recurrenceOverwrite);

  const [fieldValues, setFieldValues] = useState<any>({});

  const [showRecurrentUpdateModal, setShowRecurrentUpdateModal] =
    useState(false);

  const initialAnniversaryFields = useMemo(() => {
    if (!userDetails) {
      return null;
    }

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const defaultRecurrence = {
      earliest_occurrence: null,
      latest_occurrence: null,
      interval_length: 1,
      recurrence: 'YEARLY'
    };

    return createInitialObject(anniversaryFields, userDetails, {
      date: defaults.date || null,
      known_year: defaults.known_year || null,
      title: defaults?.title || '',
      duration: 15,
      tagsAndEntities: {
        entities: defaults?.entities?.length ? defaults?.entities : [],
        tags: defaults?.tags?.length
          ? defaults?.tags
          : [
              type === 'BIRTHDAY'
                ? 'SOCIAL_INTERESTS__BIRTHDAY'
                : 'SOCIAL_INTERESTS__ANNIVERSARY'
            ]
      },
      recurrence: defaultRecurrence,
      first_name: defaults.first_name,
      last_name: defaults.last_name
    });
  }, [anniversaryFields, userDetails, defaults, type]);

  useEffect(() => {
    if (userDetails) {
      if (initialAnniversaryFields) {
        setAnniversaryFieldValues(initialAnniversaryFields);
      }

      if (initialAnniversaryFields) {
        setResetState(() => () => {
          setAnniversaryFieldValues(initialAnniversaryFields);
        });
      }

      setLoadedFields(true);
    }
  }, [initialAnniversaryFields, userDetails, anniversaryFields]);

  const hasRequired = useMemo(() => {
    return hasAllRequired(anniversaryFieldValues, anniversaryFields);
  }, [anniversaryFields, anniversaryFieldValues]);

  const submitForm = async () => {
    const parsedDueDateFieldValues = parseFormValues(
      anniversaryFieldValues,
      anniversaryFields
    );
    const parsedFieldValues: any = {
      ...parsedDueDateFieldValues,
      end_date: parsedDueDateFieldValues.start_date,
      type,
      resourcetype: type === 'ANNIVERSARY' ? 'AnniversaryTask' : 'BirthdayTask',
      duration: 15
    };

    setFieldValues(parsedFieldValues);

    try {
      if (recurrenceOverwrite) {
        setShowRecurrentUpdateModal(true);
      } else {
        if (
          parsedFieldValues.recurrence ||
          (parsedFieldValues.actions && parsedFieldValues.actions.length > 0)
        ) {
          await createTask(parsedFieldValues).unwrap();
        } else {
          await createTaskWithoutCacheInvalidation(parsedFieldValues).unwrap();
        }
        Toast.show({
          type: 'success',
          text1: t('screens.addTask.createSuccess')
        });
        resetState();
        onSuccess();
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: t('common.errors.generic')
      });
    }
  };

  const anniversaryTypedForm = useMemo(
    () => (
      <TypedForm
        fields={anniversaryFields}
        formValues={anniversaryFieldValues}
        onFormValuesChange={(values: FieldValueTypes) => {
          setAnniversaryFieldValues(values);
        }}
        inlineFields={!!inlineFields}
        fieldColor={fieldColor}
        sectionStyle={sectionStyle}
      />
    ),
    [
      anniversaryFields,
      anniversaryFieldValues,
      fieldColor,
      inlineFields,
      sectionStyle
    ]
  );

  if (!(userDetails && loadedFields)) {
    return <FullPageSpinner />;
  }

  return (
    <TransparentView style={styles.container}>
      <WhitePaddedView style={[styles.typeSelectorSection, elevation.elevated]}>
        <DropDown
          value={type}
          items={[
            {
              value: 'BIRTHDAY',
              label: 'Birthday'
            },
            {
              value: 'ANNIVERSARY',
              label: 'Anniversary'
            }
          ]}
          setFormValues={setType}
          listMode="MODAL"
        />
      </WhitePaddedView>
      {anniversaryTypedForm}
      {isSubmitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" style={styles.spinner} />
      ) : (
        <TransparentPaddedView style={styles.bottomButtons}>
          <Button
            title={
              recurrenceOverwrite ? t('common.update') : t('common.create')
            }
            onPress={() => {
              submitForm();
            }}
            disabled={!hasRequired}
          />
        </TransparentPaddedView>
      )}
      <RecurrentUpdateModal
        visible={showRecurrentUpdateModal}
        onRequestClose={() => setShowRecurrentUpdateModal(false)}
        recurrence={taskObj?.recurrence?.id || -1}
        recurrenceIndex={recurrenceIndex === undefined ? -1 : recurrenceIndex}
        taskId={taskId || -1}
        parsedFieldValues={fieldValues}
      />
    </TransparentView>
  );
}
