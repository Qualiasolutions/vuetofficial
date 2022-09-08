import { List } from './types';

export default {
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
      toScreen: 'EntityList',
      toScreenParams: {
        entityTypes: ['Pet'],
        entityTypeName: 'pets',
        showCreateForm: false
      }
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
    }
  ],
  SOCIAL_INTERESTS: [
    {
      name: 'social.socialPlans',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['SocialPlan'],
        entityTypeName: 'social-plans'
      }
    },
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
      name: 'social.nationalHolidays',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Holiday'],
        entityTypeName: 'holidays'
      }
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
    },
    {
      name: 'social.socialMedia',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['SocialMedia'],
        entityTypeName: 'social-media'
      }
    }
  ],
  EDUCATION_CAREER: [
    {
      name: 'educationCareer.education',
      toScreen: 'LinkList',
      navMethod: 'push',
      toScreenParams: { listName: 'education' }
    },
    {
      name: 'educationCareer.career',
      toScreen: 'LinkList',
      navMethod: 'push',
      toScreenParams: { listName: 'career' }
    }
  ],
  TRAVEL: [
    {
      name: 'travel.myTrips',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Trip'],
        entityTypeName: 'trips'
      }
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
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Home'],
        entityTypeName: 'homes'
      }
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
    }
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
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Boat'],
        entityTypeName: 'boats'
      }
    },
    {
      name: 'transport.publicTransport',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['PublicTransport'],
        entityTypeName: 'public-transport'
      }
    },
    {
      name: 'transport.calendar',
      toScreen: '',
      navMethod: 'push',
      toScreenParams: {}
    }
  ]
} as {
  [key: string]: List[];
};
