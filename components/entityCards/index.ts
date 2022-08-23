import { EntityTypeName } from 'types/entities';
import PetCard from './PetCard';
import TripAccomodationCard from './TripAccommodationCard';
import TripActivityCard from './TripActivityCard';
import TripTransportCard from './TripTransportCard';
import AnniversaryCard from './AnniversaryCard';
import EventCard from './EventCard';
import DaysOffCard from './DaysOffCard';
import HolidayCard from './HolidayCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: PetCard,
  TripAccomodation: TripAccomodationCard,
  TripActivity: TripActivityCard,
  TripTransport: TripTransportCard,
  Anniversary: AnniversaryCard,
  Birthday: AnniversaryCard,
  Event: EventCard,
  DaysOff: DaysOffCard,
  Holiday: HolidayCard
} as LinkMapping;
