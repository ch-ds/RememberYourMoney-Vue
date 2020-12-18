<template>
  <div class="img-box add-image">
    <ul class="imgList">
      <li v-for="(item, index) in fileList" :key="index + limit">
        <img :src="item.url" alt="" />
        <span class="img-active">
          <span>
            <i class="el-icon-zoom-in" @click="handlePreview(index)"></i>
            <i class="el-icon-delete" @click="handleDelete(index)"></i>
          </span>
        </span>
      </li>
    </ul>
    <div class="addImg" @click="addImg" v-if="fileList.length !== limit">
      <input
        type="file"
        ref="input"
        :multiple="multiple"
        @input.stop="HandleInput"
        @click.stop=""
      />
      <i class="el-icon-plus"></i>
    </div>
  </div>
</template>

<script>
function noop () { }
export default {
  props: {
    // 是否支持多文件上传
    multiple: {
      type: Boolean,
      default: true
    },
    // 最多支持几张图片
    limit: {
      type: Number,
      default: 9
    },
    // 删除图片方法
    onDelete: {
      type: Function,
      default: noop
    },
    // 查看图片方法
    onPreview: {
      type: Function,
      default: noop
    },
    // 添加图片完成时
    onAdd: {
      type: Function,
      default: noop
    },
    // 图片默认数组
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      num: this.limit
    }
  },
  methods: {
    // 点击触发事件
    addImg (e) {
      this.$refs.input.click()
    },
    // 上传操作
    HandleInput (e) {
      let flag = true
      e.target.files.forEach((item) => {
        // 只接收图片
        const reg = /^image\/.*$/g
        if (!reg.test(item.type)) {
          flag = false
          return
        }
        // 即时预览
        const reader = new FileReader()
        reader.readAsDataURL(item)
        reader.onload = () => {
          if (this.fileList.length < this.limit) {
            const url = reader.result
            item.url = url
            this.fileList.push(item)
            this.onAdd(item)
          }
        }
      })
      if (!flag) {
        this.$message.error('请不要上传非图片文件!')
      }
      e.target.value = ''
    },
    // 删除操作
    handleDelete (index) {
      this.fileList.splice(index, 1)
      this.onDelete(this.fileList[index], index)
      console.log(this.fileList)
    },
    // 查看操作
    handlePreview (index) {
      this.onPreview(this.fileList[index])
    },
    removeAll () {
      this.fileList = []
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  text-align: start;
  > .imgList {
    display: inline;
    vertical-align: top;
    > li {
      display: inline-block;
      width: 150px;
      height: 150px;
      overflow: hidden;
      position: relative;
      background-color: #fff;
      margin: 0 8px 8px 0;
      border-radius: 6px;
      > img {
        width: 100%;
      }
      > .img-active {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        text-align: center;
        display: none;
        > span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          > i {
            cursor: pointer;
            color: white;
            &:first-child {
              margin-right: 15px;
            }
          }
        }
      }
      &:hover > .img-active {
        display: inline;
      }
    }
  }
  > .addImg {
    width: 150px;
    height: 150px;
    border-radius: 6px;
    color: #999;
    font-size: 30px;
    background-color: #fff;
    cursor: pointer;
    display: inline-block;
    border: 1px dashed #999;
    > input {
      display: none;
    }
    > i {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
