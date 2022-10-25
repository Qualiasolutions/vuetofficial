import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'components/Themed';
import { Button } from 'components/molecules/ButtonComponents';
import { FormFieldTypes } from './formFieldTypes';
import {
  MutationTrigger,
  UseMutation
} from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { TransparentView } from 'components/molecules/ViewComponents';
import { YesNoModal } from 'components/molecules/Modals';
import TypedForm from './TypedForm';
import { PaddedSpinner } from 'components/molecules/Spinners';
import createInitialObject from './utils/createInitialObject';
import { FieldValueTypes } from './types';
import parseFormValues from './utils/parseFormValues';
import getUserFullDetails from 'hooks/useGetUserDetails';

type FormType = 'UPDATE' | 'CREATE';
export type FormDataType = 'json' | 'form';

declare type UseMutationResult<T> = {
  // Base query state
  originalArgs?: unknown; // Arguments passed to the latest mutation call. Not available if using the `fixedCacheKey` option
  data?: T; // Returned result if present
  error?: unknown; // Error result if present
  endpointName?: string; // The name of the given endpoint for the mutation
  fulfilledTimestamp?: number; // Timestamp for when the mutation was completed

  // Derived request status booleans
  isUninitialized: boolean; // Mutation has not been fired yet
  isLoading: boolean; // Mutation has been fired and is awaiting a response
  isSuccess: boolean; // Mutation has data from a successful call
  isError: boolean; // Mutation is currently in an "error" state
  startedTimeStamp?: number; // Timestamp for when the latest mutation was initiated

  reset: () => void; // A method to manually unsubscribe from the mutation call and reset the result to the uninitialized state
};

