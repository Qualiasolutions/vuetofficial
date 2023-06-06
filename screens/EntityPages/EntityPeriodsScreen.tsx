import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContentTabParamList } from 'types/base';
import EntityPeriodsPage from '../../components/calendars/EntityPeriodsPage';
import useEntityHeader from '../../headers/hooks/useEntityHeader';

function EntityPeriodsScreen({
  route
}: NativeStackScreenProps<ContentTabParamList, 'EntityPeriods'>) {
  useEntityHeader(route.params.entityId);
  return <EntityPeriodsPage entityIds={[route.params.entityId]} />;
}

export default EntityPeriodsScreen;
