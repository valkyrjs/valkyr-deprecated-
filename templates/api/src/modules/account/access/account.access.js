"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.access = void 0;
const access_1 = require("~services/access");
const account_role_1 = require("./account.role");
class AccountAccess extends access_1.AccessService {
    #permissions = {
        realm: {
            create: false
        }
    };
    reduce(roles) {
        return roles.reduce((state, { permissions }) => account_role_1.AccountRole.reduce(state, permissions), this.#permissions);
    }
    async createOwnerRole(accountId) {
        await this.addRole(accountId, account_role_1.role.owner(accountId));
    }
}
exports.access = new AccountAccess();
