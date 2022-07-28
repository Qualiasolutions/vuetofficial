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
        showCreateForm: true
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
      name: 'social.annualDates',
      toScreen: 'LinkList',
      navMethod: 'push',
      toScreenParams: { listName: 'annualDates' }
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
} as {
  [key: string]: List[];
};
