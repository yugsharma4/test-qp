import { Response } from "express";

type ResponseObj = {
  status: number;
  message: string;
  data?: any;
  error?: any;
};

export const successResponse = (res: Response, message: string) => {
  const responseData: ResponseObj = {
    status: 200,
    message,
  };

  return res.status(200).json(responseData);
};

export const partialSuccessResponse = (res: Response, msg: string) => {
  const responseData: ResponseObj = {
    status: 206,
    message: msg,
  };
  logResponse();
  return res.status(206).json(responseData);
};

export const successResponseWithData = (
  res: Response,
  msg: string,
  data: any
) => {
  const responseData: ResponseObj = {
    status: 200,
    message: msg,
    data: data,
  };
  logResponse();
  return res.status(200).json(responseData);
};

export const ErrorResponse = (res: Response, err: any) => {
  const responseData: ResponseObj = {
    status: 500,
    message: "500 Internal Server error",
    error: err,
  };
  logResponse();
  return res.status(500).json(responseData);
};

export const notFoundResponse = (res: Response, msg: string) => {
  const responseData: ResponseObj = {
    status: 404,
    message: msg,
  };
  logResponse();
  return res.status(404).json(responseData);
};

export const validationErrorWithData = (
  res: Response,
  msg: string,
  data: any
) => {
  const responseData: ResponseObj = {
    status: 400,
    message: msg,
    data: data,
  };
  logResponse();
  return res.status(400).json(responseData);
};

export const validationError = (res: Response, msg: string) => {
  const responseData: ResponseObj = {
    status: 400,
    message: msg,
  };
  logResponse();
  return res.status(400).json(responseData);
};

export const unauthorizedResponse = (res: Response, msg: string) => {
  const responseData: ResponseObj = {
    status: 401,
    message: msg,
  };
  logResponse();
  return res.status(401).json(responseData);
};
export const duplicateResponse = (res: Response, msg: string) => {
  const responseData: ResponseObj = {
    status: 409,
    message: msg,
  };
  logResponse();
  return res.status(responseData.status).json(responseData);
};

export const customResponse = (res: Response, msg: string, data: any) => {
  const responseData: ResponseObj = {
    status: 400,
    message: msg,
    data: data,
  };
  logResponse();
  return res.status(400).json(responseData);
};

export const somethingResponse = (res: Response) => {
  const responseData: ResponseObj = {
    status: 400,
    message: "Something went wrong! Please try again later.",
  };
  logResponse();
  return res.status(400).json(responseData);
};

const logResponse = () => {
  // console.error("\x1B[36m"+JSON.stringify(responseData, null, 2)+"\x1B[39m")
  console.error("=======================================================\n");
};
