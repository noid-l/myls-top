import { rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const distDir = resolve(rootDir, 'docs/.vitepress/dist')

console.log('🧹 清理构建产物...')

try {
  rmSync(distDir, { recursive: true, force: true })
  console.log('✅ 构建产物已清理')
} catch (error) {
  // 目录不存在，忽略错误
  console.log('ℹ️  构建产物目录不存在')
}
