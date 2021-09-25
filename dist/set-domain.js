#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const child_process_1 = require("child_process");
const server_1 = require("./server");
try {
    const url = process.argv[2];
    if (url == undefined) {
        throw "Invalid URL";
    }
    else {
        if (fs_1.default.existsSync(server_1._greenlockConfPath)) {
            fs_1.default.rmSync(server_1._greenlockConfPath, {
                recursive: true,
                force: true
            });
        }
        (0, async_1.series)([
            ok => {
                (0, child_process_1.exec)(`npx greenlock add --subject ${url} --altnames ${url}`).on('close', () => {
                    ok();
                });
            },
            () => console.log('completed.')
        ]);
    }
}
catch (err) {
    console.error(err);
}
//# sourceMappingURL=set-domain.js.map