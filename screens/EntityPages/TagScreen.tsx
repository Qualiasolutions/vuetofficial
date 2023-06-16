import useEntityTypeHeader from 'headers/hooks/useEntityTypeHeader';
import TagNavigator from 'navigation/TagNavigator';
import { ContentTabScreenProps } from 'types/base';

type TagScreenProps = ContentTabScreenProps<'TagScreen'>;

export default function TagScreen({ route }: TagScreenProps) {
  useEntityTypeHeader(route.params.tagName);
  return <TagNavigator tagName={route.params.tagName} />;
}
