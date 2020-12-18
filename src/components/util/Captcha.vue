<template>
  <canvas :width="width" :height="height" ref="canvasRef" class="captcha"></canvas>
</template>

<script>
export default {
  props: {
    // 宽和高
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 40
    },
    // 验证码长度
    length: {
      type: Number,
      default: 4
    },
    // 验证码的值
    value: {
      type: String,
      default: '1234'
    },
    // 背景颜色的最大值和最小值
    backgroundColorMin: {
      type: Number,
      default: 0
    },
    backgroundColorMax: {
      type: Number,
      default: 255
    },
    // 验证码线条的属性
    // 线条的颜色最小值和最大值
    lineColorMin: {
      type: Number,
      default: 0
    },
    lineColorMax: {
      type: Number,
      default: 255
    },
    // 线条的数量值
    lineNumber: {
      type: Number,
      default: 5
    },
    // 验证码的字体属性
    // 字体的最小值和最大值，字体
    fontSizeMin: {
      type: Number,
      default: 16
    },
    fontSizeMax: {
      type: Number,
      default: 30
    },
    fontValue: {
      type: String,
      default: 'Arial'
    },
    // 字体的颜色的最小值和最大值
    fontColorMin: {
      type: Number,
      default: 0
    },
    fontColorMax: {
      type: Number,
      default: 255
    }
  },
  methods: {
    // 生成随机数
    randomNumber (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    // 生成随机晏书
    randomColor (min, max) {
      const r = this.randomNumber(min, max)
      const g = this.randomNumber(min, max)
      const b = this.randomNumber(min, max)
      return `rgb(${r},${g},${b})`
    },
    // 绘制canvas
    drawPic () {
      const canvas = this.$refs.canvasRef
      const ctx = canvas.getContext('2d')
      // 绘制背景
      ctx.fillStyle = this.randomColor(
        this.backgroundColorMin,
        this.backgroundColorMax
      )
      ctx.fillRect(0, 0, this.width, this.height)
      // 绘制文本
      for (let i = 0, len = this.value.length; i < len; i++) {
        this.drawText(ctx, this.value[i], i)
      }
      // 绘制干扰线
      this.drawLine(ctx)
    },
    // 绘制文本
    drawText (ctx, value, i) {
      ctx.font = this.randomNumber(
        this.fontSizeMin,
        this.fontSizeMax
      ) + 'px ' + this.fontValue
      ctx.fillStyle = this.randomColor(
        this.fontColorMin,
        this.fontColorMax
      )
      const widthOne = this.width / (this.value.length + 1)
      const x = (i + 1) * widthOne - widthOne / 2
      const y = this.randomNumber(this.fontSizeMax, this.height - this.fontSizeMin)
      const deg = this.randomNumber(-45, 45)
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(value, 0, 0)

      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    // 绘制线条
    drawLine (ctx) {
      for (let i = 0; i < this.lineNumber; i++) {
        ctx.strokeStyle = this.randomColor(
          this.lineColorMin,
          this.lineColorMax
        )
        ctx.beginPath()
        ctx.moveTo(
          this.randomNumber(0, this.width),
          this.randomNumber(0, this.height)
        )
        ctx.lineTo(
          this.randomNumber(0, this.width),
          this.randomNumber(0, this.height)
        )
        ctx.stroke()
      }
    }
  },
  mounted () {
    this.drawPic()
  },
  watch: {
    value () {
      this.drawPic()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
