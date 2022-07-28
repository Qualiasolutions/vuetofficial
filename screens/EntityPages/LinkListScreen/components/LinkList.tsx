import React from 'react';
import {
  EntityTabParamList,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';
import { StyleSheet } from 'react-native';

type Link = {
  name: string;
  navMethod: 'push' | 'navigate';
  toScreen: string;
  toScreenParams: any;
};

export default function LinkList({ links }: { links: Link[] }) {
  const { t } = useTranslation();

  const listLinks = links?.map((link) => {
    return (
      <ListLink
        text={t(`linkTitles.${link.name}`)}
        key={link.name}
        navMethod={(link.navMethod || 'push') as 'navigate' | 'push'}
        toScreen={
          link.toScreen as
            | keyof EntityTabParamList
            | keyof RootTabParamList
            | keyof SettingsTabParamList
        }
        toScreenParams={link.toScreenParams}
        style={styles.listLink}
      />
    );
  });

  return <TransparentView>{listLinks}</TransparentView>;
}

const styles = StyleSheet.create({
  listLink: {
    marginBottom: 3,
    marginTop:0,
    borderRadius: 0
  }
});
