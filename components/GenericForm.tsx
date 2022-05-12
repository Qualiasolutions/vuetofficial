import { StyleSheet, TextInput } from 'react-native';

import { Text, View } from 'components/Themed';
import React from 'react';
import { MethodType } from 'utils/makeAuthorisedRequest';
import { DARK } from 'globalStyles/colorScheme';
import DateField from 'react-native-datefield';

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

const parseFieldName = (name: string) => {
  return name
    .split('_')
    .map(part => part[0].toLocaleUpperCase() + part.slice(1))
    .join(' ')
}

export default function Form({
  fields,
  url,
  method = 'POST'
}: {
  fields: FieldTypes;
  url: string;
  method: MethodType;
}) {
  const [formValues, setFormValues] = React.useState<FieldValueTypes>({});
  const [formErrors, setFormErrors] = React.useState<FieldErrorTypes>({});

  const formFields = Object.keys(fields).map((field: string) => {
    const fieldType = fields[field];

    const produceLabelFromFieldName = (fieldName: string) => {
      return <Text style={styles.inputLabel}>
        {fields[fieldName].displayName || parseFieldName(fieldName)}{fields[fieldName].required ? '*' : ''}
      </Text>
    }

    switch (fieldType.type) {
      // TODO - add inputs for other field types
      case 'string':
        return (
          <View key={field} style={styles.inputBlock}>
            <View key={field} style={styles.inputPair}>
              {produceLabelFromFieldName(field)}
              <TextInput
                value={formValues[field]}
                style={styles.textInput}
                onChangeText={(newValue) =>
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  })
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
                styleInput={[styles.textInput, styles.dateFieldInput]}
                minimumDate={new Date()}
                onSubmit={(newValue) => {
                  console.log(newValue);
                  setFormValues({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
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

  return <View style={styles.container}>{formFields}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginRight: 2,
  },
  formError: {
    color: 'red',
    maxWidth: 200,
    textAlign: 'center'
  }
});
