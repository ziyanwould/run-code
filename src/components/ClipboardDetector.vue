<template>
  <el-dialog
    v-model="dialogVisible"
    title="检测到可用代码"
    width="400px"
    :close-on-press-escape="true"
    @keydown.enter="handleEnterKey"
  >
    <span>是否将剪贴板里的内容插入代码面板里？此操作会清空原有代码。</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertCode" ref="confirmButton">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { ElDialog, ElButton, ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance();
const store = useStore();
const dialogVisible = ref(false);
const confirmButton = ref(null);
const detectedCode = ref({
  HTML: { content: '' },
  CSS: { content: '' },
  JS: { content: '' }
});

// 处理Enter键按下事件
const handleEnterKey = (event) => {
  if (dialogVisible.value && event.key === 'Enter') {
    event.preventDefault();
    insertCode();
  }
};

// 监听键盘事件
const handleKeyDown = (event) => {
  if (!dialogVisible.value) return;
  
  if (event.key === 'Enter') {
    event.preventDefault();
    insertCode();
  } else if (event.key === 'Escape') {
    dialogVisible.value = false;
  }
};

// 正则表达式匹配代码块
const htmlRegex = /```(?:html|HTML)\s*([\s\S]*?)```/g;
const cssRegex = /```(?:css|CSS)\s*([\s\S]*?)```/g;
const jsRegex = /```(?:javascript|js|JavaScript|JS)\s*([\s\S]*?)```/g;

// 尝试从剪贴板获取文本的多种方法
const getClipboardText = async () => {
  // 方法1: 使用现代Clipboard API
  if (navigator.clipboard && navigator.clipboard.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch (err) {
      console.warn('Clipboard API读取失败，尝试其他方法:', err);
    }
  }
  
  // 方法2: 使用document.execCommand('paste')
  return new Promise((resolve) => {
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.top = '-999px';
    textArea.style.left = '-999px';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    
    textArea.focus();
    
    let success = false;
    try {
      success = document.execCommand('paste');
    } catch (err) {
      console.warn('execCommand paste 失败:', err);
    }
    
    const text = textArea.value;
    document.body.removeChild(textArea);
    
    if (success) {
      resolve(text);
    } else {
      resolve('');
    }
  });
};

// 检测剪贴板内容
const checkClipboard = async () => {
  try {
    // 尝试读取剪贴板内容
    const text = await getClipboardText();
    
    if (!text || text.trim() === '') return;
    
    // 检测是否包含代码块
    const hasHtmlCode = htmlRegex.test(text);
    htmlRegex.lastIndex = 0; // 重置正则表达式索引
    
    // 如果没有HTML代码块，不进行提示
    if (!hasHtmlCode) return;
    
    // 提取HTML代码
    let htmlMatch;
    let htmlContent = '';
    let htmlCount = 0;
    
    while ((htmlMatch = htmlRegex.exec(text)) !== null) {
      htmlCount++;
      if (htmlCount > 1) {
        // 如果有多个HTML代码块，不进行提示
        return;
      }
      htmlContent = htmlMatch[1].trim();
    }
    
    // 提取CSS代码
    let cssMatch;
    let cssContent = '';
    cssRegex.lastIndex = 0; // 重置正则表达式索引
    
    while ((cssMatch = cssRegex.exec(text)) !== null) {
      cssContent += cssMatch[1].trim() + '\n\n';
    }
    
    // 提取JavaScript代码
    let jsMatch;
    let jsContent = '';
    jsRegex.lastIndex = 0; // 重置正则表达式索引
    
    while ((jsMatch = jsRegex.exec(text)) !== null) {
      jsContent += (jsMatch[1] || jsMatch[2]).trim() + '\n\n';
    }
    
    // 如果有HTML代码，则显示对话框
    if (htmlContent) {
      detectedCode.value = {
        HTML: { content: htmlContent },
        CSS: { content: cssContent.trim() },
        JS: { content: jsContent.trim() }
      };
      dialogVisible.value = true;
    }
  } catch (err) {
    console.error('无法读取或处理剪贴板内容:', err);
  }
};

// 监听粘贴事件
const handlePaste = (event) => {
  // 如果事件包含剪贴板数据，直接从事件中获取
  if (event && event.clipboardData && event.clipboardData.getData) {
    try {
      const text = event.clipboardData.getData('text/plain');
      if (text) {
        processClipboardText(text);
        return;
      }
    } catch (err) {
      console.warn('从事件获取剪贴板数据失败:', err);
    }
  }
  
  // 回退到异步检查剪贴板
  setTimeout(checkClipboard, 100);
};

