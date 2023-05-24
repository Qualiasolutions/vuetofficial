import { LinkListLink } from 'components/lists/LinkList';

export default {
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
      name: 'travel.travellerInfo',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Traveller'],
        entityTypeName: 'traveller'
      }
    }
  ],
  HEALTH_BEAUTY: [
    {
      name: 'healthBeauty.patients',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Patient'],
        entityTypeName: 'patient'
      }
    },
    {
      name: 'healthBeauty.appointments',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Appointment'],
        entityTypeName: 'appointment'
      }
    },
    {
      name: 'healthBeauty.goals',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['HealthGoal'],
        entityTypeName: 'health-goal'
      }
    },
    {
      name: 'healthBeauty.measurements',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['HealthMeasurement'],
        entityTypeName: 'health-measurement'
      }
    },
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
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Food'],
        entityTypeName: 'food'
      }
    },
    {
      name: 'homeGarden.clothing',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Clothing'],
        entityTypeName: 'clothing'
      }
    }
  ],
  FINANCE: [
    {
      name: 'finance.myFinances',
      toScreen: 'EntityList',
      navMethod: 'push',
      toScreenParams: {
        entityTypes: ['Finance'],
        entityTypeName: 'finance'
      }
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
    }
  ]
} as {
  [key: string]: LinkListLink[];
};
