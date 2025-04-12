/**
 * 写入内容到剪贴板
 * @param {string} text - 要写入剪贴板的文本
 * @returns {Promise<boolean>} 是否写入成功
 */
export const writeToClipboard = async (text) => {
  // 方法1: 使用现代Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (err) {
      console.warn('Clipboard API写入失败，尝试其他方法:', err)
    }
  }
  
  // 方法2: 使用document.execCommand('copy')
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    
    // 设置样式使文本域不可见
    textArea.style.position = 'fixed'
    textArea.style.top = '-999px'
    textArea.style.left = '-999px'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    
    document.body.appendChild(textArea)
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (success) {
      return true
    }
    console.warn('execCommand copy 失败')
  } catch (err) {
    console.warn('execCommand copy 出错:', err)
  }
  
  return false
}

/**
 * 从剪贴板读取内容
 * @returns {Promise<string>} 剪贴板中的文本内容
 */
export const getClipboardText = async () => {
  // 方法1: 使用现代Clipboard API
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      return await navigator.clipboard.readText()
    } catch (err) {
      console.warn('Clipboard API读取失败，尝试其他方法:', err)
    }
  }
  
  // 方法2: 使用document.execCommand('paste')
  return new Promise((resolve) => {
    const textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = '-999px'
    textArea.style.left = '-999px'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    document.body.appendChild(textArea)
    
    textArea.focus()
    
    let success = false
    try {
      success = document.execCommand('paste')
    } catch (err) {
      console.warn('execCommand paste 失败:', err)
    }
    
    const text = textArea.value
    document.body.removeChild(textArea)
    
    if (success) {
      resolve(text)
    } else {
      resolve('')
    }
  })
}

/**
 * 清空剪贴板内容
 * @returns {Promise<boolean>} 是否清空成功
 */
export const clearClipboard = async () => {
  return await writeToClipboard('')
}
