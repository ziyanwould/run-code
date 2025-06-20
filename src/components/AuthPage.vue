<template>
  <div class="auth-page-container">
    <div class="auth-box">
      <h2>请输入授权码</h2>
      <el-input
        v-model="inputCode"
        type="password"
        placeholder="授权码"
        show-password
        @keyup.enter="handleLogin"
      />
      <el-button type="primary" @click="handleLogin" class="login-button">
        进入
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage }
from 'element-plus';

// 预设的授权码 (后续可以考虑更安全的存储方式)
const PRESET_AUTH_CODE = 'JCR_AUTHORIZATION_CODE'; // 您可以更改这个授权码

const inputCode = ref('');
const router = useRouter();

const handleLogin = () => {
  if (inputCode.value === PRESET_AUTH_CODE) {
    sessionStorage.setItem('isAuthorized', 'true');
    router.push('/');
  } else {
    ElMessage.error('授权码错误');
    inputCode.value = ''; // 清空输入框
  }
};
</script>

<style scoped>
.auth-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5; /* 与项目整体背景色类似 */
}

.auth-box {
  width: 300px;
  padding: 30px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
}

.auth-box h2 {
  margin-bottom: 20px;
  color: #303133; /* Element Plus 默认文字颜色 */
}

.login-button {
  width: 100%;
  margin-top: 20px;
}
</style>
