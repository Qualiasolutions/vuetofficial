import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { TransparentPaddedView } from 'components/molecules/ViewComponents';
import { WhiteFullPageScrollView } from 'components/molecules/ScrollViewComponents';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';
import { FullPageSpinner } from 'components/molecules/Spinners';
import getUserFullDetails from 'hooks/useGetUserDetails';

export default function SchoolScreen({ entityId }: { entityId: number }) {
  const { t } = useTranslation();

  const { data: userDetails } = getUserFullDetails();
  const {
    data: allEntities,
    isLoading,
    error
  } = useGetAllEntitiesQuery(userDetails?.id || -1, {
    skip: !userDetails?.id
  });
  const entityData = allEntities?.byId[entityId];

  const styles = style();

  if (!entityData) {
    return <FullPageSpinner />;
  }

  return (
    <WhiteFullPageScrollView>
      <TransparentPaddedView style={styles.container}>
        <ListLink
          text={t('linkTitles.education.school.schoolBreaks')}
          toScreen="ChildEntitiesScreen"
          toScreenParams={{
            entityTypes: ['SchoolBreak'],
            entityId: entityData.id
          }}
          navMethod="push"
        />
      </TransparentPaddedView>
    </WhiteFullPageScrollView>
  );
}

const style = function () {
  return StyleSheet.create({
    container: {
      paddingTop: 10
    },
    name: {
      fontSize: 26,
      textAlign: 'center'
    }
  });
};
