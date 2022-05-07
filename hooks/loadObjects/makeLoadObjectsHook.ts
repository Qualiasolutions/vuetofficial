import React from 'react';
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
    const [loadedObjects, setLoadedObjects] = React.useState<boolean>(false);

    const dispatch = useDispatch();
    const jwtAccessToken = useSelector(selectAccessToken);

    if (!jwtAccessToken) {
      // Return true as we can't load the categories at this point
      return true;
    }

    const getAllCategories = (): void => {
      setLoadedObjects(true);
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
    React.useEffect(getAllCategories, []);

    return loadedObjects;
  };
