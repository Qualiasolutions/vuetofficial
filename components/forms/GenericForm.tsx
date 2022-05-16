import { Button, StyleSheet, TextInput } from 'react-native';

import { Text, View } from 'components/Themed';
import React, { useMemo } from 'react';
import { makeAuthorisedRequest } from 'utils/makeAuthorisedRequest';
import DateField from 'react-native-datefield';
import { useSelector } from 'react-redux';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import moment from 'moment';
import SquareButton from '../molecules/SquareButton';

/* This type specifies the mapping of field names to
  their associated types.

  e.g. {
    name: 'string',
    age: 'integer'
  }
*/
type FieldTypes = {
  [key: string]: {
    type: string;
    required: boolean;
    displayName?: string | undefined;
    initialValue?: string;
  };
};

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

const createNullStringObject = (obj: object): { [key: string]: '' } => {
  const nullObj: { [key: string]: '' } = {};
  for (const key of Object.keys(obj)) {
    nullObj[key] = '';
  }
  return nullObj;
};

const createInitialObject = (fields: FieldTypes): { [key: string]: any } => {
  const initialObj: { [key: string]: any } = {};
  for (const key of Object.keys(fields)) {
    if (fields[key].type === 'string') {
      initialObj[key] = fields[key].initialValue || '';
    } else if (fields[key].type === 'Date') {
      initialObj[key] = fields[key].initialValue
        ? new Date(fields[key].initialValue || '')
        : null;
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
  url,
  formType = 'CREATE',
  extraFields = {},
  onSubmitSuccess = () => {},
  onSubmitFailure = () => {},
  onDeleteSuccess = () => {},
  onDeleteFailure = () => {},
  onValueChange = () => {},
  clearOnSubmit = false
}: {
  fields: FieldTypes;
  url: string;
  formType?: FormType;
  extraFields?: object;
  onSubmitSuccess?: Function;
  onSubmitFailure?: Function;
  onDeleteSuccess?: Function;
  onDeleteFailure?: Function;
  onValueChange?: Function;
  clearOnSubmit?: boolean;
}) {
  const [formValues, setFormValues] = React.useState<FieldValueTypes>(
    createInitialObject(fields)
  );
  const [formErrors, setFormErrors] = React.useState<FieldErrorTypes>(
    createNullStringObject(fields)
  );
  const [submittingForm, setSubmittingForm] = React.useState<boolean>(false);
  const [submitError, setSubmitError] = React.useState<string>('');

  const jwtToken = useSelector(selectAccessToken);

  const hasAllRequired = useMemo(() => {
    for (const fieldName in fields) {
      if (fields[fieldName].required && !formValues[fieldName]) {
        return false
      }
    }
    return true
  }, [formValues])

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
          delete parsedFormValues[field]
        }
      }
    }
    console.log(parsedFormValues)
    makeAuthorisedRequest(
      jwtToken,
      url,
      { ...parsedFormValues, ...extraFields },
      formType === 'CREATE' ? 'POST' : 'PATCH'
    )
      .then((res) => {
        setSubmittingForm(false);
        if (clearOnSubmit) {
          setFormValues(createNullStringObject(fields));
        }
        setSubmitError('');
        onSubmitSuccess(res.response);
      })
      .catch((err) => {
        setSubmittingForm(false);
        setSubmitError(err.message || 'An unknown error occurred');
        onSubmitFailure(err);
      });
  };

  const makeDeleteRequest = () => {
    setSubmittingForm(true);
    makeAuthorisedRequest(jwtToken, url, null, 'DELETE')
      .then((res) => {
        setSubmittingForm(false);
        setSubmitError('');
        onDeleteSuccess(res.response);
      })
      .catch((err) => {
        setSubmittingForm(false);
        setSubmitError(err.message || 'An unknown error occurred');
        onDeleteFailure(err);
      });
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
                onChangeText={
                  (newValue) => {
                    setFormValues({
                      ...formValues,
                      [field]: newValue
                    })
                    onValueChange()
                  }
                }
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
                  onValueChange()
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
        <Button
          title={formType === 'CREATE' ? 'Create' : 'Update'}
          onPress={submitForm}
          disabled={submittingForm || !hasAllRequired}
          color="#C4C4C4"
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
