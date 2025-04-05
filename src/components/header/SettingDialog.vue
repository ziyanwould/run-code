<template>
  <el-dialog
    custom-class="settingDialog"
    title="设置"
    :width="600"
    v-model="visible"
  >
    <div class="settingBox">
      <el-tabs tab-position="left" v-model="settingType">
        <el-tab-pane label="布局设置" name="layout"></el-tab-pane>
        <el-tab-pane label="主题设置" name="theme"></el-tab-pane>
        <el-tab-pane label="其他设置" name="setting"></el-tab-pane>
        <el-tab-pane label="关于" name="about"></el-tab-pane>
      </el-tabs>
      <div class="settingContent">
        <component :is="componentsMap[settingType]"></component>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { ElDialog, ElTabs, ElTabPane } from 'element-plus'
import Setting from '../Setting.vue'
import SettingLayout from '../SettingLayout.vue'
import SettingTheme from '../SettingTheme.vue'
import SettingAbout from '../SettingAbout.vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const settingType = ref('layout')
const componentsMap = shallowRef({
  theme: SettingTheme,
  layout: SettingLayout,
  setting: Setting,
  about: SettingAbout
})
</script>

<style scoped lang="less">
.settingBox {
  display: flex;

  :deep(.el-tabs) {
    flex-grow: 0;
    flex-shrink: 0;
    
    .el-tabs__item {
      color: var(--dropdown-color);
      
      &.is-active {
        color: var(--header-btn-color);
      }
      
      &:hover {
        color: var(--dropdown-hover-color);
      }
    }
    
    .el-tabs__nav-wrap::after {
      background-color: var(--editor-header-border-bottom-color);
    }
  }

  .settingContent {
    flex: 1;
    height: 300px;
    overflow: auto;
    padding: 0 15px;
    color: var(--dropdown-color);
    margin-left: 0px;
  }
}
</style>