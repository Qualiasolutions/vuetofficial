import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "reduxStore/slices/auth/selectors";
import { setAllCategories } from "reduxStore/slices/categories/actions";
import { Category as CategoryType } from 'types/categories';
import { isSuccessfulResponseType, makeAuthorisedRequest } from "utils/makeAuthorisedRequest";
import Constants from 'expo-constants';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export default function loadCategories() {
  const [loadedCategories, setLoadedCategories] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);

  if (!jwtAccessToken) {
    // Return true as we can't load the categories at this point
    return true
  }

  const getAllCategories = (): void => {
    setLoadedCategories(true);
    makeAuthorisedRequest<CategoryType[]>(
      jwtAccessToken,
      `http://${vuetApiUrl}/core/category/`
    ).then((res) => {
      if (isSuccessfulResponseType<CategoryType[]>(res)) {
        dispatch(setAllCategories(res.response));
        setLoadedCategories(true);
      }
    });
  };
  React.useEffect(getAllCategories, [])

  return loadedCategories
}