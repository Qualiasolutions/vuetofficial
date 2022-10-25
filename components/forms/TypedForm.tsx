import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { Text, TextInput } from 'components/Themed';
import DateTimeTextInput from 'components/forms/components/DateTimeTextInput';
import {
  AddFamilyMembersField,
  AddMembersField,
  DropDownField,
  DropDownWithOtherField,
  FormFieldTypes,
  hasListMode,
  hasPlaceholder,
  ImageField,
  OptionalYearDate,
  RadioField,
  StringField,
  TimezoneField
} from './formFieldTypes';
import RadioInput from 'components/forms/components/RadioInput';
import { TransparentView, WhiteBox } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { ColorPicker } from 'components/forms/components/ColorPickers';
import MemberSelector from 'components/forms/components/MemberSelector';
import PhoneNumberInput from 'components/forms/components/PhoneNumberInput';
import { Feather } from '@expo/vector-icons';
import FamilySelector from 'components/forms/components/FamilySelector';
import { OptionalYearDateInput } from 'components/forms/components/OptionalYearDateInput';
import DropDown from 'components/forms/components/DropDown';
import { WhiteImagePicker } from 'components/forms/components/ImagePicker';
import createNullStringObject from './utils/createNullStringObject';
import { FieldErrorTypes, FieldValueTypes } from './types';
import { useTranslation } from 'react-i18next';
import TimezoneSelect from './components/TimezoneSelect';

const parseFieldName = (name: string) => {
  return name
    .split('_')
    .map((part) => part[0].toLocaleUpperCase() + part.slice(1))
    .join(' ');
};

