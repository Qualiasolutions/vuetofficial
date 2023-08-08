import TypedForm from 'components/forms/TypedForm';
import { FieldValueTypes } from 'components/forms/types';
import createInitialObject from 'components/forms/utils/createInitialObject';
import parseFormValues from 'components/forms/utils/parseFormValues';
import { Button } from 'components/molecules/ButtonComponents';
import { Modal } from 'components/molecules/Modals';
import { TransparentFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { FullPageSpinner } from 'components/molecules/Spinners';
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
  useCreateSchoolTermMutation,
  useGetAllSchoolBreaksQuery,
  useGetAllSchoolTermsQuery
} from 'reduxStore/services/api/schoolTerms';
import { elevation } from 'styles/elevation';
import { EntityResponseType } from 'types/entities';
import { SchoolTerm } from 'types/schoolTerms';
import {
  useSchoolBreakFieldTypes,
  useSchoolTermFieldTypes
} from './formFieldTypes';

const termCardStyles = StyleSheet.create({
  title: { fontSize: 18, marginBottom: 5 },
  datesText: { fontSize: 12, marginBottom: 5 },
  addBreakButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  addBreakButton: {
    paddingHorizontal: 14,
    paddingVertical: 5
  },
  termBreakModalContent: { maxWidth: '100%', maxHeight: '100%' }
});

const TermBreakModal = ({
  visible,
  onRequestClose
}: {
  visible: boolean;
  onRequestClose: () => void;
}) => {
  const formFields = useSchoolBreakFieldTypes();
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialFormValues = createInitialObject(formFields);
    setFormValues(initialFormValues);
  }, [formFields]);

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <TransparentView style={termCardStyles.termBreakModalContent}>
        <TypedForm
          fields={formFields}
          formValues={formValues}
          onFormValuesChange={(values: FieldValueTypes) => {
            setFormValues(values);
          }}
          inlineFields={true}
          sectionStyle={elevation.unelevated}
        />
      </TransparentView>
    </Modal>
  );
};

const SchoolTermCard = ({
  term,
  school,
  style
}: {
  term: SchoolTerm;
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

  const termBreaks = schoolBreaks.byTerm[term.id] || null;

  return (
    <WhiteBox style={style}>
      <Text style={termCardStyles.title}>
        {term.year} {school.name}
      </Text>
      <Text style={termCardStyles.datesText}>
        {term.start_date} - {term.end_date}
      </Text>
      {termBreaks &&
        termBreaks.map((breakId) => {
          const schoolBreak = schoolBreaks.byId[breakId];
          return (
            <Text>
              {schoolBreak.start_date} - {schoolBreak.end_date}
            </Text>
          );
        })}
      <TransparentView style={termCardStyles.addBreakButtonWrapper}>
        <Button
          title={t('components.schoolTerms.addBreak')}
          onPress={() => {
            setShowBreakModal(true);
          }}
          style={termCardStyles.addBreakButton}
        />
      </TransparentView>
      <TermBreakModal
        visible={showBreakModal}
        onRequestClose={() => setShowBreakModal(false)}
      />
    </WhiteBox>
  );
};

const styles = StyleSheet.create({
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
  const { data: schoolTerms, isLoading: isLoadingSchoolTerms } =
    useGetAllSchoolTermsQuery();
  const [createSchoolTerm] = useCreateSchoolTermMutation();
  const { data: allEntities, isLoading: isLoadingEntities } =
    useGetAllEntitiesQuery();
  const [addingTerm, setAddingTerm] = useState(false);
  const { t } = useTranslation();
  const formFields = useSchoolTermFieldTypes();

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = createInitialObject(formFields);
    setFormValues(initialValues);
  }, [formFields]);

  const isLoading =
    isLoadingSchoolTerms || !schoolTerms || isLoadingEntities || !allEntities;
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
                  await createSchoolTerm(parsedFieldValues).unwrap();
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
    <TransparentFullPageScrollView>
      <TransparentPaddedView>
        {schoolTerms.ids.map((schoolTermId) => {
          const schoolTerm = schoolTerms.byId[schoolTermId];
          const school = allEntities.byId[schoolTerm.school];
          return (
            <SchoolTermCard
              key={schoolTermId}
              term={schoolTerms.byId[schoolTermId]}
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
