const series = require("async").series
const exec = require("child_process").exec
const fs = require("fs")

const packageJsonBackup = fs.readFileSync('package.json')

let packageJson = JSON.parse(packageJsonBackup)
delete packageJson.publishConfig

fs.writeFileSync('package.json', JSON.stringify(packageJson))
fs.renameSync('.npmrc', '.npmrc_bak')

series([
    ok => {
        exec("npm publish").on('close', () => {
            ok()
        })
    },
    () => {
        fs.renameSync('.npmrc_bak', '.npmrc')
        fs.writeFileSync('package.json', packageJsonBackup)
    }
])
