"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRootPath = exports.resolvedPath = void 0;
const path_1 = __importDefault(require("path"));
let __root_dir = path_1.default.resolve('.');
const resolvedPath = (relativePath) => {
    return path_1.default.resolve(__root_dir, relativePath);
};
exports.resolvedPath = resolvedPath;
const setRootPath = (dir) => {
    __root_dir = dir;
};
exports.setRootPath = setRootPath;
//# sourceMappingURL=pathresolver.js.map