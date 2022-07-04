import { StyleSheet } from 'react-native';

import { Text, TextInput, Button } from 'components/Themed';
import React, { useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import DateTimeTextInput from './components/DateTimeTextInput';
import { FormFieldTypes, isRadioField } from './formFieldTypes';
import RadioInput from './components/RadioInput';
import {
  MutationTrigger,
  UseMutation
} from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { WhiteDateInput } from './components/DateInputs';
import { ColorPicker } from './components/ColorPickers';

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
      case 'colour':
      case 'phoneNumber':
      case 'radio':
        initialObj[key] = fields[key].initialValue || '';
        continue;

      case 'Date':
        if (fields[key].initialValue) {
          const parsedDate = new Date(fields[key].initialValue || '');
          // Date fields should be the same in all timezones
          const timezoneIgnorantDate = new Date(
            parsedDate.getUTCFullYear(),
            parsedDate.getUTCMonth(),
            parsedDate.getUTCDate()
          );

          initialObj[key] = timezoneIgnorantDate;
        } else {
          initialObj[key] = null;
        }
        continue;

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
  submitText = '',
  inlineFields = false,
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
  inlineFields?: boolean;
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
      <AlmostBlackText
        text={`${fields[fieldName].displayName || parseFieldName(fieldName)}${
          fields[fieldName].required ? '*' : ''
        }`}
        style={styles.inputLabel}
      />
    );
  };

  const submitForm = () => {
    setSubmittingForm(true);
    const parsedFormValues = { ...formValues };
    for (const field in parsedFormValues) {
      if (fields[field].type === 'Date') {
        if (parsedFormValues[field]) {
          parsedFormValues[field] = dayjs(parsedFormValues[field]).format(
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
      case 'phoneNumber':
        return (
          <TransparentView key={field}>
            <TransparentView key={field} style={inlineFields ? styles.inlineInputPair : {}}>
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <TextInput
                value={formValues[field]}
                onChangeText={(newValue) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  onValueChange();
                }}
              />
            </TransparentView>
          </TransparentView>
        );
      case 'Date':
        return (
          <TransparentView key={field}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <WhiteDateInput
                value={formValues[field]}
                defaultValue={formValues[field]}
                onSubmit={(newValue: Date) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                  onValueChange();
                }}
                styleInput={inlineFields ? styles.inlineDateInput : {}}
                styleInputYear={inlineFields ? styles.inlineDateInput : {}}
                containerStyle={inlineFields ? styles.inlineDateContainer : {}}
                handleErrors={() => {
                  setFormErrors({
                    ...formErrors,
                    [field]:
                      'Invalid date detected - please enter a date in the future'
                  });
                }}
              />
            </TransparentView>
          </TransparentView>
        );
      case 'DateTime':
        return (
          <TransparentView key={field}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <DateTimeTextInput
                value={formValues[field]}
                onValueChange={(newValue: Date) => {
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                  onValueChange();
                }}
              />
            </TransparentView>
          </TransparentView>
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
            <TransparentView key={field}>
              {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
              <TransparentView>
                {produceLabelFromFieldName(field)}
                <RadioInput
                  value={formValues[field]}
                  permittedValues={permittedValueObjects}
                  onValueChange={(value: any) => {
                    setFormValues({
                      ...formValues,
                      [field]: value.id
                    });
                    setFormErrors({ ...formErrors, [field]: '' });
                    onValueChange();
                  }}
                />
              </TransparentView>
            </TransparentView>
          );
        }
      case 'colour':
        return (
          <WhiteBox key={field} style={styles.colourBox}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            {produceLabelFromFieldName(field)}
            <ColorPicker
              value={formValues[field]}
              onValueChange={(value: string) => {
                setFormValues({
                  ...formValues,
                  [field]: value
                });
                setFormErrors({ ...formErrors, [field]: '' });
                onValueChange();
              }}
            />
          </WhiteBox>
        );
    }
  });

  return (
    <TransparentView style={styles.container}>
      <TransparentView>
        {submitError ? <Text>{submitError}</Text> : null}
        {formFields}
      </TransparentView>
      <TransparentView style={styles.bottomButtons}>
        <Button
          title={submitText || (formType === 'CREATE' ? 'CREATE' : 'UPDATE')}
          onPress={submitForm}
          disabled={submittingForm || !hasAllRequired}
          style={styles.button}
        />
        {formType === 'UPDATE' && methodHookTriggers['DELETE'] ? (
          <Button
            title="DELETE"
            onPress={makeDeleteRequest}
            disabled={submittingForm}
            style={[styles.button, styles.deleteButton]}
          />
        ) : null}
      </TransparentView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  inlineInputPair: {
    flexDirection: 'row'
  },
  inputLabel: {
    fontSize: 12,
    textAlign: 'left'
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: 100
  },
  inlineDateContainer: {
    width: 'auto'
  },
  inlineDateInput: {
    flex: 0,
    width: 75
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10
  },
  button: {
    width: 'auto'
  },
  deleteButton: {
    marginLeft: 10
  },
  colourBox: {
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});
