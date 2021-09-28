#!/usr/bin/env node

import yargs, { boolean } from "yargs";
import { server, ServerArgs } from "./server";

const main = () => {
    const args = yargs(process.argv.slice(2))
        .options({
            dir: {
                alias: 'd',
                type: 'string',
                demandOption: true,
                description: '棉花糖的启动位置(请保证读写权限)'
            },
            log: {
                alias: 'l',
                type: 'boolean',
                default: true,
                description: '是否记录访问日志'
            },
            ssl: {
                type: 'boolean',
                default: false,
                description: '是否启用了SSL'
            },
            port: {
                type: 'number',
                default: 3000,
                description: '监听端口'
            }
        })
        .help()
        .parseSync()

    const serverarg: ServerArgs = {
        dir: args.dir,
        recordLog: args.log,
        enableSSL: args.ssl,
        port: args.port
    }

    server.deploy(serverarg)
}

main()
