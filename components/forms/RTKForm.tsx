import { Button, Pressable, StyleSheet, TextInput } from 'react-native';

import { Text, View } from 'components/Themed';
import React, { useEffect, useMemo } from 'react';
import { makeAuthorisedRequest, MethodType } from 'utils/makeAuthorisedRequest';
import DateField from 'react-native-datefield';
import { useSelector } from 'react-redux';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import moment from 'moment';
import SquareButton from '../molecules/SquareButton';
import GenericButton from 'components/molecules/GenericButton';
import DateTimeTextInput from './components/DateTimeTextInput';
import { FormFieldTypes, isRadioField } from './formFieldTypes';
import RadioInput from './components/RadioInput';
import {
  MutationTrigger,
  UseMutation,
  UseMutationStateResult
} from '@reduxjs/toolkit/dist/query/react/buildHooks';

/* This type specifies the actual values of the fields.

  e.g. {
    name: 'Tim',
    age: 28
  }
*/
type FieldValueTypes = {
  [key: string]: any;
};

type FieldErrorTypes = {
  [key: string]: string;
};

type FormType = 'UPDATE' | 'CREATE';

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

const createNullStringObject = (obj: object): { [key: string]: '' } => {
  const nullObj: { [key: string]: '' } = {};
  for (const key of Object.keys(obj)) {
    nullObj[key] = '';
  }
  return nullObj;
};

const createInitialObject = (
  fields: FormFieldTypes
): { [key: string]: any } => {
  const initialObj: { [key: string]: any } = {};
  for (const key of Object.keys(fields)) {
    switch (fields[key].type) {
      case 'string':
      case 'radio':
        initialObj[key] = fields[key].initialValue || '';
        continue;

      case 'Date':
      case 'DateTime':
        initialObj[key] = fields[key].initialValue
          ? new Date(fields[key].initialValue || '')
          : null;
        continue;

      default:
        initialObj[key] = null;
    }
  }
  return initialObj;
};

const parseFieldName = (name: string) => {
  return name
    .split('_')
    .map((part) => part[0].toLocaleUpperCase() + part.slice(1))
    .join(' ');
};

