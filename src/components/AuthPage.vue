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
import { ElMessage, ElButton, ElInput } from 'element-plus';

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
  /* background-color: #f0f2f5; */ /* Remove or comment out old background */
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); /* Dark blue/purple tech gradient */
  color: #fff; /* Change default text color for better contrast on dark background */
  overflow: hidden; /* Hide scrollbars if gradient causes overflow */
}

/* Adjust auth-box and h2 for better visibility on the new dark background */
.auth-box {
  width: 350px; /* Slightly wider for better proportion */
  padding: 40px; /* More padding */
  background-color: rgba(255, 255, 255, 0.1); /* Semi-transparent white for a frosted glass effect */
  border-radius: 10px; /* More rounded corners */
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* More prominent shadow for depth */
  backdrop-filter: blur(4px); /* Frosted glass effect */
  -webkit-backdrop-filter: blur(4px); /* For Safari */
  border: 1px solid rgba(255, 255, 255, 0.18); /* Subtle border */
  text-align: center;
}

.auth-box h2 {
  margin-bottom: 25px;
  color: #e0e0e0; /* Lighter text color for readability on dark background */
  font-weight: 300; /* Lighter font weight for a more modern look */
}

/* Ensure input and button styles are adapted for the dark, transparent box */
.auth-box :deep(.el-input .el-input__wrapper) {
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background-color: rgba(0, 0, 0, 0.2) !important; /* Darker, transparent background for input */
  box-shadow: none !important; /* Remove default shadow which may not look good */
}

.auth-box :deep(.el-input .el-input__inner) {
  color: #fff !important; /* White text for input */
  -webkit-text-fill-color: #fff !important;
}

.auth-box :deep(.el-input .el-input__inner::placeholder) {
  color: #ccc !important; /* Lighter placeholder text */
  opacity: 1; /* Ensure placeholder is visible */
}

.auth-box :deep(.el-input .el-input__password .el-icon) {
  color: #ccc !important; /* Make password toggle icon lighter */
}

.login-button.el-button--primary {
  background-color: #8a2be2; /* BlueViolet - a techy purple */
  border-color: #8a2be2;
  margin-top: 25px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.login-button.el-button--primary:hover {
  background-color: #9932cc; /* Darker Orchid on hover */
  border-color: #9932cc;
}

/* Adding a subtle animation to the background gradient (optional, but adds to "dreamy" feel) */
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.auth-page-container {
  /* ... other styles ... */
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  background-size: 200% 200%; /* Required for animation to have effect */
  animation: gradientAnimation 15s ease infinite; /* Apply animation */
}
</style>
