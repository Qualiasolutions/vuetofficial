import { EntityTypeName } from 'types/entities';
import PetCard from './PetCard';
import TripActivityCard from './TripActivityCard';
import AnniversaryCard from './AnniversaryCard';
import EventCard from './EventCard';
import DaysOffCard from './DaysOffCard';
import HolidayCard from './HolidayCard';
import CarCard from './CarCard';
import SchoolBreakCard from './SchoolBreakCard';
import ModeOfTransportCard from './ModeOfTransportCard';
import ModeOfAccommodationCard from './ModeOfAccommodationCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: PetCard,
  TripActivity: TripActivityCard,
  Anniversary: AnniversaryCard,
  Birthday: AnniversaryCard,
  Event: EventCard,
  DaysOff: DaysOffCard,
  Holiday: HolidayCard,
  Car: CarCard,
  SchoolBreak: SchoolBreakCard,
  Flight: ModeOfTransportCard,
  TrainBusFerry: ModeOfTransportCard,
  RentalCar: ModeOfTransportCard,
  TaxiOrTransfer: ModeOfTransportCard,
  DriveTime: ModeOfTransportCard,
  HotelOrRental: ModeOfAccommodationCard,
  StayWithFriend: ModeOfAccommodationCard
} as LinkMapping;
