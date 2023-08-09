import TypedForm from 'components/forms/TypedForm';
import { FieldValueTypes } from 'components/forms/types';
import createInitialObject from 'components/forms/utils/createInitialObject';
import parseFormValues from 'components/forms/utils/parseFormValues';
import { Button } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner, PaddedSpinner } from 'components/molecules/Spinners';
import {
  TransparentPaddedView,
  TransparentView,
  WhiteBox
} from 'components/molecules/ViewComponents';
import { Text } from 'components/Themed';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, ViewStyle } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import {
  useCreateSchoolBreakMutation,
  useCreateSchoolYearMutation,
  useGetAllSchoolBreaksQuery,
  useGetAllSchoolYearsQuery
} from 'reduxStore/services/api/schoolTerms';
import { elevation } from 'styles/elevation';
import { EntityResponseType } from 'types/entities';
import { SchoolYear } from 'types/schoolTerms';
import {
  useSchoolBreakFieldTypes,
  useSchoolYearFieldTypes
} from './formFieldTypes';

const yearCardStyles = StyleSheet.create({
  title: { fontSize: 18, marginBottom: 5 },
  datesText: { fontSize: 12, marginBottom: 5 },
  addBreakButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  breaksHeader: {
    fontSize: 18
  },
  addBreakButton: {
    paddingHorizontal: 14,
    paddingVertical: 5
  },
  termBreakModalContent: { maxWidth: '100%', maxHeight: '100%' },
  termBreakModalButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  termBreakModalButton: {
    margin: 5
  },
  termBreakForm: { marginBottom: 0 }
});

const TermBreakModal = ({
  visible,
  onRequestClose,
  yearId
}: {
  visible: boolean;
  onRequestClose: () => void;
  yearId: number;
}) => {
  const formFields = useSchoolBreakFieldTypes();
  const [formValues, setFormValues] = useState({});
  const { t } = useTranslation();
  const [createBreak, createBreakResult] = useCreateSchoolBreakMutation();

  useEffect(() => {
    const initialFormValues = createInitialObject(formFields);
    setFormValues(initialFormValues);
  }, [formFields]);

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <TransparentView style={yearCardStyles.termBreakModalContent}>
        <TypedForm
          fields={formFields}
          formValues={formValues}
          onFormValuesChange={(values: FieldValueTypes) => {
            setFormValues(values);
          }}
          inlineFields={true}
          sectionStyle={StyleSheet.flatten([
            elevation.unelevated,
            yearCardStyles.termBreakForm
          ])}
        />
        <TransparentView style={yearCardStyles.termBreakModalButtonWrapper}>
          <Button
            title={t('common.cancel')}
            onPress={onRequestClose}
            style={yearCardStyles.termBreakModalButton}
          />
          {createBreakResult.isLoading ? (
            <PaddedSpinner />
          ) : (
            <Button
              title={t('common.add')}
              onPress={async () => {
                try {
                  const parsedValues: any = parseFormValues(
                    formValues,
                    formFields
                  );
                  await createBreak({
                    ...parsedValues,
                    school_year: yearId
                  }).unwrap();
                  onRequestClose();
                } catch (err) {
                  Toast.show({
                    type: 'error',
                    text1: t('common.errors.generic')
                  });
                }
              }}
              style={yearCardStyles.termBreakModalButton}
            />
          )}
        </TransparentView>
      </TransparentView>
    </Modal>
  );
};

