// 代码块检测相关的正则表达式和工具函数
export const useCodeBlockDetection = () => {
  const htmlRegex = /```(?:html|HTML)\s*([\s\S]*?)```/g
  const cssRegex = /```(?:css|CSS)\s*([\s\S]*?)```/g
  const jsRegex = /```(?:javascript|js|JavaScript|JS)\s*([\s\S]*?)```/g

  const extractCodeBlocks = (text) => {
    // 重置正则表达式索引
    htmlRegex.lastIndex = 0
    cssRegex.lastIndex = 0
    jsRegex.lastIndex = 0

    let htmlContent = ''
    let cssContent = ''
    let jsContent = ''
    let htmlCount = 0

    // 提取HTML代码
    let htmlMatch
    while ((htmlMatch = htmlRegex.exec(text)) !== null) {
      htmlCount++
      if (htmlCount > 1) return null
      htmlContent = htmlMatch[1] ? htmlMatch[1].trim() : ''
    }

    // 提取CSS代码
    let cssMatch
    while ((cssMatch = cssRegex.exec(text)) !== null) {
      cssContent += (cssMatch[1] ? cssMatch[1].trim() : '') + '\n\n'
    }

    // 提取JavaScript代码
    let jsMatch
    while ((jsMatch = jsRegex.exec(text)) !== null) {
      jsContent += (jsMatch[1] ? jsMatch[1].trim() : '') + '\n\n'
    }

    return {
      HTML: { content: htmlContent },
      CSS: { content: cssContent.trim() },
      JS: { content: jsContent.trim() }
    }
  }

  return {
    htmlRegex,
    cssRegex,
    jsRegex,
    extractCodeBlocks
  }
}