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
            cert: {
                alias: 'c',
                type: 'string',
                default: '',
                description: 'SSL证书(.crt文件路径)'
            },
            key: {
                alias: 'k',
                type: 'string',
                default: '',
                description: 'SSL私钥(.key文件路径)'
            }
        })
        .help()
        .parseSync()


    let useSSL = true
    if (args.cert == undefined || args.cert == '' || args.key == undefined || args.key == '') {
        console.warn("SSL配置有误, 将仅开启HTTP服务器")
        useSSL = false
    }

    const serverarg: ServerArgs = {
        dir: args.dir,
        recordLog: args.log,
        useSSL: useSSL,
        cert: args.cert,
        key: args.key
    }

    server.deploy(serverarg)
}

main()
