import { TransparentView } from 'components/molecules/ViewComponents';
import { Text, TextInput } from 'components/Themed';
import { useTranslation } from 'react-i18next';
import {
  useCreatePlanningListMutation,
  useCreatePlanningListTemplateMutation,
  useGetAllPlanningListTemplatesQuery
} from 'reduxStore/services/api/lists';
import { StyleSheet } from 'react-native';
import useGetUserFullDetails from 'hooks/useGetUserDetails';
import { useState } from 'react';
import { Button } from 'components/molecules/ButtonComponents';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Modal } from 'components/molecules/Modals';
import DropDown from 'components/forms/components/DropDown';

const addListStyles = StyleSheet.create({
  listInputPair: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  input: { marginVertical: 10, width: '100%' },
  buttonWrapper: { alignItems: 'flex-start', flexDirection: 'row' },
  button: { paddingVertical: 5, marginHorizontal: 5 },
  selectTemplateDropdown: { marginBottom: 10 },
  createFromTemplateModalContent: {
    alignItems: 'center',
    width: 250,
    maxWidth: '100%'
  },
  modalOr: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});

type AddListStep = 'TEMPLATE_SELECTION' | 'NAME';
const AddListModal = ({
  category,
  visible,
  onRequestClose
}: {
  category: number;
  visible: boolean;
  onRequestClose: () => void;
}) => {
  const [newName, setNewName] = useState('');
  const [newListTemplateId, setNewListTemplateId] = useState('');
  const [step, setStep] = useState<AddListStep>('TEMPLATE_SELECTION');

  const { data: userDetails, isLoading: isLoadingUserDetails } =
    useGetUserFullDetails();
  const { t } = useTranslation();
  const [createNewPlanningList] = useCreatePlanningListMutation();
  const [createTemplate] = useCreatePlanningListTemplateMutation();

  const {
    data: planningListTemplates,
    isLoading: isLoadingPlanningListTemplates
  } = useGetAllPlanningListTemplatesQuery();

  const isLoading =
    isLoadingUserDetails ||
    !userDetails ||
    isLoadingPlanningListTemplates ||
    !planningListTemplates;

  if (isLoading) {
    return null;
  }

  const content =
    step === 'TEMPLATE_SELECTION' ? (
      <>
        <Button
          style={addListStyles.button}
          title={t('components.planningLists.addListModal.createNew')}
          onPress={async () => {
            setNewListTemplateId('');
            setStep('NAME');
          }}
        />
        <TransparentView style={addListStyles.modalOr}>
          <Text>{t('common.or')}</Text>
        </TransparentView>
        <DropDown
          value={newListTemplateId}
          items={planningListTemplates.ids
            .map((templateId) => {
              const template = planningListTemplates.byId[templateId];
              return {
                value: templateId,
                label: template.name,
                category: template.category
              };
            })
            .filter((opt) => opt.category === category)}
          setFormValues={(id) => {
            setNewListTemplateId(id);
            setStep('NAME');
          }}
          listMode="MODAL"
          style={addListStyles.selectTemplateDropdown}
          dropdownPlaceholder={t(
            'components.planningLists.addListModal.selectTemplate'
          )}
        />
      </>
    ) : (
      <>
        <Text>
          {t('components.planningLists.createFromTemplateModal.blurb')}
        </Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          style={addListStyles.input}
        />
        <TransparentView style={addListStyles.buttonWrapper}>
          <Button
            style={addListStyles.button}
            title={t('common.back')}
            onPress={() => {
              setNewListTemplateId('');
              setStep('TEMPLATE_SELECTION');
            }}
          />
          <Button
            style={addListStyles.button}
            title={t('components.planningLists.addListModal.add')}
            onPress={async () => {
              try {
                onRequestClose();
                if (newListTemplateId) {
                  await createTemplate({
                    title: newName,
                    list: parseInt(newListTemplateId),
                    from_template: true
                  });
                } else {
                  await createNewPlanningList({
                    category,
                    name: newName,
                    members: [userDetails.id]
                  }).unwrap();
                }
                setNewName('');
                setStep('TEMPLATE_SELECTION');
                setNewListTemplateId('');
              } catch (err) {
                Toast.show({
                  type: 'error',
                  text1: t('common.errors.generic')
                });
              }
            }}
          />
        </TransparentView>
      </>
    );

  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <TransparentView style={addListStyles.createFromTemplateModalContent}>
        {content}
      </TransparentView>
    </Modal>
  );
};

export default function AddListButton({ category }: { category: number }) {
  const { t } = useTranslation();
  const [addingNew, setAddingNew] = useState(false);

  return (
    <TransparentView>
      <TransparentView>
        <TransparentView style={addListStyles.buttonWrapper}>
          <Button
            style={addListStyles.button}
            title={t('components.planningLists.addList')}
            onPress={() => {
              setAddingNew(true);
            }}
          />
        </TransparentView>
      </TransparentView>
      <AddListModal
        category={category}
        visible={addingNew}
        onRequestClose={() => {
          setAddingNew(false);
        }}
      />
    </TransparentView>
  );
}