export default function Form({
  fields,
  formType = 'CREATE',
  methodHooks = {},
  extraFields = {},
  onSubmitSuccess = () => {},
  onSubmitFailure = () => {},
  onDeleteSuccess = () => {},
  onDeleteFailure = () => {},
  onValueChange = () => {},
  clearOnSubmit = false,
  submitText = ''
}: {
  fields: FormFieldTypes;
  formType?: FormType;
  methodHooks: { [key: string]: UseMutation<any> };
  extraFields?: object;
  onSubmitSuccess?: Function;
  onSubmitFailure?: Function;
  onDeleteSuccess?: Function;
  onDeleteFailure?: Function;
  onValueChange?: Function;
  clearOnSubmit?: boolean;
  submitText?: string;
}) {
  const [formValues, setFormValues] = React.useState<FieldValueTypes>(
    createInitialObject(fields)
  );
  const [formErrors, setFormErrors] = React.useState<FieldErrorTypes>(
    createNullStringObject(fields)
  );
  const [submittingForm, setSubmittingForm] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>('');

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

  for (const method in methodHookTriggers) {
    if (['POST', 'PATCH'].includes(method)) {
      useEffect(() => {
        const res = methodHookTriggers[method].result;
        if (res.isSuccess) {
          setSubmitError('');
          onSubmitSuccess();
        } else if (res.isError) {
          setSubmitError('An unexpected error occurred');
          onSubmitFailure(res.error);
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
      if (fields[fieldName].required && !formValues[fieldName]) {
        return false;
      }
    }
    return true;
  }, [formValues]);

  const produceLabelFromFieldName = (fieldName: string) => {
    return (
      <Text style={styles.inputLabel}>
        {fields[fieldName].displayName || parseFieldName(fieldName)}
        {fields[fieldName].required ? '*' : ''}
      </Text>
    );
  };

  const submitForm = () => {
    setSubmittingForm(true);
    const parsedFormValues = { ...formValues };
    for (const field in parsedFormValues) {
      if (fields[field].type === 'Date') {
        if (parsedFormValues[field]) {
          parsedFormValues[field] = moment(parsedFormValues[field]).format(
            'YYYY-MM-DD'
          );
        } else {
          delete parsedFormValues[field];
        }
      }
    }

    const submitMethod = formType === 'CREATE' ? 'POST' : 'PATCH';

    // METHOD HOOKS MUST BE PROVIDED AT THIS POINT
    methodHookTriggers[submitMethod].trigger({
      ...parsedFormValues,
      ...extraFields
    });

    setSubmittingForm(false);
  };

  const makeDeleteRequest = () => {
    setSubmittingForm(true);
    methodHookTriggers['DELETE'].trigger(extraFields);
    setSubmittingForm(false);
  };

  const formFields = Object.keys(fields).map((field: string) => {
    const fieldType = fields[field];

    // TODO - add inputs for other field types
    switch (fieldType.type) {
      case 'string':
        return (
          <View key={field} style={styles.inputBlock}>
            <View key={field} style={styles.inputPair}>
              {produceLabelFromFieldName(field)}
              <TextInput
                value={formValues[field]}
                style={styles.textInput}
                onChangeText={(newValue) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  onValueChange();
                }}
              />
            </View>
          </View>
        );
      case 'Date':
        return (
          <View key={field} style={styles.inputBlock}>
            {formErrors[field] ? (
              <Text style={styles.formError}>{formErrors[field]}</Text>
            ) : null}
            <View style={styles.inputPair}>
              {produceLabelFromFieldName(field)}
              <DateField
                value={formValues[field]}
                defaultValue={formValues[field]}
                styleInput={[styles.textInput, styles.dateFieldInput]}
                minimumDate={new Date()}
                onSubmit={(newValue) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                  onValueChange();
                }}
                handleErrors={() => {
                  setFormErrors({
                    ...formErrors,
                    [field]:
                      'Invalid date detected - please enter a date in the future'
                  });
                }}
              />
            </View>
          </View>
        );
      case 'DateTime':
        return (
          <View key={field} style={styles.inputBlock}>
            {formErrors[field] ? (
              <Text style={styles.formError}>{formErrors[field]}</Text>
            ) : null}
            <View style={styles.inputPair}>
              {produceLabelFromFieldName(field)}
              <DateTimeTextInput
                value={formValues[field]}
                textInputStyle={styles.textInput}
                onValueChange={(newValue: Date) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                  onValueChange();
                }}
              />
            </View>
          </View>
        );
      case 'radio':
        const f = fields[field];
        if (isRadioField(f)) {
          const permittedValueObjects = f.permittedValues.map(
            (value: any, i: number) => ({
              label: f.valueToDisplay(value),
              value
            })
          );

          return (
            <View key={field} style={styles.inputBlock}>
              {formErrors[field] ? (
                <Text style={styles.formError}>{formErrors[field]}</Text>
              ) : null}
              <View style={styles.inputPair}>
                {produceLabelFromFieldName(field)}
                <RadioInput
                  value={formValues[field]}
                  permittedValues={permittedValueObjects}
                  onValueChange={(value: any) => {
                    setFormValues({
                      ...formValues,
                      [field]: value.pk
                    });
                    setFormErrors({ ...formErrors, [field]: '' });
                    onValueChange();
                  }}
                />
              </View>
            </View>
          );
        }
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.fieldsContainer}>
        {submitError ? (
          <Text style={styles.formError}>{submitError}</Text>
        ) : null}
        {formFields}
      </View>
      <View style={styles.bottomButtons}>
        <GenericButton
          title={submitText || (formType === 'CREATE' ? 'CREATE' : 'UPDATE')}
          onPress={submitForm}
          disabled={submittingForm || !hasAllRequired}
          style={{ backgroundColor: '#C4C4C4' }}
          textStyle={{ color: 'black', fontWeight: 'bold' }}
        />
        {formType === 'UPDATE' ? (
          <SquareButton
            fontAwesomeIconName="trash"
            onPress={makeDeleteRequest}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  fieldsContainer: {
    margin: 10,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  inputBlock: {
    alignItems: 'flex-start',
    width: '100%'
  },
  inputPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginVertical: 5
  },
  inputLabel: {
    textAlign: 'right',
    minWidth: 130,
    marginRight: 30,
    fontWeight: 'bold'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 100,
    backgroundColor: '#F3F2F2',
    borderRadius: 3,
    padding: 3
  },
  dateFieldInput: {
    width: 50,
    minWidth: 50,
    marginRight: 2
  },
  formError: {
    color: 'red',
    maxWidth: 200,
    textAlign: 'center'
  },
  bottomButtons: {
    flexDirection: 'row'
  }
});
