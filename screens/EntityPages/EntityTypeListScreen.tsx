import React, { useEffect } from 'react';
import {
  EntityTabParamList,
  EntityTabScreenProps,
  RootTabParamList,
  SettingsTabParamList
} from 'types/base';
import { useGetAllCategoriesQuery } from 'reduxStore/services/api/api';
import { TransparentView } from 'components/molecules/ViewComponents';
import { useTranslation } from 'react-i18next';
import ListLink from 'components/molecules/ListLink';
import { FullPageSpinner } from 'components/molecules/Spinners';
import { StyleSheet } from 'react-native';

const CATEGORY_LINKS = {
  FAMILY: [
    {
      name: 'family.familyMembers',
      navMethod: 'navigate',
      toScreen: 'SettingsNavigator',
      toScreenParams: { screen: 'FamilySettings' }
    }
  ],
  PETS: [
    {
      name: 'pets.myPets',
      navMethod: 'push',
      toScreen: '',
      toScreenParams: {}
    },
    {
      name: 'pets.feedingSchedule',
      navMethod: 'push',
      toScreen: '',
      toScreenParams: {}
    },
    {
      name: 'pets.physicalMental',
      navMethod: 'push',
      toScreen: '',
      toScreenParams: {}
    },
    {
      name: 'pets.cleaningGrooming',
      navMethod: 'push',
      toScreen: '',
      toScreenParams: {}
    },
    {
      name: 'pets.vetsMedsMeasurements',
      navMethod: 'push',
      toScreen: '',
      toScreenParams: {}
    },
  ],
  SOCIAL_INTERESTS: [
    {
      name: 'social.anniversaries',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Birthday', 'Anniversary'],
        entityTypeName: 'anniversaries'
      }
    },
    {
      name: 'social.recurringSocial',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'social.socialMedia',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'social.events',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Event'],
        entityTypeName: 'events'
      }
    },
    {
      name: 'social.hobbies',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Hobby'],
        entityTypeName: 'hobbies'
      }
    }
  ],
  EDUCATION_CAREER: [
    {
      name: 'educationCareer.education',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'educationCareer.career',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ],
  TRAVEL: [
    {
      name: 'travel.myTrips',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'travel.wishlists',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'travel.travelChecklists',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ],
  HEALTH_BEAUTY: [
    {
      name: 'healthBeauty.foodExercise',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'healthBeauty.appointments',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'healthBeauty.measurements',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ],
  HOME_GARDEN: [
    {
      name: 'homeGarden.myHome',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'homeGarden.food',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'homeGarden.clothing',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ],
  FINANCE: [
    {
      name: 'finance.billsAdmin',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'finance.filing',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'finance.taxPlanning',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
    {
      name: 'finance.netWorth',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },
  ],
  TRANSPORT: [
    {
      name: 'transport.cars',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Car'],
        entityTypeName: 'cars'
      }
    },
    {
      name: 'transport.boats',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    },

    {
      name: 'transport.publicTransport',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ]
};

type EntityTypeListScreenProps = EntityTabScreenProps<'EntityTypeList'>;

export default function EntityTypeListScreen({
  navigation,
  route
}: EntityTypeListScreenProps) {
  const { data: allCategories, isLoading, error } = useGetAllCategoriesQuery();
  const categoryData = allCategories?.byId[route.params.categoryId];

  const { t } = useTranslation();

  useEffect(() => {
    if (categoryData) {
      navigation.setOptions({
        title: t(`categories.${categoryData.name as string}`)
      });
    }
  }, [allCategories]);

  if (!categoryData) {
    return <FullPageSpinner />;
  }

  const listLinks = CATEGORY_LINKS[categoryData.name]?.map((resourceType) => {
    return (
      <ListLink
        text={t(`linkTitles.${resourceType.name}`)}
        key={resourceType.name}
        navMethod={(resourceType.navMethod || 'push') as 'navigate' | 'push'}
        toScreen={
          resourceType.toScreen as
            | keyof EntityTabParamList
            | keyof RootTabParamList
            | keyof SettingsTabParamList
        }
        toScreenParams={resourceType.toScreenParams}
        style={styles.listLink}
      />
    );
  });

  return <TransparentView>{listLinks}</TransparentView>;
}

const styles = StyleSheet.create({
  listLink: {
    marginBottom: 3
  }
})