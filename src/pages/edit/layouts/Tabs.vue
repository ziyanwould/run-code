<template>
  <Drag
    :number="3"
    dir="v"
    :config="[{ min: 200 }, null, { min: 48, default: 48 }]"
  >
    <DragItem :index="0" :disabled="true" :showTouchBar="false">
      <Editor :dir="'tabs'" ref="editorRef"></Editor>
    </DragItem>
    <DragItem :index="1" :disabled="false" title="预览">
      <Preview></Preview>
    </DragItem>
    <DragItem :index="2" :disabled="false" title="控制台">
      <Console></Console>
    </DragItem>
  </Drag>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Editor from '@/components/Editor.vue'
import Preview from '@/components/Preview.vue'
import Console from '@/components/Console.vue'
import Drag from '@/components/Drag.vue'
import DragItem from '@/components/DragItem.vue'

// 获取编辑器引用
const editorRef = ref(null)

// 组件挂载后，确保编辑器正确布局
onMounted(() => {
  // 触发一次窗口resize事件，确保所有组件都能正确计算尺寸
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
})
</script>