export default function TypedForm({
  fields,
  formValues,
  inlineFields = false,
  fieldColor = '#ffffff',
  onFormValuesChange = (formValues: FieldValueTypes) => {},
  style = {}
}: {
  fields: FormFieldTypes;
  formValues: FieldValueTypes;
  inlineFields?: boolean;
  fieldColor?: string;
  onFormValuesChange?: Function;
  style?: ViewStyle;
}) {
  const { t } = useTranslation();

  const [formErrors, setFormErrors] = React.useState<FieldErrorTypes>(
    createNullStringObject(fields)
  );

  const textInputStyle = StyleSheet.flatten([
    styles.textInput,
    { backgroundColor: fieldColor }
  ]);

  const produceLabelFromFieldName = (fieldName: string, style?: ViewStyle) => {
    const displayName = Object.keys(fields[fieldName]).includes('displayName')
      ? fields[fieldName].displayName
      : parseFieldName(fieldName);

    const asterisk = displayName && fields[fieldName].required ? '*' : '';
    return (
      <AlmostBlackText
        text={`${displayName}${asterisk}`}
        style={[styles.inputLabel, style]}
      />
    );
  };

  const formFields = Object.keys(fields).map((field: string) => {
    const fieldType = fields[field];

    switch (fieldType.type) {
      case 'string': {
        const f = fields[field] as StringField;
        return (
          <TransparentView key={field}>
            <TransparentView
              key={field}
              style={inlineFields ? styles.inlineInputPair : {}}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <TextInput
                value={formValues[field]}
                onChangeText={(newValue) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: newValue
                  });
                }}
                style={textInputStyle}
                autoCapitalize={
                  f.transform === 'uppercase' ? 'characters' : 'none'
                }
              />
            </TransparentView>
          </TransparentView>
        );
      }
      case 'phoneNumber':
        return (
          <TransparentView key={field}>
            <TransparentView
              key={field}
              style={inlineFields ? styles.inlineInputPair : {}}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <PhoneNumberInput
                defaultValue={formValues[field]}
                onChangeFormattedText={(newValue) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: newValue
                  });
                }}
                containerStyle={{ flex: 1, height: 50 }}
                textInputStyle={{
                  height: 50
                }}
                textContainerStyle={{
                  backgroundColor: fieldColor
                }}
                placeholder={
                  inlineFields ? t('misc.phoneNo') : t('misc.phoneNumber')
                }
              />
            </TransparentView>
          </TransparentView>
        );
      case 'OptionalYearDate': {
        const f = fields[field];
        return (
          <TransparentView key={field}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <OptionalYearDateInput
                value={formValues[field]}
                onValueChange={(newValue: Date, knownYear: boolean) => {
                  const knownYearFields = (f as OptionalYearDate).knownYearField
                    ? {
                        [(f as OptionalYearDate).knownYearField as string]:
                          knownYear
                      }
                    : {};
                  onFormValuesChange({
                    ...formValues,
                    ...knownYearFields,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                }}
                textInputStyle={textInputStyle}
              />
            </TransparentView>
          </TransparentView>
        );
      }
      case 'Date':
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
                  onFormValuesChange({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                }}
                Date
                containerStyle={styles.inlineDateInput}
                textInputStyle={textInputStyle}
              />
              <Feather name="calendar" size={20} style={styles.calendarIcon} />
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
                  onFormValuesChange({
                    ...formValues,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                }}
                containerStyle={styles.inlineDateInput}
                textInputStyle={textInputStyle}
                disabled={fields[field].disabled}
              />
              <Feather name="calendar" size={20} style={styles.calendarIcon} />
            </TransparentView>
          </TransparentView>
        );
      case 'radio':
        const f = fields[field] as RadioField;
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
                  onFormValuesChange({
                    ...formValues,
                    [field]: value.id
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                }}
              />
            </TransparentView>
          </TransparentView>
        );
      case 'colour':
        return (
          <WhiteBox key={field} style={styles.colourBox} elevated={false}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView style={styles.inputLabelWrapper}>
              {produceLabelFromFieldName(field, { marginTop: 0 })}
            </TransparentView>
            <ColorPicker
              value={formValues[field]}
              onValueChange={(value: string) => {
                onFormValuesChange({
                  ...formValues,
                  [field]: value
                });
                setFormErrors({ ...formErrors, [field]: '' });
              }}
            />
          </WhiteBox>
        );
      case 'addMembers': {
        const f = fields[field] as AddMembersField;
        return (
          <TransparentView key={field}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView style={inlineFields ? styles.inlineInputPair : {}}>
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <MemberSelector
                data={f.permittedValues}
                values={formValues[field] || []}
                onValueChange={(selectedMembers) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: selectedMembers
                  });
                }}
              />
            </TransparentView>
          </TransparentView>
        );
      }
      case 'TextArea':
        return (
          <TransparentView key={field}>
            <TransparentView
              key={field}
              style={inlineFields ? styles.inlineInputPair : {}}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <TransparentView style={{ flex: 1 }}>
                <TextInput
                  value={formValues[field]}
                  onChangeText={(newValue) => {
                    onFormValuesChange({
                      ...formValues,
                      [field]: newValue
                    });
                  }}
                  style={{
                    height: 100,
                    textAlignVertical: 'top',
                    backgroundColor: fieldColor
                  }}
                  multiline={true}
                  maxLength={150}
                />
                <AlmostBlackText
                  text={`${formValues[field]?.length || 0}/150`}
                  style={{ textAlign: 'right' }}
                />
              </TransparentView>
            </TransparentView>
          </TransparentView>
        );
      case 'addFamilyMembers': {
        const f = fields[field] as AddFamilyMembersField;
        return (
          <TransparentView key={field} style={styles.addFamilyMembers}>
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            {produceLabelFromFieldName(field)}
            <FamilySelector
              data={f.permittedValues}
              values={formValues[field] || []}
              onValueChange={(selectedMembers: any) => {
                onFormValuesChange({
                  ...formValues,
                  [field]: [...selectedMembers]
                });
              }}
            />
          </TransparentView>
        );
      }
      case 'dropDown': {
        const f = fields[field] as DropDownField;
        return (
          <View
            key={field}
            style={Platform.OS === 'ios' ? { zIndex: 9999 } : {}}
          >
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView
              key={field}
              style={inlineFields ? styles.inlineInputPair : {}}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <DropDown
                value={formValues[field]}
                items={f.permittedValues}
                setFormValues={(item) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: item
                  });
                }}
                dropdownPlaceholder={
                  (hasPlaceholder(f) && f.placeholder) || undefined
                }
                listMode={(hasListMode(f) && f.listMode) || undefined}
                style={textInputStyle}
                containerStyle={{ flex: 1 }}
                disabled={f.disabled}
              />
            </TransparentView>
          </View>
        );
      }
      case 'dropDownWithOther': {
        const f = fields[field] as DropDownWithOtherField;
        return (
          <View
            key={field}
            style={Platform.OS === 'ios' ? { zIndex: 9999 } : {}}
          >
            {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
            <TransparentView
              key={field}
              style={inlineFields ? styles.inlineInputPair : {}}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <DropDown
                value={formValues[field]}
                items={f.permittedValues}
                setFormValues={(item) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: item
                  });
                }}
                allowOther={true}
                dropdownPlaceholder={
                  (hasPlaceholder(f) && f.placeholder) || undefined
                }
                listMode={(hasListMode(f) && f.listMode) || undefined}
                style={textInputStyle}
                containerStyle={{ flex: 1 }}
                disabled={f.disabled}
              />
            </TransparentView>
          </View>
        );
      }
      case 'Image': {
        const f = fields[field] as ImageField;
        return (
          <TransparentView key={field}>
            <TransparentView
              key={field}
              style={[
                inlineFields ? styles.inlineInputPair : {},
                f.centered ? { alignItems: 'center' } : {}
              ]}
            >
              <TransparentView style={styles.inputLabelWrapper}>
                {produceLabelFromFieldName(field)}
              </TransparentView>
              <WhiteImagePicker
                onImageSelect={(image) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: image
                  });
                }}
                defaultImageUrl={
                  formValues[field]?.uri || formValues[field] || ''
                }
                displayInternalImage={false}
                style={{
                  backgroundColor: fieldColor
                }}
              />
            </TransparentView>
          </TransparentView>
        );
      }
      case 'timezone': {
        const f = fields[field] as TimezoneField;
        return (
          <TransparentView
            key={field}
            style={inlineFields ? styles.inlineInputPair : {}}
          >
            <TransparentView style={styles.inputLabelWrapper}>
              {produceLabelFromFieldName(field)}
            </TransparentView>
            <TimezoneSelect
              value={formValues[field]}
              onSelectTimezone={(value) => {
                onFormValuesChange({
                  ...formValues,
                  [field]: value
                });
              }}
              listMode={f.listMode || 'MODAL'}
              style={textInputStyle}
              containerStyle={{ flex: 1 }}
              disabled={f.disabled}
            />
          </TransparentView>
        );
      }
    }
  });

  return (
    <TransparentView style={style}>
      <View>{formFields}</View>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  inlineInputPair: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10
  },
  inputLabel: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 14,
    marginRight: 10
  },
  inputLabelWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: 110
  },
  inlineDateInput: {
    flex: 1,
    width: '100%'
  },
  colourBox: {
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  calendarIcon: { position: 'absolute', right: 20, bottom: 12, color: 'grey' },
  textInput: {
    height: 44,
    flex: 1,
    minWidth: 100
  },
  addFamilyMembers: { marginTop: 20 }
});
