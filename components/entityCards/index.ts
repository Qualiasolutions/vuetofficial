import { EntityTypeName } from 'types/entities';
import TripActivityCard from './TripActivityCard';
import AnniversaryCard from './AnniversaryCard';
import EventCard from './EventCard';
import DaysOffCard from './DaysOffCard';
import HolidayCard from './HolidayCard';
import SchoolBreakCard from './SchoolBreakCard';
import ModeOfTransportCard from './ModeOfTransportCard';
import ModeOfAccommodationCard from './ModeOfAccommodationCard';
import TripCard from './TripCard';
import GenericEntityWithImageCard from './GenericEntityWithImageCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: GenericEntityWithImageCard,
  TripActivity: TripActivityCard,
  Trip: TripCard,
  Anniversary: AnniversaryCard,
  Birthday: AnniversaryCard,
  Event: EventCard,
  DaysOff: DaysOffCard,
  Holiday: HolidayCard,
  SocialPlan: GenericEntityWithImageCard,
  Hobby: GenericEntityWithImageCard,
  Car: GenericEntityWithImageCard,
  Boat: GenericEntityWithImageCard,
  Home: GenericEntityWithImageCard,
  School: GenericEntityWithImageCard,
  SocialMedia: GenericEntityWithImageCard,
  SchoolBreak: SchoolBreakCard,
  Flight: ModeOfTransportCard,
  TrainBusFerry: ModeOfTransportCard,
  RentalCar: ModeOfTransportCard,
  TaxiOrTransfer: ModeOfTransportCard,
  DriveTime: ModeOfTransportCard,
  HotelOrRental: ModeOfAccommodationCard,
  StayWithFriend: ModeOfAccommodationCard
} as LinkMapping;
