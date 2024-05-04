"use strict";
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
exports.getUserById = exports.isUserValid = exports.register = void 0;
const database_1 = require("../database");
// Register a new user
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, database_1.connect)();
        const sql = `
      INSERT INTO Users ("name", "mobile", "password", "role", "createddate")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [
            user.name,
            user.mobile,
            user.password,
            user.role,
            new Date(),
        ];
        const { rows } = yield client.query(sql, values);
        yield client.release();
        return rows;
    }
    catch (error) {
        console.error("Error while registering user:", error);
        throw error;
    }
});
exports.register = register;
// Check if user is valid by mobile number
const isUserValid = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, database_1.connect)();
        const sql = `
      SELECT * FROM Users WHERE "mobile" = $1;
    `;
        const values = [user.mobile];
        const { rows } = yield client.query(sql, values);
        yield client.release();
        return rows;
    }
    catch (error) {
        console.error("Error while checking user validity:", error);
        throw error;
    }
});
exports.isUserValid = isUserValid;
// Get user by ID
const getUserById = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, database_1.connect)();
        const sql = `
      SELECT * FROM Users WHERE "id" = $1;
    `;
        const values = [user.userId];
        const { rows } = yield client.query(sql, values);
        yield client.release();
        return rows;
    }
    catch (error) {
        console.error("Error while fetching user by ID:", error);
        throw error;
    }
});
exports.getUserById = getUserById;
