"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const configuration_1 = require("../utils/configuration");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('', (req, res) => {
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