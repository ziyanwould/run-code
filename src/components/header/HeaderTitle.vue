<template>
  <div class="center">
    <input 
      type="text" 
      :value="codeTitle" 
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const codeTitle = computed(() => store.state.editData.title)

const handleInput = (e) => {
  const value = e.target.value
  store.commit('setCodeTitle', value)
}

const handleChange = (e) => {
  const value = e.target.value
  nextTick(() => {
    store.commit('setCodeTitle', value)
  })
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
