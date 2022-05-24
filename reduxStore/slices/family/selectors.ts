import { Selector } from 'react-redux';
import { FamilyState } from './types';
import { EntireState } from '../../types';
import { createSelector } from '@reduxjs/toolkit';
import { FamilyResponseType } from 'types/families';

export const selectFamilyState = (state: EntireState): FamilyState =>
  state.family;

export const selectFamily: Selector<EntireState, FamilyResponseType> =
  createSelector(selectFamilyState, (family: FamilyState) => family.family);
