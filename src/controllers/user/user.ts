import { NextFunction, Request, Response } from "express";

import * as apiResponse from "../../helper/apiResponse";
import * as userService from "../../services/user";

export const isUserValid = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const isUserExist = await userService.isUserValid({
      mobile: request.body.mobile,
    });

    if (isUserExist.length > 0)
      return apiResponse.duplicateResponse(response, "User already exist");

    return next();
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};

export const get = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const isUserExist = await userService.isUserValid({
      mobile: request.body.mobile,
    });

    if (isUserExist.length == 0)
      return apiResponse.duplicateResponse(response, "User not found!");

    request.body.user = isUserExist[0];
    return next();
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};

export const isUserIdValid = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const isUserExist = await userService.getUserById({
      userId: request.body.userId,
    });

    if (isUserExist.length == 0)
      return apiResponse.duplicateResponse(response, "Invalid User ID");

    return next();
  } catch (error) {
    return apiResponse.ErrorResponse(response, error);
  }
};
