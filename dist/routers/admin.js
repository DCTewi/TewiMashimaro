"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
exports.adminRouter = (0, express_1.Router)();
exports.adminRouter.get('/', (req, res) => {
    res.send('GET admin');
});
//# sourceMappingURL=admin.js.map