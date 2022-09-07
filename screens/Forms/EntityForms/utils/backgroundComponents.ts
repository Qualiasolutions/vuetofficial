import {
  TransparentFullPageScrollView,
  WhiteFullPageScrollView
} from 'components/molecules/ScrollViewComponents';

export const backgroundComponents = {
  default: WhiteFullPageScrollView
} as {
  [key: string]: React.ElementType | undefined;
};
