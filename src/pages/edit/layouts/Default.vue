<template>
  <Drag
    :number="isMobile ? 2 : 3"
    dir="v"
    :config="isMobile 
      ? [{ min: 0 }, null] 
      : [{ min: 0 }, null, { min: 48, default: 48 }]"
  >
    <DragItem :index="0" :disabled="true" :showTouchBar="false">
      <Editor></Editor>
    </DragItem>
    <DragItem :index="1" :disabled="false" title="预览">
      <Preview></Preview>
    </DragItem>
    <DragItem v-if="!isMobile" :index="2" :disabled="false" title="控制台">
      <Console></Console>
    </DragItem>
  </Drag>
</template>

<script setup>
import Editor from '@/components/Editor.vue'
import Preview from '@/components/Preview.vue'
import Console from '@/components/Console.vue'
import Drag from '@/components/Drag.vue'
import DragItem from '@/components/DragItem.vue'
import { isMobileDevice } from '@/utils'

const isMobile = isMobileDevice()
</script>