export default function Form({
  fields,
  formType = 'CREATE',
  methodHooks = {},
  extraFields = {},
  derivedFieldsFunction,
  onSubmitSuccess = () => {},
  onSubmitFailure = () => {},
  onDeleteSuccess = () => {},
  onDeleteFailure = () => {},
  onValueChange = () => {},
  clearOnSubmit = true,
  submitText = '',
  inlineFields = false,
  createTextOverride = '',
  fieldColor = '#ffffff',
  formDataType = 'json'
}: {
  fields: FormFieldTypes;
  formType?: FormType;
  methodHooks: { [key: string]: UseMutation<any> };
  extraFields?: object;
  derivedFieldsFunction?: (formValues: FieldValueTypes) => FieldValueTypes;
  onSubmitSuccess?: Function;
  onSubmitFailure?: Function;
  onDeleteSuccess?: Function;
  onDeleteFailure?: Function;
  onValueChange?: Function;
  clearOnSubmit?: boolean;
  submitText?: string;
  inlineFields?: boolean;
  createTextOverride?: string;
  fieldColor?: string;
  formDataType?: FormDataType;
}) {
  const { data: userDetails } = getUserFullDetails();
  const initialFormValues = userDetails
    ? createInitialObject(fields, userDetails)
    : {};
  const [formValues, setFormValues] =
    React.useState<FieldValueTypes>(initialFormValues);
  const [submittingForm, setSubmittingForm] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const resetState = () => {
    setFormValues(initialFormValues);
  };

  useEffect(() => {
    if (userDetails && fields) {
      // TODO - THIS IS TRIGGERING ONCE AFTER UPDATING - FIGURE OUT WHY
      console.log('RESET STATE');
      resetState();
    }
  }, [fields, userDetails]);

  const methodHookTriggers: {
    [key: string]: {
      trigger: MutationTrigger<any>;
      result: UseMutationResult<any>;
    };
  } = {};
  for (const method in methodHooks) {
    const [trigger, result] = methodHooks[method]();
    methodHookTriggers[method] = {
      trigger,
      result
    };
  }

  const isSubmitting = Object.values(methodHookTriggers)
    .map((methodTrigger) => methodTrigger.result)
    .some((result) => result.isLoading);

  for (const method in methodHookTriggers) {
    if (['POST', 'PATCH'].includes(method)) {
      useEffect(() => {
        const res = methodHookTriggers[method].result;
        if (res.isSuccess) {
          setSubmitError('');
          onSubmitSuccess();
          if (clearOnSubmit) {
            resetState();
          }
        } else if (res.isError) {
          setSubmitError('An unexpected error occurred');
          onSubmitFailure(res.error);
          console.log(res.error);
        }
      }, [methodHookTriggers[method].result]);
    } else if (method === 'DELETE') {
      useEffect(() => {
        const res = methodHookTriggers[method].result;
        if (res.isSuccess) {
          setSubmitError('');
          onDeleteSuccess();
        } else if (res.isError) {
          setSubmitError('An unexpected error occurred');
          onDeleteFailure(res.error);
        }
      }, [methodHookTriggers[method].result]);
    }
  }

  const hasAllRequired = useMemo(() => {
    for (const fieldName in fields) {
      if (fields[fieldName].required) {
        if (fields[fieldName].type === 'addMembers') {
          return formValues[fieldName] && formValues[fieldName].length > 0;
        } else if (!formValues[fieldName]) {
          return false;
        }
      }
    }

    return true;
  }, [formValues]);

  const submitForm = () => {
    setSubmittingForm(true);

    const submitMethod = formType === 'CREATE' ? 'POST' : 'PATCH';
    const parsedFormValues = parseFormValues(formValues, fields);

    if (formDataType === 'json') {
      // METHOD HOOKS MUST BE PROVIDED AT THIS POINT
      const derivedFields = derivedFieldsFunction
        ? derivedFieldsFunction({
            ...parsedFormValues,
            ...extraFields
          })
        : {};

      methodHookTriggers[submitMethod]
        .trigger({
          ...parsedFormValues,
          ...extraFields,
          ...derivedFields
        })
        .then(() => {
          setSubmittingForm(false);
        })
        .catch(() => {
          setSubmittingForm(false);
        });
    } else if (formDataType === 'form') {
      const data = new FormData();
      for (const [fieldName, fieldValue] of Object.entries(parsedFormValues)) {
        if (typeof fieldValue === 'object' && fieldValue.length !== undefined) {
          // If the value is an array then it must be treated as such
          for (const val of fieldValue) {
            data.append(fieldName, val);
          }
        } else {
          data.append(fieldName, fieldValue as any);
        }
      }
      for (const [fieldName, fieldValue] of Object.entries(extraFields)) {
        data.append(fieldName, fieldValue as any);
      }

      methodHookTriggers[submitMethod]
        .trigger({
          formData: data,
          ...extraFields
        })
        .then(() => {
          setSubmittingForm(false);
        })
        .catch(() => {
          setSubmittingForm(false);
        });
    }
  };

  const makeDeleteRequest = () => {
    setSubmittingForm(true);
    methodHookTriggers['DELETE'].trigger(extraFields);
    setSubmittingForm(false);
  };

  return (
    <TransparentView>
      <YesNoModal
        title="Before you proceed"
        question={'Are you sure you want to delete?'}
        visible={!!showDeleteModal}
        onYes={makeDeleteRequest}
        onNo={() => {
          setShowDeleteModal(false);
        }}
      />
      <View>
        {submitError ? <Text>{submitError}</Text> : null}
        <TypedForm
          fields={fields}
          formValues={formValues}
          inlineFields={inlineFields}
          fieldColor={fieldColor}
          onFormValuesChange={(values: FieldValueTypes) => {
            setFormValues(values);
            onValueChange();
          }}
        />
      </View>
      {isSubmitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" style={{ marginTop: 20 }} />
      ) : (
        <TransparentView style={styles.bottomButtons}>
          <Button
            title={
              submitText ||
              (formType === 'CREATE'
                ? createTextOverride || 'CREATE'
                : 'UPDATE')
            }
            onPress={() => {
              submitForm();
            }}
            disabled={submittingForm || !hasAllRequired}
            style={styles.button}
          />
          {formType === 'UPDATE' && methodHookTriggers['DELETE'] ? (
            <Button
              title="DELETE"
              onPress={() => {
                setShowDeleteModal(true);
              }}
              disabled={submittingForm}
              style={[styles.button, styles.deleteButton]}
            />
          ) : null}
        </TransparentView>
      )}
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 30,
    zIndex: -1,
    justifyContent: 'center'
  },
  button: {
    width: '50%'
  },
  deleteButton: {
    marginLeft: 10
  }
});
