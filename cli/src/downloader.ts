import { downloadTemplate as gigetDownload } from 'giget'

// Template repository configuration
const REPO_OWNER = 'preschian'
const REPO_NAME = 'create-dot-app'
const REPO_BRANCH = 'main'

/**
 * Downloads a template from the repository using giget
 * @param options - Download configuration
 * @param options.template - Template name (e.g., 'next')
 * @param options.targetName - Target directory name
 */
export async function downloadTemplate({ template = 'next', targetName = '.' }): Promise<void> {
  const source = `github:${REPO_OWNER}/${REPO_NAME}/templates/${template}#${REPO_BRANCH}`

  await gigetDownload(source, { dir: targetName, force: true })
}
