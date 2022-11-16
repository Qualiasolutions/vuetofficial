import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityTabParamList } from 'types/base';
import EntityPeriodsPage from '../../components/calendars/EntityPeriodsPage';
import useEntityHeader from '../../headers/hooks/useEntityHeader';

function EntityPeriodsScreen({
  route
}: NativeStackScreenProps<EntityTabParamList, 'EntityPeriods'>) {
  useEntityHeader(route.params.entityId);
  return <EntityPeriodsPage entityIds={[route.params.entityId]} />;
}

export default EntityPeriodsScreen;
