import { TransparentFullPageScrollView, WhiteFullPageScrollView } from "components/molecules/ScrollViewComponents";

export const backgroundComponents = {
  Trip: WhiteFullPageScrollView,
  default: TransparentFullPageScrollView
} as {
  [key: string]: React.ElementType | undefined;
};