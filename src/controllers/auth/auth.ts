import { Request, Response, NextFunction } from "express";
import { generateToken, verifyToken } from "../../controllers/auth/jwt";
import bcrypt from "bcryptjs";

import * as apiResponse from "../../helper/apiResponse";
import * as userService from "../../services/user";
import { User } from "../../models/User";
import { isValidMobileNumber } from "../../helper/validator";
import { userRole } from "../../constants";

//JWT Token Verification
export const isAuth = (
  request: Request,
  response: Response,
  next: NextFunction
): void | Response => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return apiResponse.unauthorizedResponse(response, "Unauthorized");
  }

  request.body.token = token;

  verifyToken(token, process.env.AUTHTOKEN_SECRETKEY || "%4gdeefw3FEWFE$%@#$")
    .then((res: any) => {
      if (!res.exp) throw {};
      request.body.mobile = res.mobile;
      return next();
    })
    .catch((err) => {
      return apiResponse.unauthorizedResponse(response, "Unauthorized");
    });
};

//Generate JWT Token
export const generateAuthToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const minutes = 100000;
    const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60;
    const payload = { mobile: request.body.mobile };
    const token = generateToken(
      payload,
      process.env.AUTHTOKEN_SECRETKEY || "%4gdeefw3FEWFE$%@#$",
      expirationTime
    );

    request.body.token = token;
    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const signUp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile, password, role } = request.body;

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData: User = {
      name,
      mobile,
      password: hashPassword,
      role,
    };

    const register = await userService.register(userData);

    return apiResponse.successResponse(
      response,
      "user registered successfully"
    );
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const signUpInputChecks = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { name, mobile, password, role } = request.body;
    const userData: User = {
      name,
      mobile,
      password,
      role,
    };

    //registration fields checks
    if (!name)
      return apiResponse.validationError(response, "Please provide user name");
    if (!mobile)
      return apiResponse.validationError(
        response,
        "Please provide mobile number"
      );
    if (!password)
      return apiResponse.validationError(response, "Please provide password");
    if (!role)
      return apiResponse.validationError(response, "Please provide role");

    //registration fields validation
    if (!isValidMobileNumber(mobile))
      return apiResponse.validationError(response, "Invalid mobile number");

    if (role != userRole.ADMIN && role != userRole.USER)
      return apiResponse.validationError(response, "Invalid role");

    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};

export const signIn = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let { mobile, password } = request.body;

    //Field validation
    if (!mobile)
      return apiResponse.validationError(
        response,
        "Please provide mobile number"
      );
    if (!password)
      return apiResponse.validationError(response, "Please provide password");
    if (!isValidMobileNumber(mobile))
      return apiResponse.validationError(response, "Invalid mobile number");

    //Fetch user details
    const getUser = await userService.isUserValid({ mobile });

    if (getUser.length == 0)
      return apiResponse.notFoundResponse(response, "User not found!");

    //Password validation
    const dbUser = getUser[0];
    const dbPassword = dbUser.password;

    const isCorrect = await bcrypt.compare(password, dbPassword);

    if (!isCorrect) {
      return apiResponse.unauthorizedResponse(response, "Incorrect password!");
    }

    // Password is correct
    // Login successful & generate token
    return next();
  } catch (error) {
    return apiResponse.somethingResponse(response);
  }
};