const SchoolYearCard = ({
  year,
  school,
  style
}: {
  year: SchoolYear;
  school: EntityResponseType;
  style?: ViewStyle;
}) => {
  const { data: schoolBreaks, isLoading: isLoadingSchoolBreaks } =
    useGetAllSchoolBreaksQuery();

  const { t } = useTranslation();

  const [showBreakModal, setShowBreakModal] = useState(false);

  const isLoading = isLoadingSchoolBreaks || !schoolBreaks;

  if (isLoading) {
    return null;
  }

  const termBreaks = schoolBreaks.byYear[year.id] || null;

  const termBreakComponents = termBreaks
    ? termBreaks.map((breakId) => {
        const schoolBreak = schoolBreaks.byId[breakId];
        return (
          <TransparentView key={schoolBreak.id}>
            <Text>
              {schoolBreak.name} ({schoolBreak.start_date} -{' '}
              {schoolBreak.end_date})
            </Text>
          </TransparentView>
        );
      })
    : [];

  return (
    <WhiteBox style={style}>
      <Text style={yearCardStyles.title}>
        {year.year} {school.name}
      </Text>
      <Text style={yearCardStyles.datesText}>
        {year.start_date} - {year.end_date}
      </Text>
      {termBreaks && (
        <TransparentPaddedView>
          <Text style={yearCardStyles.breaksHeader}>
            {t('components.schoolTerms.breaks')}
          </Text>
          {termBreakComponents}
        </TransparentPaddedView>
      )}
      <TransparentView style={yearCardStyles.addBreakButtonWrapper}>
        <Button
          title={t('components.schoolTerms.addBreak')}
          onPress={() => {
            setShowBreakModal(true);
          }}
          style={yearCardStyles.addBreakButton}
        />
      </TransparentView>
      <TermBreakModal
        visible={showBreakModal}
        onRequestClose={() => setShowBreakModal(false)}
        yearId={year.id}
      />
    </WhiteBox>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100
  },
  button: {
    marginHorizontal: 5
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  schoolTermCard: { marginBottom: 10 }
});

export default function SchoolTermsScreen() {
  const { data: schoolYears, isLoading: isLoadingSchoolYears } =
    useGetAllSchoolYearsQuery();
  const [createSchoolYear] = useCreateSchoolYearMutation();
  const { data: allEntities, isLoading: isLoadingEntities } =
    useGetAllEntitiesQuery();
  const [addingTerm, setAddingTerm] = useState(false);
  const { t } = useTranslation();
  const formFields = useSchoolYearFieldTypes();

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = createInitialObject(formFields);
    setFormValues(initialValues);
  }, [formFields]);

  const isLoading =
    isLoadingSchoolYears || !schoolYears || isLoadingEntities || !allEntities;
  if (isLoading) {
    return <FullPageSpinner />;
  }

  if (addingTerm) {
    return (
      <TransparentFullPageScrollView>
        <TransparentPaddedView>
          <TypedForm
            fields={formFields}
            formValues={formValues}
            onFormValuesChange={(values: FieldValueTypes) => {
              setFormValues(values);
            }}
            inlineFields={true}
          />
          <TransparentView style={styles.buttonWrapper}>
            <Button
              title={t('common.save')}
              onPress={async () => {
                const parsedFieldValues: any = parseFormValues(
                  formValues,
                  formFields
                );

                try {
                  await createSchoolYear(parsedFieldValues).unwrap();
                  setAddingTerm(false);
                } catch (err) {
                  Toast.show({
                    type: 'error',
                    text1: t('common.errors.generic')
                  });
                }
              }}
              style={styles.button}
            />
            <Button
              title={t('common.back')}
              onPress={() => setAddingTerm(false)}
              style={styles.button}
            />
          </TransparentView>
        </TransparentPaddedView>
      </TransparentFullPageScrollView>
    );
  }

  return (
    <TransparentFullPageScrollView contentContainerStyle={styles.container}>
      <TransparentPaddedView>
        {schoolYears.ids.map((schoolYearId) => {
          const schoolTerm = schoolYears.byId[schoolYearId];
          const school = allEntities.byId[schoolTerm.school];
          return (
            <SchoolYearCard
              key={schoolYearId}
              year={schoolYears.byId[schoolYearId]}
              school={school}
              style={styles.schoolTermCard}
            />
          );
        })}
        <TransparentView style={styles.buttonWrapper}>
          <Button title={t('common.add')} onPress={() => setAddingTerm(true)} />
        </TransparentView>
      </TransparentPaddedView>
    </TransparentFullPageScrollView>
  );
}
