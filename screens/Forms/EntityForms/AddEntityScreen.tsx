import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootTabParamList } from 'types/base';
import AddEntityForm from 'components/forms/AddEntityForm';
import { WhiteContainerView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import { PageTitle } from 'components/molecules/TextComponents';

export default function AddEntityScreen({
  route
}: NativeStackScreenProps<RootTabParamList, 'AddEntity'>) {
  const { t } = useTranslation()
  const parentId = route.params.parentId
  const parsedId = parentId ?
    typeof parentId === 'number' ? parentId : parseInt(parentId) :
    undefined

  return (
    <WhiteContainerView>
      <PageTitle text={t('screens.addEntity.title', { entityType: route.params.entityType })}/>
      <AddEntityForm
        entityType={route.params.entityType}
        parentId={parsedId}
      />
    </WhiteContainerView>
  )
}
