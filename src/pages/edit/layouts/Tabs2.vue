<template>
  <Drag
    :number="isMobile ? 2 : 3"
    dir="v"
    :config="isMobile 
      ? [{ min: 0 }, { min: 20 }] 
      : [{ min: 0 }, { min: 48 }, { min: 48, default: 48 }]"
  >
    <!-- 预览 -->
    <DragItem :index="0" :disabled="true" :showTouchBar="false" title="预览">
      <Preview></Preview>
    </DragItem>
    <!-- 编辑器 -->
    <DragItem :index="1" :disabled="false">
      <Editor :dir="'tabs'" ref="editorRef"></Editor>
    </DragItem>
    <!-- 控制台 - 仅在非移动设备显示 -->
    <DragItem v-if="!isMobile" :index="2" :disabled="false" title="控制台">
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
import { isMobileDevice } from '@/utils'

const isMobile = isMobileDevice()
const editorRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
})
</script>
