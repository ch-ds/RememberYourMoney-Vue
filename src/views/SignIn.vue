<template>
  <div class="SignIn">
    <!-- 熊运动div -->
    <div class="bearMove"></div>
    <!-- 登录注册对话框区域 -->
    <main class="login-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.SignIn {
  min-height: 100vh;
  background: url('../assets/images/login_bgc.jpg') no-repeat;
  background-size: 100% 100%;
  // 熊运东的css
  > .bearMove {
    width: 200px;
    height: 100px;
    background: url('../assets/images/bear.png');
    position: absolute;
    left: 0;
    bottom: 80px;
    animation: bear 1s steps(8) infinite, MoveW 8s linear forwards;
  }
  @keyframes bear {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: -1600px 0;
    }
  }
  @keyframes MoveW {
    0% {
      left: 0;
    }
    100% {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  > .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
  }
}
</style>
