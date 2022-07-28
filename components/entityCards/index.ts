import { EntityTypeName } from 'types/entities';
import PetCard from './PetCard';
import TripAccomodationCard from './TripAccommodationCard';
import TripActivityCard from './TripActivityCard';
import TripTransportCard from './TripTransportCard';
import AnniversaryCard from './AnniversaryCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: PetCard,
  TripAccomodation: TripAccomodationCard,
  TripActivity: TripActivityCard,
  TripTransport: TripTransportCard,
  Anniversary: AnniversaryCard,
  Birthday: AnniversaryCard
} as LinkMapping;
