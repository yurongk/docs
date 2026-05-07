#!/usr/bin/env node
/**
 * 更新英文版本 MDX 文件中的 title 字段
 * 
 * 功能：
 * 1. 递归遍历 en 目录下的所有 MDX 文件
 * 2. 检查 frontmatter 中的 title 字段是否包含中文
 * 3. 如果包含中文，根据映射表或文件名转换为英文
 * 
 * 使用方法：
 *   node scripts/update-english-titles.mjs --dry-run
 *   node scripts/update-english-titles.mjs --write
 */

import fs from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const isDryRun = argv.includes("--dry-run") || !argv.includes("--write");
const TARGET_DIR = "en";

// 支持的 Markdown 文件扩展名
const MARKDOWN_EXTS = new Set([".md", ".mdx"]);

/**
 * 标题映射表：中文标题 -> 英文标题
 */
const TITLE_MAPPING = {
  // Agent Middleware
  "智能体中间件": "Agent Middleware",
  "内置中间件": "Built-in Middleware",
  "自定义中间件": "Custom Middleware",
  
  // Agent
  "对话日志": "Conversation Logs",
  "开发接口": "Development API",
  "数字专家": "Agent",
  "嵌入网页": "Embed Webpage",
  "增强功能": "Enhanced Features",
  "环境变量": "Environment Variables",
  "专家配置": "Expert Configuration",
  "人机协同": "Human-AI Collaboration",
  "长期记忆": "Long-term Memory",
  "监测仪表盘": "Monitoring Dashboard",
  "多智能体架构": "Multi-Agent Architecture",
  "发布版本": "Release Version",
  "监督型架构": "Supervised Architecture",
  "蜂群型架构": "Swarm Architecture",
  
  // AI Assistant
  "AI 助手": "AI Assistant",
  "命令": "Commands",
  "配置 AI 提供商": "Configure AI Provider",
  "角色": "Role",
  
  // Conversation
  "对话": "Conversation",
  "项目": "Projects",
  
  // Knowledge Base
  "知识库": "Knowledge Base",
  "API": "API",
  "连接外部知识库": "Connect External Knowledge Base",
  "知识库功能": "Knowledge Base Features",
  "维护文档": "Maintain Documents",
  "召回测试": "Recall Test",
  "知识库使用方式": "Ways to Use Knowledge Base",
  "通过流水线创建知识库": "Create Knowledge Base Via Pipeline",
  
  // Plugin Development
  "插件开发": "Plugin Development",
  "核心概念": "Core Concepts",
  "开发步骤": "Development Steps",
  "概述": "Overview",
  "权限设计指南": "Permission Design Guide",
  "发布和使用": "Publish and Use",
  "Schema UI 扩展": "Schema UI Extension",
  "飞书文档示例": "Feishu Document Example",
  
  // Toolset
  "工具集": "Toolset",
  "内置工具集": "Built-in Toolset",
  "自定义工具集": "Custom Toolset",
  "飞书": "Feishu",
  "规划任务": "Planning Tasks",
  "定时任务": "Scheduled Tasks",
  "BI 工具集": "BI Toolset",
  "ChatBI 工具集": "ChatBI Toolset",
  "MCP 工具": "MCP Tools",
  "虚拟环境": "Virtual Environment",
  
  // Troubleshooting
  "故障排查": "Troubleshooting",
  "错误": "Errors",
  
  // Tutorial
  "教程": "Tutorial",
  
  // Workflow
  "工作流": "Workflow",
  
  // 添加更多映射...
};

/**
 * 检测文本中是否包含中文
 */
function containsChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text);
}

/**
 * 解析 frontmatter
 */
function parseFrontmatter(content) {
  if (!content.startsWith("---")) {
    return { frontmatter: null, body: content };
  }

  const endIndex = content.indexOf("---", 3);
  if (endIndex === -1) {
    return { frontmatter: null, body: content };
  }

  const frontmatterText = content.slice(3, endIndex).trim();
  const body = content.slice(endIndex + 3).trimStart();

  // 简单的 YAML 解析（只处理 title）
  const titleMatch = frontmatterText.match(/^title:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim().replace(/^["']|["']$/g, "") : null;

  return { frontmatter: { title }, body, frontmatterText, endIndex };
}

/**
 * 根据文件名生成英文标题
 */
function generateEnglishTitleFromFilename(filePath) {
  const basename = path.basename(filePath, path.extname(filePath));
  // 将 kebab-case 或 snake_case 转换为 Title Case
  return basename
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * 更新 frontmatter 中的 title
 */
function updateFrontmatterTitle(content, newTitle) {
  const { frontmatter, body, frontmatterText, endIndex } = parseFrontmatter(content);
  
  if (!frontmatter) {
    // 如果没有 frontmatter，添加一个
    return `---\ntitle: ${newTitle}\n---\n\n${content}`;
  }

  // 替换 title 字段
  const updatedFrontmatter = frontmatterText.replace(
    /^title:\s*.+$/m,
    `title: ${newTitle}`
  );

  return `---\n${updatedFrontmatter}\n---\n${body}`;
}

/**
 * 处理单个文件
 */
async function processFile(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const { frontmatter } = parseFrontmatter(content);

  if (!frontmatter || !frontmatter.title) {
    return { filePath, changed: false, reason: "No title found" };
  }

  const currentTitle = frontmatter.title;

  // 如果标题已经是英文（不包含中文），跳过
  if (!containsChinese(currentTitle)) {
    return { filePath, changed: false, reason: "Title is already in English" };
  }

  // 查找映射表
  let newTitle = TITLE_MAPPING[currentTitle];

  // 如果映射表中没有，根据文件名生成
  if (!newTitle) {
    newTitle = generateEnglishTitleFromFilename(filePath);
    console.warn(`⚠️  未找到映射，使用文件名生成: "${currentTitle}" -> "${newTitle}"`);
  }

  const updatedContent = updateFrontmatterTitle(content, newTitle);

  return {
    filePath,
    changed: true,
    oldTitle: currentTitle,
    newTitle,
    updatedContent,
  };
}

/**
 * 递归遍历目录，收集所有需要处理的文件
 */
async function collectFiles(dirPath) {
  const files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (MARKDOWN_EXTS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * 主函数
 */
async function main() {
  const targetDir = path.resolve(TARGET_DIR);
  console.log(`📁 扫描目录: ${targetDir}`);

  const files = await collectFiles(targetDir);
  console.log(`📄 找到 ${files.length} 个文件\n`);

  const results = [];
  for (const file of files) {
    try {
      const result = await processFile(file);
      results.push(result);

      if (result.changed) {
        const relPath = path.relative(process.cwd(), file);
        console.log(`✅ ${relPath}`);
        console.log(`   旧标题: "${result.oldTitle}"`);
        console.log(`   新标题: "${result.newTitle}"\n`);
      }
    } catch (error) {
      console.error(`❌ 处理文件失败: ${file}`, error.message);
    }
  }

  const changedFiles = results.filter((r) => r.changed);
  console.log(`\n📊 统计:`);
  console.log(`   总文件数: ${files.length}`);
  console.log(`   需要更新: ${changedFiles.length}`);
  console.log(`   无需更新: ${files.length - changedFiles.length}`);

  if (isDryRun) {
    console.log(`\n🔍 这是预览模式，使用 --write 来实际更新文件`);
  } else if (changedFiles.length > 0) {
    console.log(`\n💾 正在更新文件...`);
    for (const result of changedFiles) {
      await fs.writeFile(result.filePath, result.updatedContent, "utf8");
    }
    console.log(`✅ 已更新 ${changedFiles.length} 个文件`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
