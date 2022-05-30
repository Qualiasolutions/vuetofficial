import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAccessToken } from 'reduxStore/slices/auth/selectors';
import {
  isSuccessfulResponseType,
  makeAuthorisedRequest
} from 'utils/makeAuthorisedRequest';
import Constants from 'expo-constants';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export const makeLoadObjects =
  <ObjectType>(apiEndpoint: string, dispatchAction: Function): Function =>
  () => {
    const dispatch = useDispatch();
    const jwtAccessToken = useSelector(selectAccessToken);

    const [loadedObjects, setLoadedObjects] = React.useState<boolean>(false);

    const getAllObjects = (): void => {
      setLoadedObjects(false);
      makeAuthorisedRequest<ObjectType[]>(
        jwtAccessToken,
        `http://${vuetApiUrl}${apiEndpoint}`
      ).then((res) => {
        if (isSuccessfulResponseType<ObjectType[]>(res)) {
          dispatch(dispatchAction(res.response));
          setLoadedObjects(true);
        }
      });
    };
    React.useEffect(getAllObjects, []);

    if (!jwtAccessToken) {
      return false;
    }

    return loadedObjects;
  };
