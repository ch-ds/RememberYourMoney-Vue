<template>
  <div class="images">
    <ul class="box">
      <li v-for="(item, index) in imgList" :key="index">
        <img
          :class="['image', { 'image-active': isPreview }]"
          :src="`http://127.0.0.1:8081/image/${$store.state.userObj.uid}/${item}`"
          @click="preview"
        />
      </li>
    </ul>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <img :src="url" alt="" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 图片数组
    imgList: {
      type: Array,
      default: () => []
    },
    // 控制是否可以点击查看放大图片
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      url: ''
    }
  },
  methods: {
    preview (event) {
      if (!this.isPreview) return
      this.dialogVisible = true
      this.url = event.target.src
    }
  }
}
</script>

<style lang="scss" scoped>
.images {
  text-align: start;
  .box {
    display: inline;
    > li {
      display: inline-block;
      img {
        margin: 0 8px 8px 0;
      }
    }
  }
  .image-active {
    cursor: pointer;
  }
  .el-dialog {
    img {
      width: 100%;
    }
  }
}
</style>
