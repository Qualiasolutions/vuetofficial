import React, { useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { RootTabParamList, RootTabScreenProps } from 'types/base';
import { TransparentView, WhiteView } from 'components/molecules/ViewComponents';
import { AlmostBlackText } from 'components/molecules/TextComponents';
import { useTranslation } from 'react-i18next';
import { useGetAllEntitiesQuery } from 'reduxStore/services/api/entities';
import { useSelector } from 'react-redux';
import { selectUsername } from 'reduxStore/slices/auth/selectors';
import { useGetUserDetailsQuery } from 'reduxStore/services/api/user';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// We will need to add more types here as we use
// this for more sub-navigators
type ListLinkProps = {
  text: string;
  toScreen: keyof RootTabParamList;
  toScreenParams?: object;
  key: any;
}

export default function ListLink({ text, toScreen, key, toScreenParams = {} }: ListLinkProps) {
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();

  return <Pressable key={key} onPress={() => navigation.navigate(toScreen, toScreenParams as any)}>
    <WhiteView style={styles.listEntry}>
      <AlmostBlackText text={text} style={styles.listEntryText}/>
      <Image source={require('../../assets/images/icons/arrow-right.png')}/>
    </WhiteView>
  </Pressable>
}

const styles = StyleSheet.create({
  listEntry: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  listEntryText: {
    fontSize: 20
  }
});
