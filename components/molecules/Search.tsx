import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { t } from 'i18next';
import { Feather } from '@expo/vector-icons';
import { useThemeColor } from 'components/Themed';
import { default as Colors } from '../../constants/Colors';

const Search = ({ onChangeText = () => {} }) => {
  return (
    <View style={styles.searchView}>
      <Feather
        name="search"
        size={22}
        color={useThemeColor({}, 'mediumGrey')}
      />
      <TextInput
        placeholder={t('common.search')}
        placeholderTextColor={useThemeColor({}, 'mediumGrey')}
        style={styles.textInput}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
    searchView: {
        flexDirection:'row',
        alignItems:'center',
        height: 53,
        backgroundColor: Colors.light.lightGrey,
        borderRadius: 60,
        marginTop: 10,
        paddingLeft: 18
    },
    textInput: {
        flex:1,
        paddingHorizontal: 20,
        fontFamily: 'Poppins',
        fontSize: 16,
    }
})