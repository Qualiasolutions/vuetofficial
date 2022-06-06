import { Text } from 'components/Themed';

export default function GenericError({ errorMessage }: { errorMessage?: string }) {
  console.log(errorMessage)
  return <Text>An unexpected error occurred</Text>;
}
