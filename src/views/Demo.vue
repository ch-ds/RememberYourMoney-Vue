<template>
  <div>
    <button @click="flag = !flag">切换</button>
    <!-- <div class="container"> -->
    <transition-group mode="in-out" tag="div" class="container">
      <div key="key1" v-show="flag" class="box1" ref="box1"></div>
      <div key="key2" class="box2" ref="box2"></div>
    </transition-group>
    <!-- </div> -->
    <button class="cc" @click="toggle()">重重</button>
    <div class="box3" ref="box3"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: true
    }
  },
  methods: {
    toggle () {
      this.$refs.box1.style.width = '100px'
    }
  }
}
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 2s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
  transform: translateX(-250px);
}

.v-move {
  transition: all 2s;
}

.v-leave-active {
  position: absolute;
}
.v-enter-active {
  position: static;
}

.container {
  display: flex;
  width: 100%;
  min-height: 500px;
  .box1 {
    width: 250px;
    min-height: 100%;
    background-color: red;
    > div {
      width: 100%;
      height: 100%;
    }
  }
  > .box2 {
    flex: 1;
    background-color: yellow;
  }
}
.box3 {
  width: 20%;
  height: 300px;
  background-color: blue;
  transition: all 1s;
}
</style>
