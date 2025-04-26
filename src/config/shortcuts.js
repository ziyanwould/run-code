// 判断是否为 Mac 系统
const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

// 获取修饰键显示文本
const getModifierText = (shortcut) => {
  const modifiers = []
  
  if (shortcut.modifier) {
    modifiers.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) {
    modifiers.push(isMac ? '⇧' : 'Shift')
  }
  if (shortcut.alt) {
    modifiers.push(isMac ? '⌥' : 'Alt')
  }
  
  return modifiers.join(' + ')
}

// 生成快捷键描述
const createDescription = (shortcut) => {
  const modifierText = getModifierText(shortcut)
  const keyText = shortcut.key.toUpperCase()
  return `${modifierText} + ${keyText}`
}

// 快捷键配置
export const shortcuts = [
  {
    id: 'save',
    name: '保存',
    key: 's',
    modifier: isMac ? 'meta' : 'ctrl',
    shift: false,
    alt: false,
    description: `保存 (${createDescription({
      key: 's',
      modifier: true
    })})`,
    event: 'shortcut_save'
  },
  {
    id: 'saveAsNew',
    name: '另存为副本',
    key: 's',
    modifier: isMac ? 'meta' : 'ctrl',
    shift: true,
    alt: false,
    description: `另存为副本 (${createDescription({
      key: 's',
      modifier: true,
      shift: true
    })})`,
    event: 'shortcut_save_as_new'
  },
  {
    id: 'newProject',
    name: '新建项目',
    key: 'o',
    modifier: isMac ? 'meta' : 'ctrl',
    description: `新建项目 (${createDescription({
      key: 'o',
      modifier: true
    })})`,
    event: 'shortcut_new_project'
  },
  {
    id: 'newWindow',
    name: '新开窗口',
    key: 'b',
    modifier: isMac ? 'meta' : 'ctrl',
    description: `新开窗口 (${createDescription({
      key: 'b',
      modifier: true
    })})`,
    event: 'shortcut_new_window'
  },
  {
    id: 'previewInNewWindow',
    name: '新窗预览',
    key: 'p',
    modifier: isMac ? 'meta' : 'ctrl',
    description: `新窗预览 (${createDescription({
      key: 'p',
      modifier: true
    })})`,
    event: 'shortcut_preview_window'
  }
]

// 快捷键处理器
export const createShortcutHandler = (eventEmitter) => {
  return (e) => {
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

    for (const shortcut of shortcuts) {
      // 检查按键是否匹配
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
      // 检查修饰键是否匹配
      const modifierMatch = cmdOrCtrl === true
      // 检查 Shift 键状态是否匹配
      const shiftMatch = e.shiftKey === !!shortcut.shift
      // 检查 Alt 键状态是否匹配
      const altMatch = e.altKey === !!shortcut.alt

      // 所有条件都必须完全匹配
      if (keyMatch && modifierMatch && shiftMatch && altMatch) {
        console.log('shortcut match', shortcut)

        e.preventDefault()
        e.stopPropagation()

        if (shortcut.event) {
          eventEmitter.emit(shortcut.event)
        } else if (shortcut.handler) {
          shortcut.handler()
        }
        return
      }
    }
  }
}
