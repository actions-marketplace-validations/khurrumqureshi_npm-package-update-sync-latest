import * as core from '@actions/core'
import { readFileSync, writeFileSync } from "fs"
import { NpmOutdatedPackage } from "./npm-command-manager"

export class PackageJsonUpdater {
    private packageJson: string

    constructor(packageJson: string) {
        this.packageJson = packageJson
    }

    async updatePackageJson(outdated: NpmOutdatedPackage[]): Promise<void> {
        const packageJsonContent = readFileSync(this.packageJson, 'utf8')
        const packageJsonObject = JSON.parse(packageJsonContent)
        for (const outdatedPackage of outdated) {
            core.info(`${outdatedPackage.name} is ${outdatedPackage.current} wanting ${outdatedPackage.latest}`)
            if (packageJsonObject.dependencies && packageJsonObject.dependencies[outdatedPackage.name]) {
                packageJsonObject.dependencies[outdatedPackage.name] = `${outdatedPackage.latest}`
            } else if (packageJsonObject.devDependencies && packageJsonObject.devDependencies[outdatedPackage.name]) {
                packageJsonObject.devDependencies[outdatedPackage.name] = `${outdatedPackage.latest}`
            }
        }
        writeFileSync(this.packageJson, JSON.stringify(packageJsonObject, null, 2))
    }
}
