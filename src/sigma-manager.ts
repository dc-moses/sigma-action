import {find, downloadTool, cacheFile} from '@actions/tool-cache'
import {debug, info, warning} from '@actions/core'
import {exec} from '@actions/exec'
import path from 'path'
import {DETECT_VERSION} from './inputs'

const fs = require('fs');

const SIGMA_BINARY_REPO_URL = 'https://sig-repo.synopsys.com/artifactory/sigma-release-trial/latest'
export const TOOL_NAME = 'sigma'
export const SIGMA_VERSION = "0.1"

/*
export async function findOrDownloadDetect(): Promise<string> {
  const jarName = `synopsys-detect-${DETECT_VERSION}.jar`

  const cachedDetect = find(TOOL_NAME, DETECT_VERSION)
  if (cachedDetect) {
    return path.resolve(cachedDetect, jarName)
  }

  const detectDownloadUrl = createDetectDownloadUrl()

  return (
    downloadTool(detectDownloadUrl)
      .then(detectDownloadPath => cacheFile(detectDownloadPath, jarName, TOOL_NAME, DETECT_VERSION))
      //TODO: Jarsigner?
      .then(cachedFolder => path.resolve(cachedFolder, jarName)
      )
  )
}
*/
export async function findOrDownloadSigma(): Promise<string> {
  const binaryName = `sigma-linux_x86_64`

  const cachedSigma = find(TOOL_NAME, SIGMA_VERSION)
  if (cachedSigma) {
    return path.resolve(cachedSigma, binaryName)
  }

  const sigmaDownloadUrl = createSigmaDownloadUrl(SIGMA_BINARY_REPO_URL, binaryName)

  info(`Downloading: ` + sigmaDownloadUrl)

  return (
    downloadTool(sigmaDownloadUrl)
      .then(sigmaDownloadPath => cacheFile(sigmaDownloadPath, binaryName, TOOL_NAME, SIGMA_VERSION))
      //TODO: Jarsigner?
      .then(cachedFolder => path.resolve(cachedFolder, binaryName))
  )
}

export async function runDetect(detectPath: string, detectArguments: string[]): Promise<number> {
  info(`Will exeute java with ` + detectPath)

  return fs.chmod(detectPath, 0o555, () => {
    return exec(sigmaPath, ['analyze', '--format github', '.'], {ignoreReturnCode: true})
    });
}

function createSigmaDownloadUrl(repoUrl = SIGMA_BINARY_REPO_URL, binaryName: string): string {
  return `${repoUrl}/${binaryName}`
}