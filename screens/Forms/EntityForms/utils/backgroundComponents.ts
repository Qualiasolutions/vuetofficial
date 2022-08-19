import {
  TransparentFullPageScrollView,
  WhiteFullPageScrollView
} from 'components/molecules/ScrollViewComponents';

export const backgroundComponents = {
  Anniversary: WhiteFullPageScrollView,
  Birthday: WhiteFullPageScrollView,
  Trip: WhiteFullPageScrollView,
  default: TransparentFullPageScrollView
} as {
  [key: string]: React.ElementType | undefined;
};
