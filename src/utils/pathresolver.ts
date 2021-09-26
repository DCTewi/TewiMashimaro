import path from "path"

let __root_dir = path.resolve('.')

export const resolvedPath = (relativePath: string): string => {
    return path.resolve(__root_dir, relativePath)
}

export const setRootPath = (dir: string) => {
    __root_dir = dir
} 
