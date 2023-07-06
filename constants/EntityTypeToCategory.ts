import { CategoryName } from 'types/categories';
import { EntityTypeName } from 'types/entities';

const ENTITY_TYPE_TO_CATEGORY: { [key in EntityTypeName]: CategoryName } = {
  Anniversary: 'SOCIAL_INTERESTS',
  Car: 'TRANSPORT',
  CareerGoal: 'CAREER',
  Clothing: 'LAUNDRY',
  Boat: 'TRANSPORT',
  Birthday: 'SOCIAL_INTERESTS',
  Event: 'SOCIAL_INTERESTS',
  Hobby: 'SOCIAL_INTERESTS',
  Home: 'HOME',
  PublicTransport: 'TRANSPORT',
  SocialMedia: 'SOCIAL_INTERESTS',
  SocialPlan: 'SOCIAL_INTERESTS',
  List: 'FAMILY',
  Holiday: 'TRAVEL',
  Trip: 'TRAVEL',
  Flight: 'TRAVEL',
  Food: 'FOOD',
  TrainBusFerry: 'TRAVEL',
  RentalCar: 'TRAVEL',
  TaxiOrTransfer: 'TRAVEL',
  DriveTime: 'TRAVEL',
  HotelOrRental: 'TRAVEL',
  StayWithFriend: 'TRAVEL',
  TripActivity: 'TRAVEL',
  Pet: 'PETS',
  DaysOff: 'CAREER',
  AcademicPlan: 'EDUCATION',
  ExtracurricularPlan: 'EDUCATION',
  School: 'EDUCATION',
  SchoolBreak: 'EDUCATION',
  HealthBeauty: 'HEALTH_BEAUTY',
  Finance: 'FINANCE'
};

export default ENTITY_TYPE_TO_CATEGORY;
