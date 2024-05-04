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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUpInputChecks = exports.signUp = exports.generateAuthToken = exports.isAuth = void 0;
const jwt_1 = require("../../controllers/auth/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const userService = __importStar(require("../../services/user"));
const validator_1 = require("../../helper/validator");
const constants_1 = require("../../constants");
//JWT Token Verification
const isAuth = (request, response, next) => {
    const authHeader = request.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return apiResponse.unauthorizedResponse(response, "Unauthorized");
    }
    request.body.token = token;
    (0, jwt_1.verifyToken)(token, process.env.AUTHTOKEN_SECRETKEY || "%4gdeefw3FEWFE$%@#$")
        .then((res) => {
        if (!res.exp)
            throw {};
        request.body.mobile = res.mobile;
        return next();
    })
        .catch((err) => {
        return apiResponse.unauthorizedResponse(response, "Unauthorized");
    });
};
exports.isAuth = isAuth;
//Generate JWT Token
const generateAuthToken = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const minutes = 100000;
        const expirationTime = Math.floor(Date.now() / 1000) + minutes * 60;
        const payload = { mobile: request.body.mobile };
        const token = (0, jwt_1.generateToken)(payload, process.env.AUTHTOKEN_SECRETKEY || "%4gdeefw3FEWFE$%@#$", expirationTime);
        request.body.token = token;
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.generateAuthToken = generateAuthToken;
const signUp = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, mobile, password, role } = request.body;
        //Hash the password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        const userData = {
            name,
            mobile,
            password: hashPassword,
            role,
        };
        const register = yield userService.register(userData);
        return apiResponse.successResponse(response, "user registered successfully");
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.signUp = signUp;
const signUpInputChecks = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, mobile, password, role } = request.body;
        const userData = {
            name,
            mobile,
            password,
            role,
        };
        //registration fields checks
        if (!name)
            return apiResponse.validationError(response, "Please provide user name");
        if (!mobile)
            return apiResponse.validationError(response, "Please provide mobile number");
        if (!password)
            return apiResponse.validationError(response, "Please provide password");
        if (!role)
            return apiResponse.validationError(response, "Please provide role");
        //registration fields validation
        if (!(0, validator_1.isValidMobileNumber)(mobile))
            return apiResponse.validationError(response, "Invalid mobile number");
        if (role != constants_1.userRole.ADMIN && role != constants_1.userRole.USER)
            return apiResponse.validationError(response, "Invalid role");
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.signUpInputChecks = signUpInputChecks;
const signIn = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { mobile, password } = request.body;
        //Field validation
        if (!mobile)
            return apiResponse.validationError(response, "Please provide mobile number");
        if (!password)
            return apiResponse.validationError(response, "Please provide password");
        if (!(0, validator_1.isValidMobileNumber)(mobile))
            return apiResponse.validationError(response, "Invalid mobile number");
        //Fetch user details
        const getUser = yield userService.isUserValid({ mobile });
        if (getUser.length == 0)
            return apiResponse.notFoundResponse(response, "User not found!");
        //Password validation
        const dbUser = getUser[0];
        const dbPassword = dbUser.password;
        const isCorrect = yield bcryptjs_1.default.compare(password, dbPassword);
        if (!isCorrect) {
            return apiResponse.unauthorizedResponse(response, "Incorrect password!");
        }
        // Password is correct
        // Login successful & generate token
        return next();
    }
    catch (error) {
        return apiResponse.somethingResponse(response);
    }
});
exports.signIn = signIn;
