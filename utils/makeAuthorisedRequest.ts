type MethodType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS';

interface SuccessfulResponseType<ResponseBodyType> {
  success: boolean;
  response: ResponseBodyType;
}

interface UnsuccessfulResponseType {
  success: boolean;
  error: object;
}


type ResponseType<ResponseBodyType> = SuccessfulResponseType<ResponseBodyType> | UnsuccessfulResponseType

const makeAuthorisedRequest = async <ResponseBodyType>(
  authToken: string,
  url: string,
  requestBody: object | null = null,
  method: MethodType = 'GET',
  extraHeaders: object = {}
): Promise<ResponseType<ResponseBodyType>> => {
  return await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
      ...extraHeaders
    },
    body: requestBody ? JSON.stringify(requestBody) : null
  })
    .then((response) => response.json())
    .then((resJson) => {
      return {
        success: true,
        response: resJson
      };
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        error
      };
    });
};

export {
  makeAuthorisedRequest,
  SuccessfulResponseType,
  UnsuccessfulResponseType
};
