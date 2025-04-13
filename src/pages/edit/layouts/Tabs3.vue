<template>
  <Drag :number="2" dir="h" :config="[{ min: 200 }, { min: 20 }]">
    <!-- 编辑器&控制台 -->
    <DragItem :index="0" :disabled="true" :showTouchBar="false">
      <Drag
        :number="isMobile ? 1 : 2"
        dir="v"
        :config="isMobile 
          ? [{ min: 0 }] 
          : [{ min: 0 }, { min: 48, default: 48 }]"
      >
        <!-- 编辑器 -->
        <DragItem :index="0" :disabled="true" :showTouchBar="false">
          <Editor :dir="'tabs'" ref="editorRef"></Editor>
        </DragItem>
        <!-- 控制台 -->
        <DragItem v-if="!isMobile" :index="1" :disabled="false" title="控制台">
          <Console></Console>
        </DragItem>
      </Drag>
    </DragItem>
    <!-- 预览 -->
    <DragItem :index="1" :disabled="false" :showTouchBar="true">
      <Preview></Preview>
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
