import { createSelector } from '@reduxjs/toolkit';
import { EntireState } from 'reduxStore/types';
import { MiscState } from './types';

export const selectMiscState = (state: EntireState): MiscState | undefined =>
  state?.misc;

export const selectShowPremiumModal = createSelector(
  selectMiscState,
  (misc: MiscState | undefined) => misc?.ui?.showPremiumModal
);
