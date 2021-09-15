import { info } from "@actions/core"
import { readdirSync, statSync } from "fs"
import { join } from "path"

export const getAllProjects = async (
    rootFolder: string,
    recursive: boolean,
    ignoreFolders: string[] = [],
    result: string[] = [],
    accumulator: number = 0
): Promise<string[]> => {
    if (recursive) {
        const files: string[] = readdirSync(rootFolder)
        const regex = /package.json$/
        for (const fileName of files) {
            const file = join(rootFolder, fileName)
            if (statSync(file).isDirectory()) {
                if (!folderInIgnoreList(file, ignoreFolders) && accumulator <= 2) {
                    try {
                        result = await getAllProjects(file, recursive, ignoreFolders, result, accumulator++)
                    } catch (error) {
                        continue
                    }
                } else {
                    continue
                }
            } else {
                if (regex.test(file)) {
                    info(`module found : ${file}`)
                    result.push(rootFolder)
                }
            }
        }
        return result
    } else {
        return [rootFolder]
    }
}

const folderInIgnoreList = (folder: string, ignoreFolders: string[]): boolean => {
    return ignoreFolders.indexOf(folder) !== -1
}
