"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAccountByEmail = exports.findAccountById = exports.insertAccount = exports.account = void 0;
const database_1 = require("~services/database");
exports.account = database_1.db.collection("accounts");
async function insertAccount(document) {
    await exports.account.insertOne(document);
}
exports.insertAccount = insertAccount;
async function findAccountById(id) {
    return exports.account.findOne({ id });
}
exports.findAccountById = findAccountById;
async function findAccountByEmail(email) {
    return exports.account.findOne({ email });
}
exports.findAccountByEmail = findAccountByEmail;
