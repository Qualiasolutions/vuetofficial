import { EntityTypeName } from 'types/entities';
import PetCard from './PetCard';
import TripAccomodationCard from './TripAccommodationCard';
import TripActivityCard from './TripActivityCard';
import TripTransportCard from './TripTransportCard';

type LinkMapping = {
  [key in EntityTypeName]?: React.ElementType;
};

export default {
  Pet: PetCard,
  TripAccomodation: TripAccomodationCard,
  TripActivity: TripActivityCard,
  TripTransport: TripTransportCard
} as LinkMapping;
