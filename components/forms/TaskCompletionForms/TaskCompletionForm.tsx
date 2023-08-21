import { Text } from 'components/Themed';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from 'components/molecules/Modals';
import { selectTaskById } from 'reduxStore/slices/tasks/selectors';
import { useSelector } from 'react-redux';
import TypedForm from '../TypedForm';
import createInitialObject from '../utils/createInitialObject';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { FieldValueTypes } from '../types';
import { StyleSheet } from 'react-native';
import { elevation } from 'styles/elevation';
import { t } from 'i18next';
import { Button } from 'components/molecules/ButtonComponents';
import SafePressable from 'components/molecules/SafePressable';
import { PrimaryText } from 'components/molecules/TextComponents';
import { TransparentView } from 'components/molecules/ViewComponents';
import useCompletionFormFieldTypes from './taskCompletionFormFieldTypes';
import { TransparentScrollView } from 'components/molecules/ScrollViewComponents';
import useCompletionCallback from './taskCompletionCallbacks';
import parseFormValues from '../utils/parseFormValues';
import hasAllRequired from '../utils/hasAllRequired';
import { PaddedSpinner } from 'components/molecules/Spinners';

const styles = StyleSheet.create({
  buttons: { alignItems: 'flex-end' },
  skipButton: { marginTop: 5 },
  modalFormContainer: { flexGrow: 0 }
});

export default function TaskCompletionForm({
  taskId,
  title = '',
  onSubmitSuccess = () => {},
  onRequestClose = () => {},
  visible = false
}: {
  taskId: number;
  title?: string;
  onSubmitSuccess?: Function;
  onRequestClose?: () => void;
  visible?: boolean;
}) {
  const taskObj = useSelector(selectTaskById(taskId));
  const { data: userDetails } = useGetUserFullDetails();

  const [fieldValues, setFieldValues] = useState<FieldValueTypes>({});
  const [submitting, setSubmitting] = useState(false);

  const completionFields = useCompletionFormFieldTypes(taskObj || null);
  const completionCallback = useCompletionCallback(taskId);

  const initialFieldValues = useMemo(() => {
    if (userDetails && completionFields && taskObj) {
      const initialFields: { [key: string]: any } = {
        ...taskObj,
        tagsAndEntities: { entities: taskObj.entities, tags: taskObj.tags }
      };
      if (taskObj.date) {
        const nextYear = new Date(taskObj.date);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        initialFields.date = nextYear;
      }
      return createInitialObject(completionFields, userDetails, initialFields);
    }
    return {};
  }, [userDetails, completionFields, taskObj]);

  useEffect(() => {
    if (initialFieldValues) {
      setFieldValues(initialFieldValues);
    }
  }, [initialFieldValues]);

  if (!taskObj || !userDetails) {
    return null;
  }

  const allRequired = completionFields
    ? hasAllRequired(fieldValues, completionFields)
    : false;

  if (completionCallback && completionFields) {
    console.log('PROPER TASKL COMPETRIONOISAND');
    return (
      <Modal onRequestClose={() => {}} visible={visible}>
        <TransparentScrollView style={styles.modalFormContainer}>
          <TransparentView>
            {title ? <Text>{title}</Text> : null}
            <TypedForm
              fields={completionFields}
              formValues={fieldValues}
              onFormValuesChange={(values: FieldValueTypes) =>
                setFieldValues(values)
              }
              sectionStyle={StyleSheet.flatten([
                {
                  backgroundColor: 'transparent',
                  marginBottom: 0,
                  paddingHorizontal: 0
                },
                elevation.unelevated
              ])}
            />
            {submitting ? (
              <PaddedSpinner />
            ) : (
              <>
                <Button
                  title={t('common.submit')}
                  onPress={async () => {
                    setSubmitting(true);
                    const parsedFormValues = parseFormValues(
                      fieldValues,
                      completionFields
                    );
                    try {
                      await completionCallback(parsedFormValues);
                      setSubmitting(false);
                      onSubmitSuccess();
                    } catch {
                      setSubmitting(true);
                    }
                  }}
                  disabled={!allRequired}
                />
                <TransparentView style={styles.buttons}>
                  <SafePressable
                    style={styles.skipButton}
                    onPress={onRequestClose}
                  >
                    <PrimaryText text={t('common.skip')} />
                  </SafePressable>
                </TransparentView>
              </>
            )}
          </TransparentView>
        </TransparentScrollView>
      </Modal>
    );
  }
  return null;
}
