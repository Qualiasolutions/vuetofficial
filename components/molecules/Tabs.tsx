import React from 'react';
import { Text, useThemeColor } from 'components/Themed';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { TransparentView, WhiteView } from './ViewComponents';

function useStyle() {
  return StyleSheet.create({
    container: {
      height: '100%'
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'center'
    },
    tabs: {
      borderRadius: 20,
      overflow: 'hidden',
      margin: 20
    },
    tabContainer: {
      backgroundColor: useThemeColor({}, 'almostWhite')
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

type Tab = {
  title: string;
  component: () => JSX.Element | null;
};

type TabsProps = {
  tabs: Array<Tab>;
};

export default function Tabs({ tabs }: TabsProps) {
  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
  const styles = useStyle();

  const components = tabs.map((tab, i) => {
    const Component = tab.component;
    return (
      <TransparentView
        key={i}
        style={selectedTabIndex === i ? {} : { height: 0 }}
      >
        <Component />
      </TransparentView>
    );
  });

  return (
    <WhiteView style={styles.container}>
      <TransparentView
        style={[
          styles.tabsContainer,
          { backgroundColor: useThemeColor({}, 'lightBlue') }
        ]}
      >
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
      {components}
    </WhiteView>
  );
}
