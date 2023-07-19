import { CategoryName } from 'types/categories';

type CategoryNameOrRef = CategoryName | 'REFERENCES';

const iWantToOptions: {
  [key in CategoryNameOrRef]: string[];
} = {
  PETS: [
    'Remember my Vet appointments',
    'Share tasks for health or after care plan',
    'Make sure there is an exercise schedule for every day',
    'Share feeding tasks',
    'Keep up with bathing and grooming',
    'Have a place to keep vet contact information, microchip details, insurance policy, etc',
    'Remember to check supplies for pets',
    'Weigh pets regularly and review'
  ],
  TRANSPORT: [
    'Be reminded of due dates for MOT, Service, Warranty, Insurance, Lease Expiration',
    'Schedule a monthly wash',
    'Schedule a repair',
    'Be reminded to decide if trading',
    'Keep up with driving license numbers, contact information, warranty, insurance logins',
    'Be reminded when driving license(s) will expire',
    'Remember to buy train tickets for commute'
  ],
  SOCIAL_INTERESTS: [
    'Be reminded to plan and task birthdays, anniversaries, holidays and events',
    'schedule days to post on social media',
    'Task to make a photo book or electronically organise my photos',
    'Plan regular days out for a group',
    'Plan coffee mornings with me and X',
    'Make sure I spend enough time on my own interests and hobbies',
    'Keep up with books I have read',
    'Keep up with goals I have for my hobbies'
  ],
  EDUCATION: [
    'Put all school breaks in my calendar',
    'Be able to schedule travel, tasks, routines around term time',
    'Be reminded of tasks that need to be done before term ends',
    'Be reminded of tasks that need to be done before term starts',
    'Set a revision schedule for tasks within a subject',
    'Schedule revision for more than one subject',
    "Be reminded to review kids' extracurricular activities",
    'Keep to hand school logins',
    'Reference schedule or syllabus'
  ],
  CAREER: ['Add one'],
  TRAVEL: [
    'Be reminded to research trip in advance',
    'Be able to see if I have booked all transport, accomodation and activities I want to before the trip',
    'Remember to shop and pack using my packing list',
    'Keep up with my bucket list of destinations',
    'Reference my passport number(s) and be reminded when they will expire'
  ],
  HEALTH_BEAUTY: [
    'Remember to book annual appointment for all',
    'Schedule gym time or exercise plans',
    'Measure regularly and review',
    'Set a menu plan for my diet',
    'Make an after care plan for appointment',
    'Remember regular hair cuts, salon visits',
    'Reference health policy and login details'
  ],
  HOME: [
    'Share responsibility for clean, tidy, organise, maintain and improve',
    'Add a rental property bills, tasks and income',
    'Reference logins for house subscriptions',
    'Print a chore chart',
    'Keep up with how much is spent in the home',
    'Make sure I don’t miss deadlines for bills',
    'Source a cleaning service (link to handy.com?)',
    'Source an organisation service (is there a free app somewhere?)'
  ],
  FOOD: [
    'Schedule a weekly meal planner',
    'Be reminded to prep and shop weekly ',
    'Schedule family members to be chef on certain days',
    'Share menu plans with family members',
    'Share grocery lists with family members',
    'Allow family members to request menu changes',
    'Keep up with my shopping list',
    'Keep up with food spending',
    'I want to buy a database of recipes to use for menu planning and ordering (is there a free app somewhere?)'
  ],
  LAUNDRY: [
    'Share laundry responsibilities with others',
    'Remember to sort clothes each season',
    'Remember to sort clothes around school terms',
    'Cull and sell clothes',
    'Keep up with shopping list and sizes needed',
    'Source a laundry service',
    'Task help at home to iron each week',
    'Schedule family members to put away clothing on specific days',
    'Schedule seasonal cleans of wardrobes',
    'Schedule seasonal reminders to check closets',
    'Schedule shopping for specific events or trips'
  ],
  FINANCE: [
    'Set a budget and review it monthly',
    'Organise my bills across categories',
    'Remember tax deadlines',
    'Review networth and pensions regularly',
    'Can I outsource any of these tasks (is there a free app?)',
    'Be reminded of deadlines for transferring money for bills or investments'
  ],
  FAMILY: [],
  GARDEN: [
    'Plan regular grass cuts with a family member',
    'Schedule Gardener visits weekly',
    'Task gardener specific items'
  ],
  REFERENCES: [
    'Remember when my electronic upgrade(s) are available',
    'Set house rules for screen usage and monitoring',
    'Set curfews or rules for the family to Reference',
    'Be able to reference logins and numbers I sometimes need',
    'See a report of how I am using my time each week'
  ]
};

export default iWantToOptions;
