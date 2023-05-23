import React, { ReactNode, useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Text, TextInput } from 'components/Themed';
import DateTimeTextInput from 'components/forms/components/DateTimeTextInput';
import {
  AddFamilyMembersField,
  AddMembersField,
  CalculatedDurationField,
  DateField,
  DateTimeField,
  DropDownField,
  DropDownWithOtherField,
  FormFieldTypes,
  hasListMode,
  hasPlaceholder,
  ImageField,
  OptionalYearDate,
  RadioField,
  RecurrenceSelectorField,
  StringField,
  TimezoneField
} from './formFieldTypes';
import RadioInput from 'components/forms/components/RadioInput';
import {
  TransparentView,
  WhiteBox,
  WhiteView
} from 'components/molecules/ViewComponents';
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
import { elevation } from '../../styles/elevation';
import RecurrenceSelector from './components/RecurrenceSelector';
import Duration from './components/Duration';
import InputWithLabel from 'components/molecules/InputWithLabel';

const parseFieldName = (name: string) => {
  return name
    .split('_')
    .map((part) => part[0].toLocaleUpperCase() + part.slice(1))
    .join(' ');
};

export default function TypedForm({
  fields,
  formValues,
  formType = 'CREATE',
  inlineFields = false,
  fieldColor = '#ffffff',
  onFormValuesChange = (formValues: FieldValueTypes) => { },
  style = {}
}: {
  fields: FormFieldTypes;
  formValues: FieldValueTypes;
  formType?: 'UPDATE' | 'CREATE';
  inlineFields?: boolean;
  fieldColor?: string;
  onFormValuesChange?: Function;
  style?: ViewStyle;
}) {
  const { t } = useTranslation();

  const fieldSections = Array.isArray(fields) ? fields : [fields];

  const flatFields = Array.isArray(fields)
    ? fields.reduce((a, b) => ({ ...a, ...b }))
    : fields;

  const [formErrors, setFormErrors] = React.useState<FieldErrorTypes>(
    createNullStringObject(flatFields)
  );

  const textInputStyle = StyleSheet.flatten([
    styles.textInput,
    { backgroundColor: fieldColor }
  ]);

  const produceLabelFromFieldName = (fieldName: string, style?: ViewStyle) => {
    const displayName = (
      flatFields
      && flatFields[fieldName]
      && Object.keys(flatFields[fieldName]).includes('displayName')
    )
      ? flatFields[fieldName].displayName
      : parseFieldName(fieldName);

    const asterisk = displayName && flatFields && flatFields[fieldName]?.required ? '*' : '';
    return `${displayName}${asterisk}`
  };

  const InputPair = useMemo(() => ({ field, children, labelStyle }: { field: string; children: ReactNode; labelStyle?: ViewStyle; }) => {
    return <InputWithLabel
      key={field}
      error={formErrors[field] || ""}
      label={produceLabelFromFieldName(field)}
      inlineFields={inlineFields}
      labelStyle={labelStyle}
      labelWrapperStyle={{ minWidth: 110 }}
    >
      {children}
    </InputWithLabel>
  }, [flatFields.length])

  const formFields = fieldSections.map((section, i) => {
    const sectionFields = Object.keys(section).map((field: string) => {
      const fieldType = flatFields[field];

      switch (fieldType.type) {
        case 'string': {
          const f = flatFields[field] as StringField;
          return (
            <InputPair field={field} key={field}>
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
                  f.transform === 'uppercase' ? 'characters' : 'sentences'
                }
              />
            </InputPair>
          );
        }
        case 'phoneNumber':
          return (
            <InputPair field={field} key={field}>
              <PhoneNumberInput
                defaultValue={formValues[field]}
                onChangeFormattedText={(newValue) => {
                  onFormValuesChange({
                    ...formValues,
                    [field]: newValue
                  });
                }}
                textContainerStyle={{
                  backgroundColor: fieldColor
                }}
                placeholder={
                  inlineFields ? t('misc.phoneNo') : t('misc.phoneNumber')
                }
                containerStyle={{ width: '100%' }}
              />
            </InputPair>
          );
        case 'OptionalYearDate': {
          const f = flatFields[field];
          return (
            <InputPair field={field} key={field}>
              <OptionalYearDateInput
                value={formValues[field]}
                onValueChange={(newValue: Date, knownYear: boolean) => {
                  const knownYearFields = (f as OptionalYearDate)
                    .knownYearField
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
            </InputPair>
          );
        }
        case 'Date': {
          const f = flatFields[field] as DateField;
          const limitValues: { [key: string]: Date } = {};
          if (f.associatedEndDateField) {
            if (formValues[f.associatedEndDateField]) {
              limitValues.maximum = formValues[f.associatedEndDateField];
            }
          }
          if (f.associatedStartDateField) {
            if (formValues[f.associatedStartDateField]) {
              limitValues.minimum = formValues[f.associatedStartDateField];
            }
          }
          return (
            <InputPair field={field} key={field}>
              <DateTimeTextInput
                value={formValues[field]}
                maximumDate={limitValues.maximum}
                minimumDate={limitValues.minimum}
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
              <Feather
                name="calendar"
                size={20}
                style={styles.calendarIcon}
              />
            </InputPair>
          );
        }
        case 'DateTime': {
          const f = flatFields[field] as DateTimeField;
          const limitValues: { [key: string]: Date } = {};
          if (f.associatedEndTimeField) {
            if (formValues[f.associatedEndTimeField]) {
              limitValues.maximum = formValues[f.associatedEndTimeField];
            }
          }
          if (f.associatedStartTimeField) {
            if (formValues[f.associatedStartTimeField]) {
              limitValues.minimum = formValues[f.associatedStartTimeField];
            }
          }
          return (
            <InputPair field={field} key={field}>
              <DateTimeTextInput
                value={formValues[field]}
                maximumDate={limitValues.maximum}
                minimumDate={limitValues.minimum}
                onValueChange={(newValue: Date) => {
                  const associatedUpdates: { [key: string]: Date } = {};
                  if (f.associatedEndTimeField) {
                    if (!formValues[f.associatedEndTimeField]) {
                      if (newValue) {
                        const associatedDateTime = new Date(newValue);
                        associatedDateTime.setHours(
                          associatedDateTime.getHours() + 1
                        );
                        associatedUpdates[f.associatedEndTimeField] =
                          associatedDateTime;
                      }
                    }
                  }
                  if (f.associatedStartTimeField) {
                    if (!formValues[f.associatedStartTimeField]) {
                      if (newValue) {
                        const associatedDateTime = new Date(newValue);
                        associatedDateTime.setHours(
                          associatedDateTime.getHours() - 1
                        );
                        associatedUpdates[f.associatedStartTimeField] =
                          associatedDateTime;
                      }
                    }
                  }
                  onFormValuesChange({
                    ...formValues,
                    ...associatedUpdates,
                    [field]: newValue
                  });
                  setFormErrors({ ...formErrors, [field]: '' });
                }}
                containerStyle={styles.inlineDateInput}
                textInputStyle={textInputStyle}
                disabled={
                  f.disabled || (formType === 'UPDATE' && f.disableUpdate)
                }
              />
              <Feather
                name="calendar"
                size={20}
                style={styles.calendarIcon}
              />
            </InputPair>
          );
        }
        case 'radio': {
          const f = flatFields[field] as RadioField;
          const permittedValueObjects = f.permittedValues.map(
            (value: any, i: number) => ({
              label: f.valueToDisplay(value),
              value
            })
          );

          return (
            <InputPair field={field} key={field}>
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
            </InputPair>
          );
        }
        case 'colour':
          return (
            <WhiteBox key={field} style={styles.colourBox} elevated={false}>
              {formErrors[field] ? <Text>{formErrors[field]}</Text> : null}
              <InputPair field={field} key={field}>
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
              </InputPair>
            </WhiteBox>
          );
        case 'addMembers': {
          const f = flatFields[field] as AddMembersField;
          return (
            <InputPair field={field} key={field}>
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
            </InputPair>
          );
        }
        case 'TextArea':
          return (
            <InputPair field={field} key={field}>
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
            </InputPair>
          );
        case 'addFamilyMembers': {
          const f = flatFields[field] as AddFamilyMembersField;
          return (
            <InputPair field={field} key={field}>
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
            </InputPair>
          );
        }
        case 'dropDown': {
          const f = flatFields[field] as DropDownField;
          return (
            <InputPair field={field} key={field}>
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
                disabled={
                  f.disabled || (formType === 'UPDATE' && f.disableUpdate)
                }
              />
            </InputPair>
          );
        }
        case 'dropDownWithOther': {
          const f = flatFields[field] as DropDownWithOtherField;
          return (
            <InputPair field={field} key={field}>
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
                disabled={
                  f.disabled || (formType === 'UPDATE' && f.disableUpdate)
                }
              />
            </InputPair>
          );
        }
        case 'Image': {
          const f = flatFields[field] as ImageField;
          return (
            <InputPair field={field} key={field}>
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
            </InputPair>
          );
        }
        case 'timezone': {
          const f = flatFields[field] as TimezoneField;
          return (
            <InputPair field={field} key={field}>
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
                disabled={
                  f.disabled || (formType === 'UPDATE' && f.disableUpdate)
                }
              />
            </InputPair>
          );
        }
        case 'recurrenceSelector': {
          const f = flatFields[field] as RecurrenceSelectorField;
          const firstOccurrence: Date = formValues[f.firstOccurrenceField]

          if (!firstOccurrence) {
            return null
          }

          return (
            <InputPair field={field} key={field}>
              <TransparentView>
                <RecurrenceSelector
                  value={formValues[field]}
                  onChange={(value) => {
                    onFormValuesChange({
                      ...formValues,
                      [field]: value
                    });
                  }}
                  firstOccurrence={firstOccurrence}
                  disabled={f.disabled || false}
                />
              </TransparentView>
            </InputPair>
          );
        }
        case 'calculatedDuration': {
          const f = flatFields[field] as CalculatedDurationField;
          const startDatetime: Date = formValues[f.startFieldName]
          const endDatetime: Date = formValues[f.endFieldName]

          if (!(startDatetime && endDatetime)) {
            return null
          }

          return <InputPair field={field} key={field}>
            <Duration startDatetime={startDatetime} endDatetime={endDatetime} textInputStyle={{
              backgroundColor: fieldColor
            }} />
          </InputPair>
        }
      }
    });
    return (
      <WhiteView style={[styles.fieldSection, elevation.elevated]} key={i}>
        {sectionFields}
      </WhiteView>
    );
  });

  return (
    <TransparentView style={style}>
      <TransparentView>{formFields}</TransparentView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  inlineDateInput: {
    flexShrink: 1,
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
  calendarIcon: {
    position: 'absolute',
    right: 20,
    bottom: 12,
    color: 'grey'
  },
  textInput: {
    height: 44,
    flexShrink: 1,
    minWidth: 100
  },
  addFamilyMembers: {
    marginTop: 20
  },
  fieldSection: {
    marginBottom: 50,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 30
  }
});
