"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const configuration_1 = require("../utils/configuration");
const chalk_1 = __importDefault(require("chalk"));
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('', (req, res) => {
    console.log(`[GET] ${chalk_1.default.green(req.url)} from ${chalk_1.default.yellow(req.ip)}`);
    const userKey = req.query.key;
    if (userKey != undefined && userKey.trim() == (0, configuration_1.config)().adminKey) {
        // valid
        res.send('hello admin');
    }
    else {
        res.redirect('/');
    }
});
//# sourceMappingURL=admin.js.map