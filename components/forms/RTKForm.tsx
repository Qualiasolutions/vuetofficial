import React, { useCallback, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useTranslation } from 'react-i18next';
import hasAllRequired from './utils/hasAllRequired';

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

const styles = StyleSheet.create({
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 50,
    zIndex: -1,
    justifyContent: 'center'
  },
  button: {
    width: '50%'
  },
  deleteButton: {
    marginLeft: 10
  },
  spinner: { marginTop: 20 }
});

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
  const { data: userDetails } = useGetUserFullDetails();
  const { t } = useTranslation();

  const flatFields = useMemo(() => {
    return Array.isArray(fields)
      ? fields.reduce((a, b) => ({ ...a, ...b }))
      : fields;
  }, [fields]);

  const initialFormValues = useMemo(() => {
    return userDetails ? createInitialObject(flatFields, userDetails) : {};
  }, [flatFields, userDetails]);

  const [formValues, setFormValues] =
    React.useState<FieldValueTypes>(initialFormValues);
  const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

  const resetState = useCallback(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  useEffect(() => {
    if (userDetails && fields) {
      // TODO - THIS IS TRIGGERING ONCE AFTER UPDATING - FIGURE OUT WHY
      resetState();
    }
  }, [fields, userDetails, resetState]);

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

  const hasRequired = useMemo(() => {
    return hasAllRequired(formValues, flatFields);
  }, [formValues, flatFields]);

  const submitForm = useCallback(() => {
    const submitMethod = formType === 'CREATE' ? 'POST' : 'PATCH';
    const parsedFormValues = parseFormValues(formValues, flatFields);

    const derivedFields = derivedFieldsFunction
      ? derivedFieldsFunction({
          ...parsedFormValues,
          ...extraFields
        })
      : {};

    if (formDataType === 'json') {
      // METHOD HOOKS MUST BE PROVIDED AT THIS POINT
      methodHookTriggers[submitMethod]
        .trigger({
          ...parsedFormValues,
          ...extraFields,
          ...derivedFields
        })
        .unwrap()
        .then(() => {
          onSubmitSuccess();
          if (clearOnSubmit) {
            resetState();
          }
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: t('common.errors.generic')
          });
          onSubmitFailure();
        });
    } else if (formDataType === 'form') {
      const data = new FormData();
      for (const [fieldName, fieldValue] of Object.entries({
        ...parsedFormValues,
        ...derivedFields
      })) {
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
        .unwrap()
        .then(() => {
          onSubmitSuccess();
          if (clearOnSubmit) {
            resetState();
          }
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: t('common.errors.generic')
          });
          onSubmitFailure();
        });
    }
  }, [
    clearOnSubmit,
    derivedFieldsFunction,
    extraFields,
    flatFields,
    formDataType,
    formType,
    formValues,
    methodHookTriggers,
    onSubmitFailure,
    onSubmitSuccess,
    resetState,
    t
  ]);

  const makeDeleteRequest = () => {
    methodHookTriggers.DELETE.trigger(extraFields)
      .then(() => {
        onDeleteSuccess();
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: t('common.errors.generic')
        });
        onDeleteFailure(err);
      });
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
      <TransparentView>
        <TypedForm
          fields={fields}
          formValues={formValues}
          formType={formType}
          inlineFields={inlineFields}
          fieldColor={fieldColor}
          onFormValuesChange={(values: FieldValueTypes) => {
            setFormValues(values);
            onValueChange();
          }}
        />
      </TransparentView>
      {isSubmitting ? (
        <PaddedSpinner spinnerColor="buttonDefault" style={styles.spinner} />
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
            disabled={isSubmitting || !hasRequired}
            style={styles.button}
          />
          {formType === 'UPDATE' && methodHookTriggers.DELETE ? (
            <Button
              title="DELETE"
              onPress={() => {
                setShowDeleteModal(true);
              }}
              disabled={isSubmitting}
              style={[styles.button, styles.deleteButton]}
            />
          ) : null}
        </TransparentView>
      )}
    </TransparentView>
  );
}
