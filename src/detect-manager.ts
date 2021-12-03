import {find, downloadTool, cacheFile} from '@actions/tool-cache'
import {exec} from '@actions/exec'
import path from 'path'
import {DETECT_VERSION} from './inputs'

const DETECT_BINARY_REPO_URL = 'https://sig-repo.synopsys.com'
export const TOOL_NAME = 'detect'

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
      .then(cachedFolder => path.resolve(cachedFolder, jarName))
  )
}

export async function runDetect(detectPath: string, detectArguments: string[]): Promise<number> {
  return exec(`java`, ['-jar', detectPath].concat(detectArguments), {ignoreReturnCode: true})
}

function createDetectDownloadUrl(repoUrl = DETECT_BINARY_REPO_URL): string {
  return `${repoUrl}/bds-integrations-release/com/synopsys/integration/synopsys-detect/${DETECT_VERSION}/synopsys-detect-${DETECT_VERSION}.jar`
}
