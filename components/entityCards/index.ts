import { EntityTypeName } from 'types/entities';
import PetCard from './PetCard';
import TripActivityCard from './TripActivityCard';
import AnniversaryCard from './AnniversaryCard';
import EventCard from './EventCard';
import DaysOffCard from './DaysOffCard';
import HolidayCard from './HolidayCard';
import VehicleCard from './VehicleCard';
import SchoolBreakCard from './SchoolBreakCard';
import ModeOfTransportCard from './ModeOfTransportCard';
import ModeOfAccommodationCard from './ModeOfAccommodationCard';
import TripCard from './TripCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: PetCard,
  TripActivity: TripActivityCard,
  Trip: TripCard,
  Anniversary: AnniversaryCard,
  Birthday: AnniversaryCard,
  Event: EventCard,
  DaysOff: DaysOffCard,
  Holiday: HolidayCard,
  Car: VehicleCard,
  Boat: VehicleCard,
  SchoolBreak: SchoolBreakCard,
  Flight: ModeOfTransportCard,
  TrainBusFerry: ModeOfTransportCard,
  RentalCar: ModeOfTransportCard,
  TaxiOrTransfer: ModeOfTransportCard,
  DriveTime: ModeOfTransportCard,
  HotelOrRental: ModeOfAccommodationCard,
  StayWithFriend: ModeOfAccommodationCard
} as LinkMapping;
