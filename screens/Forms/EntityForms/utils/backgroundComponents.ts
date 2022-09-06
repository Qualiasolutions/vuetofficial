import {
  TransparentFullPageScrollView,
  WhiteFullPageScrollView
} from 'components/molecules/ScrollViewComponents';

export const backgroundComponents = {
  Anniversary: WhiteFullPageScrollView,
  Birthday: WhiteFullPageScrollView,
  Trip: WhiteFullPageScrollView,
  Car: WhiteFullPageScrollView,
  Boat: WhiteFullPageScrollView,
  PublicTransport: WhiteFullPageScrollView,
  AcademicPlan: WhiteFullPageScrollView,
  ExtracurricularPlan: WhiteFullPageScrollView,
  default: TransparentFullPageScrollView
} as {
  [key: string]: React.ElementType | undefined;
};
