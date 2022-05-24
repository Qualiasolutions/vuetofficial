import { SET_FAMILY } from './actionNames';
import { FamilyResponseType } from 'types/families';
import { createAction } from 'typesafe-actions';

const setFamily = createAction(SET_FAMILY)<FamilyResponseType[]>();

export { setFamily };
