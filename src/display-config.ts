#!/usr/bin/env node

import yargs from "yargs";
import { config } from "./utils/configuration";
import { setRootPath } from "./utils/pathresolver";

const args = yargs(process.argv.slice(2))
    .options({
        dir: {
            alias: 'd',
            type: 'string',
            default: '/home/mashimaro',
            description: '设置文件的位置(请保证读写权限)'
        },
    })
    .help()
    .parseSync()

setRootPath(args.dir)

console.log(config())

