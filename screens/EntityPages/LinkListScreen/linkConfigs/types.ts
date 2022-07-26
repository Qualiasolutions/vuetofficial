export type List = {
  name: string;
  navMethod: 'push' | 'navigate';
  toScreen: string;
  toScreenParams: any;
}