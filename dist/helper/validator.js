"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMobileNumber = void 0;
const isValidMobileNumber = (number) => {
    const pattern = /^[6789]\d{9}$/;
    return pattern.test(number);
};
exports.isValidMobileNumber = isValidMobileNumber;
