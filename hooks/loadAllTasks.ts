import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken } from "reduxStore/slices/auth/selectors";
import { setAllTasks } from "reduxStore/slices/tasks/actions";
import { TaskResponseType } from "types/tasks";
import { isSuccessfulResponseType, makeAuthorisedRequest } from "utils/makeAuthorisedRequest";
import Constants from 'expo-constants';

const vuetApiUrl = Constants.manifest?.extra?.vuetApiUrl;

export default function loadTasks() {
  const [loadedTasks, setLoadedTasks] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const jwtAccessToken = useSelector(selectAccessToken);

  if (!jwtAccessToken) {
    // Return true as we can't load the tasks at this point
    return true
  }

  const getAllTasks = (): void => {
    setLoadedTasks(true);
    makeAuthorisedRequest<TaskResponseType[]>(
      jwtAccessToken,
      `http://${vuetApiUrl}/core/task/`
    ).then((res) => {
      if (isSuccessfulResponseType<TaskResponseType[]>(res)) {
        dispatch(setAllTasks(res.response));
        setLoadedTasks(true);
      }
    });
  };
  React.useEffect(getAllTasks, [])

  return loadedTasks
}