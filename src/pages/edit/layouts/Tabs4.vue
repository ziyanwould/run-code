<template>
  <Drag :number="2" dir="h" :config="[{ min: 0 }, { min: 16 }]">
    <!-- 预览 -->
    <DragItem :index="0" :disabled="true" :showTouchBar="false" title="预览">
      <Preview></Preview>
    </DragItem>
    <!-- 编辑器&控制台 -->
    <DragItem :index="1" :disabled="false">
      <Drag
        :number="2"
        dir="v"
        :config="[{ min: 0 }, { min: 48, default: 48 }]"
      >
        <!-- 编辑器 -->
        <DragItem :index="0" :disabled="true" :showTouchBar="false">
          <Editor :dir="'tabs'" ref="editorRef"></Editor>
        </DragItem>
        <!-- 控制台 -->
        <DragItem :index="1" :disabled="false" title="控制台">
          <Console></Console>
        </DragItem>
      </Drag>
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

const editorRef = ref(null)

onMounted(() => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)
})
</script>