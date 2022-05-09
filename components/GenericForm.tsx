import { StyleSheet, TextInput } from 'react-native';

import { Text, View } from 'components/Themed';
import React from 'react';
import { MethodType } from 'utils/makeAuthorisedRequest';
import { DARK } from 'globalStyles/colorScheme';

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

  const formFields = Object.keys(fields).map((field: string) => {
    const fieldType = fields[field];

    switch (fieldType.type) {
      // TODO - add inputs for other field types
      case 'string':
        return (
          <View key={field} style={styles.inputPair}>
            <Text style={styles.inputLabel}>{field}</Text>
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
        );
    }
  });

  return <View style={styles.container}>{formFields}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  inputPair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginVertical: 5
  },
  inputLabel: {
    textAlign: 'left',
    minWidth: 90,
    marginRight: 10
  },
  textInput: {
    borderWidth: 1,
    borderColor: DARK
  }
});
