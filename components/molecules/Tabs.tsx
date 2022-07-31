import React from "react";
import { Text, useThemeColor } from 'components/Themed';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { TransparentView, WhiteView } from './ViewComponents';

type tab = {
    title: string,
    component: JSX.Element
}

type TabsProps = {
    tabs: Array<tab>
}

export default function Tabs({ tabs }:TabsProps) {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);

  const Component = tabs[selectedTabIndex].component;
  const styles = style();
  return (
    <WhiteView>
      <TransparentView style={{backgroundColor: useThemeColor({}, 'lightBlue')}}>
        <TransparentView style={styles.tabs}>
          <FlatList
            data={tabs}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  onPress={() => setSelectedTabIndex(index)}
                  style={styles.tabContainer}
                >
                  <TransparentView
                    style={
                      selectedTabIndex == index
                        ? styles.selectedTab
                        : styles.unSelectedTab
                    }
                  >
                    <Text>{item.title}</Text>
                  </TransparentView>
                </Pressable>
              );
            }}
            horizontal
          />
        </TransparentView>
      </TransparentView>

      <Component />
    </WhiteView>
  );
}

function style() {
  return StyleSheet.create({
    tabs: {
      height: 37,
      alignSelf: 'center',
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      overflow: 'hidden',
      margin: 20
    },
    tabContainer: {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      height: 37
    },
    unSelectedTab: {
      backgroundColor: useThemeColor({}, 'almostWhite'),
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      width: 90,
      justifyContent: 'center',
      alignItems: 'center'
    },
    selectedTab: {
      backgroundColor: useThemeColor({}, 'white'),
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      width: 90,
      justifyContent: 'center',
      alignItems: 'center'
    }
  });
}
