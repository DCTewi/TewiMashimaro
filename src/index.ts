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
            ca: {
                type: 'string',
                default: '',
                description: 'SSL CA (chain)'
            },
            crt: {
                type: 'string',
                default: '',
                description: 'SSL证书 (cert)'
            },
            key: {
                type: 'string',
                default: '',
                description: 'SSL私钥 (key)'
            }
        })
        .help()
        .parseSync()


    let enableSSL = true
    if (args.crt == undefined || args.crt == '' || args.key == undefined || args.key == '' || args.ca == undefined || args.ca == '') {
        console.warn("SSL配置有误, 将仅开启HTTP服务器")
        enableSSL = false
    }

    const serverarg: ServerArgs = {
        dir: args.dir,
        recordLog: args.log,
        enableSSL: enableSSL,
        ca: args.ca,
        crt: args.crt,
        key: args.key,
    }

    server.deploy(serverarg)
}

main()
