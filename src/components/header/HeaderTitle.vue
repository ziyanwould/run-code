<template>
  <div class="center">
    <input type="text" :value="codeTitle" @input="onCodeTitleInput" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const codeTitle = computed(() => {
  return store.state.editData.title
})
const onCodeTitleInput = e => {
  store.commit('setCodeTitle', e.target.value)
}
</script>

<style scoped lang="less">
.center {
  flex-grow: 1;
  height: 100%;

  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    text-align: center;
    color: var(--header-btn-color);
    font-size: 18px;
  }
}
</style>