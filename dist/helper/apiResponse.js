"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.somethingResponse = exports.customResponse = exports.duplicateResponse = exports.unauthorizedResponse = exports.validationError = exports.validationErrorWithData = exports.notFoundResponse = exports.ErrorResponse = exports.successResponseWithData = exports.partialSuccessResponse = exports.successResponse = void 0;
const successResponse = (res, message) => {
    const responseData = {
        status: 200,
        message,
    };
    return res.status(200).json(responseData);
};
exports.successResponse = successResponse;
const partialSuccessResponse = (res, msg) => {
    const responseData = {
        status: 206,
        message: msg,
    };
    logResponse();
    return res.status(206).json(responseData);
};
exports.partialSuccessResponse = partialSuccessResponse;
const successResponseWithData = (res, msg, data) => {
    const responseData = {
        status: 200,
        message: msg,
        data: data,
    };
    logResponse();
    return res.status(200).json(responseData);
};
exports.successResponseWithData = successResponseWithData;
const ErrorResponse = (res, err) => {
    const responseData = {
        status: 500,
        message: "500 Internal Server error",
        error: err,
    };
    logResponse();
    return res.status(500).json(responseData);
};
exports.ErrorResponse = ErrorResponse;
const notFoundResponse = (res, msg) => {
    const responseData = {
        status: 404,
        message: msg,
    };
    logResponse();
    return res.status(404).json(responseData);
};
exports.notFoundResponse = notFoundResponse;
const validationErrorWithData = (res, msg, data) => {
    const responseData = {
        status: 400,
        message: msg,
        data: data,
    };
    logResponse();
    return res.status(400).json(responseData);
};
exports.validationErrorWithData = validationErrorWithData;
const validationError = (res, msg) => {
    const responseData = {
        status: 400,
        message: msg,
    };
    logResponse();
    return res.status(400).json(responseData);
};
exports.validationError = validationError;
const unauthorizedResponse = (res, msg) => {
    const responseData = {
        status: 401,
        message: msg,
    };
    logResponse();
    return res.status(401).json(responseData);
};
exports.unauthorizedResponse = unauthorizedResponse;
const duplicateResponse = (res, msg) => {
    const responseData = {
        status: 409,
        message: msg,
    };
    logResponse();
    return res.status(responseData.status).json(responseData);
};
exports.duplicateResponse = duplicateResponse;
const customResponse = (res, msg, data) => {
    const responseData = {
        status: 400,
        message: msg,
        data: data,
    };
    logResponse();
    return res.status(400).json(responseData);
};
exports.customResponse = customResponse;
const somethingResponse = (res) => {
    const responseData = {
        status: 400,
        message: "Something went wrong! Please try again later.",
    };
    logResponse();
    return res.status(400).json(responseData);
};
exports.somethingResponse = somethingResponse;
const logResponse = () => {
    // console.error("\x1B[36m"+JSON.stringify(responseData, null, 2)+"\x1B[39m")
    console.error("=======================================================\n");
};
