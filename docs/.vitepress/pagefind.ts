import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const EXCLUDE_SELECTORS = 'header,.VPLocalNav,.VPFooter,.VPFooter *,img[alt="公安备案"]'

export function generatePagefind(outDir: string) {
  try {
    execFileSync('pagefind', [
      '--site', outDir,
      '--output-path', resolve(outDir, 'pagefind'),
      '--exclude-selectors', EXCLUDE_SELECTORS,
    ], { stdio: 'inherit' })
  } catch (error) {
    console.error('Pagefind index generation failed:', error instanceof Error ? error.message : error)
  }
}
