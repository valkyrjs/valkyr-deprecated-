"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = exports.AccountRole = exports.IDENTITY_FLAGS = void 0;
const access_1 = require("@valkyr/access");
const crypto_1 = require("crypto");
/*
 |--------------------------------------------------------------------------------
 | Bitflags
 |--------------------------------------------------------------------------------
 */
exports.IDENTITY_FLAGS = {
    id: 1 << 0,
    name: 1 << 1,
    email: 1 << 2,
    password: 1 << 3,
    key: 1 << 4
};
/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */
class AccountRole extends access_1.Role {
    static getAttributes(flag) {
        return new access_1.Attributes(exports.IDENTITY_FLAGS, flag);
    }
    static getPermissions({ realm }) {
        return {
            realm: {
                create: realm?.create === true
            }
        };
    }
    static reduce(state, permissions) {
        return {
            realm: {
                create: permissions.realm?.create === true || state.realm.create === true
            }
        };
    }
}
exports.AccountRole = AccountRole;
exports.role = {
    owner: (accountId) => ({
        id: (0, crypto_1.randomUUID)(),
        container: accountId,
        name: "Owner",
        settings: {},
        permissions: {
            realm: {
                create: true
            }
        },
        members: [accountId]
    })
};