// 处理剪贴板文本
const processClipboardText = (text) => {
  if (!text || text.trim() === '') return;
  
  // 重置正则表达式索引
  htmlRegex.lastIndex = 0;
  cssRegex.lastIndex = 0;
  jsRegex.lastIndex = 0;
  
  // 检测是否包含HTML代码块
  const hasHtmlCode = htmlRegex.test(text);
  htmlRegex.lastIndex = 0;
  
  if (!hasHtmlCode) return;
  
  // 提取代码 (与checkClipboard中的逻辑相同)
  let htmlMatch;
  let htmlContent = '';
  let htmlCount = 0;
  
  while ((htmlMatch = htmlRegex.exec(text)) !== null) {
    htmlCount++;
    if (htmlCount > 1) return;
    htmlContent = htmlMatch[1].trim();
  }
  
  let cssMatch;
  let cssContent = '';
  
  while ((cssMatch = cssRegex.exec(text)) !== null) {
    cssContent += cssMatch[1].trim() + '\n\n';
  }
  
  let jsMatch;
  let jsContent = '';
  
  while ((jsMatch = jsRegex.exec(text)) !== null) {
    jsContent += (jsMatch[1] || jsMatch[2]).trim() + '\n\n';
  }
  
  if (htmlContent) {
    detectedCode.value = {
      HTML: { content: htmlContent },
      CSS: { content: cssContent.trim() },
      JS: { content: jsContent.trim() }
    };
    dialogVisible.value = true;
  }
};

onMounted(() => {
  document.addEventListener('paste', handlePaste);
  // 添加全局键盘事件监听
  document.addEventListener('keydown', handleKeyDown);
  // 页面加载时也检查一次剪贴板
  checkClipboard();
});

// 提取HTML中的标题作为名称
const extractTitleFromHTML = (htmlContent) => {
  // 尝试匹配title标签
  const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  
  // 尝试匹配h1标签
  const h1Match = htmlContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    return h1Match[1].trim();
  }
  
  // 尝试匹配h2标签
  const h2Match = htmlContent.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2Match && h2Match[1]) {
    return h2Match[1].trim();
  }
  
  // 如果都没有找到，返回默认名称
  return '未命名';
};

// 插入检测到的代码
const insertCode = () => {
  // 从HTML内容中提取标题作为名称
  const title = extractTitleFromHTML(detectedCode.value.HTML.content || '');
  
  // 检查当前布局
  const layout = store.state.editData.config.layout;
  if (layout === 'vue') {
    store.commit('setLayout', 'default');
  }
  
  // 先清空所有代码
  store.dispatch('clearAllCode').then(() => {
    // 先触发清空代码事件，确保编辑器已清空
    proxy.$eventEmitter.emit('clear_all_code');
    
    // 等待DOM更新
    setTimeout(() => {
      // 设置新内容
      const codeData = {
        title,
        // 保留原有配置，只更新代码部分
        config: { ...store.state.editData.config },
        code: {
          HTML: {
            language: 'html',
            content: detectedCode.value.HTML.content || '',
            resources: []
          },
          CSS: {
            language: 'css',
            content: detectedCode.value.CSS.content || '',
            resources: []
          },
          JS: {
            language: 'javascript',
            content: detectedCode.value.JS.content || '',
            resources: []
          },
          VUE: {
            language: 'vue2',
            content: '',
            resources: []
          }
        }
      };
      
      // 更新状态
      store.commit('setEditData', codeData);
      
      // 触发重置代码事件，确保编辑器刷新
      proxy.$eventEmitter.emit('reset_code');
      
      console.log('检测到的代码:', JSON.parse(JSON.stringify(codeData)));
      
      ElMessage.success(`代码"${title}"已成功插入`);
      dialogVisible.value = false;
    }, 100); // 给予足够的时间让清空操作完成
  }).catch(error => {
    console.error('插入代码失败:', error);
    ElMessage.error('插入代码失败');
    dialogVisible.value = false;
  });
};

onUnmounted(() => {
  document.removeEventListener('paste', handlePaste);
  // 移除全局键盘事件监听
  document.removeEventListener('keydown', handleKeyDown);
});
</script>