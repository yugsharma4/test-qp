"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserIdValid = exports.get = exports.isUserValid = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const userService = __importStar(require("../../services/user"));
const isUserValid = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield userService.isUserValid({
            mobile: request.body.mobile,
        });
        if (isUserExist.length > 0)
            return apiResponse.duplicateResponse(response, "User already exist");
        return next();
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.isUserValid = isUserValid;
const get = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield userService.isUserValid({
            mobile: request.body.mobile,
        });
        if (isUserExist.length == 0)
            return apiResponse.duplicateResponse(response, "User not found!");
        request.body.user = isUserExist[0];
        return next();
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.get = get;
const isUserIdValid = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield userService.getUserById({
            userId: request.body.userId,
        });
        if (isUserExist.length == 0)
            return apiResponse.duplicateResponse(response, "Invalid User ID");
        return next();
    }
    catch (error) {
        return apiResponse.ErrorResponse(response, error);
    }
});
exports.isUserIdValid = isUserIdValid;
