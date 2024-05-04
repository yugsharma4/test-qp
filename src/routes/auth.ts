import express, { NextFunction, Request, Response } from "express";
import * as auth from "../controllers/auth/auth";
import * as user from "../controllers/user/user";
import * as apiResponse from "../helper/apiResponse";

const router = express.Router();

router.post("/signup", auth.signUpInputChecks, user.isUserValid, auth.signUp);

router.post(
  "/signin",
  auth.signIn,
  auth.generateAuthToken,
  (request: Request, response: Response) => {
    return apiResponse.successResponseWithData(
      response,
      "user sign-in successfully",
      { token: request.body.token }
    );
  }
);

export default router;
