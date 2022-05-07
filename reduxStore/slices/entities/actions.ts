import { SET_ALL_ENTITIES } from './actionNames';
import { EntityResponseType } from 'types/entities';
import { createAction } from 'typesafe-actions';

const setAllEntities = createAction(SET_ALL_ENTITIES)<EntityResponseType[]>();

export { setAllEntities };
