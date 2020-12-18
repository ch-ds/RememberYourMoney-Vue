<template>
  <div class="home-container">
    <!-- 收入与支出的饼图 -->
    <section class="bill-wrap">
      <div ref="income" class="income"></div>
      <div ref="expend" class="expend"></div>
    </section>
    <!-- 收入与支出的折线图 -->
    <section ref="incomeReport" class="income-report"></section>
    <section ref="expendReport" class="expend-report"></section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 图表数据
      incomeOption: {
        // 设置标题
        title: [{
          text: '本月收入分类',
          textStyle: {
            color: 'rgb(0,255,0)'
          }
        }, {
          show: false,
          subtext: '暂无收入',
          left: '50%',
          bottom: '0%',
          textAlign: 'center',
          subtextStyle: {
            fontSize: 16
          }
        }],
        // 设置图形颜色
        color: ['#ca8622', '#91c7ae', '#749f83', '#d48265'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 0,
          data: ['工资', '兼职', '理财', '其他'],
          textStyle: {
            color: ['#ca8622', '#91c7ae', '#749f83', '#d48265']
          }
        },
        series: [
          {
            name: '收入来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 310, name: '兼职' },
              { value: 234, name: '理财' },
              { value: 135, name: '其他' }
            ]
          }
        ]
      },
      // 图表数据
      expendOption: {
        // 设置标题
        title: [{
          text: '本月支出分类',
          textStyle: {
            color: 'red'
          }
        }, {
          show: false,
          subtext: '暂无交易',
          left: '50%',
          bottom: '0%',
          textAlign: 'center',
          subtextStyle: {
            fontSize: 18
          }
        }],
        // 设置图形颜色
        color: ['rgb(231, 173, 63)', 'rgb(236, 213, 75)', 'rgb(193, 210, 108)', 'rgb(104, 176, 102)', 'rgb(73, 162, 160)', 'rgb(64, 140, 227)'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 0,
          data: ['餐饮美食', '服饰美容', '生活日用', '酒店旅行', '交通出行', '其他'],
          textStyle: {
            color: ['rgb(231, 173, 63)', 'rgb(236, 213, 75)', 'rgb(193, 210, 108)', 'rgb(104, 176, 102)', 'rgb(73, 162, 160)', 'rgb(64, 140, 227)']
          }
        },
        series: [
          {
            left: '0',
            name: '支出来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '餐饮美食' },
              { value: 310, name: '服饰美容' },
              { value: 234, name: '生活日用' },
              { value: 234, name: '酒店旅行' },
              { value: 234, name: '交通出行' },
              { value: 135, name: '其他' }
            ]
          }
        ]
      },
      incomeReportOption: {
        title: {
          text: '本月收入情况',
          subtext: '总收入：0元\n平均值：0元',
          textStyle: {
            color: 'rgb(0,255,0)'
          },
          subtextStyle: {
            fontSize: 16,
            color: 'rgb(0,200,0)',
            lineHeight: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '25%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        // x轴上得点
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['10月1日', '10月2日', '10月3日', '10月4日', '10月5日', '10月6日', '10月7日',
            '10月8日', '10月9日', '10月10日', '10月11日', '10月12日', '10月13日',
            '10月14日', '10月15日', '10月16日', '10月17日', '10月18日', '10月19日',
            '10月20日', '10月21日', '10月22日', '10月23日', '10月24日', '10月25日',
            '10月26日', '10月27日', '10月28日', '10月29日', '10月30日', '10月31日'],
          // 刻度点
          axisLabel: {
            color: 'rgb(156, 164, 176)',
            interval: (index, value) => {
              // 当 index === 0 时直接true
              if (index === 0) {
                return true
              }
              // 获取 xAxis 的 data 长度
              const length = this.incomeReportOption.xAxis.data.length
              // 当31天出现的情况
              if (length === 31) {
                if (index === length - 2) {
                  return false
                }
                if (index === length - 1) {
                  return true
                }
              } else if (length === 28 || length === 29) {
                // 当28天或者29天出现的情况下
                if (index === length - 1) return true
              }
              // const startIndex = value.indexOf('月')
              // const lastIndex = value.indexOf('日')
              // value = value.substring(startIndex + 1, lastIndex)
              // 正常30天的情况
              return (index + 1) % 5 === 0
            }
          }
        },
        // y轴坐标
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgb(156, 164, 176)'
          }
        },
        series: [
          {
            name: '￥',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134,
              90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120,
              132, 101, 134, 90, 230, 210, 120, 0, 0],
            itemStyle: {
              color: 'rgb(0,255,0)'
            }
          }
        ]
      },
      expendReportOption: {
        title: {
          text: '本月支出情况',
          subtext: '总支出：0元\n平均值：0元',
          textStyle: {
            color: 'rgb(255,0,0)'
          },
          subtextStyle: {
            fontSize: 16,
            color: 'rgb(255,40,40)',
            lineHeight: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '25%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        // x轴上得点
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['10月1日', '10月2日', '10月3日', '10月4日', '10月5日', '10月6日', '10月7日',
            '10月8日', '10月9日', '10月10日', '10月11日', '10月12日', '10月13日',
            '10月14日', '10月15日', '10月16日', '10月17日', '10月18日', '10月19日',
            '10月20日', '10月21日', '10月22日', '10月23日', '10月24日', '10月25日',
            '10月26日', '10月27日', '10月28日', '10月29日', '10月30日', '10月31日'],
          // 刻度点
          axisLabel: {
            color: 'rgb(156, 164, 176)',
            interval: (index, value) => {
              // 当 index === 0 时直接true
              if (index === 0) {
                return true
              }
              // 获取 xAxis 的 data 长度
              const length = this.incomeReportOption.xAxis.data.length
              // 当31天出现的情况
              if (length === 31) {
                if (index === length - 2) {
                  return false
                }
                if (index === length - 1) {
                  return true
                }
              } else if (length === 28 || length === 29) {
                // 当28天或者29天出现的情况下
                if (index === length - 1) return true
              }
              // const startIndex = value.indexOf('月')
              // const lastIndex = value.indexOf('日')
              // value = value.substring(startIndex + 1, lastIndex)
              // 正常30天的情况
              return (index + 1) % 5 === 0
            }
          }
        },
        // y轴坐标
        yAxis: {
          type: 'value',
          axisLabel: {
            color: 'rgb(156, 164, 176)'
          }
        },
        series: [
          {
            name: '￥',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134,
              90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120,
              132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90,
              230, 210, 120, 132, 101, 134, 90, 230, 210],
            itemStyle: {
              color: 'rgb(255,0,0)'
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.getIncomeOption()
    this.getIncomeReportOption()
    this.getExpendOption()
    this.getExpendReportOption()
  },
  methods: {
    // 画 echarts 图方法
    drawEcharts (dom, option) {
      const myCharts = this.$echarts.init(dom)
      myCharts.setOption(option)
      return myCharts
    },
    // 获取本月收入的数据
    async getIncomeOption () {
      const { data: res } = await this.$http.get(`/income/type/sumMoney/${this.$store.state.userObj.uid}`, {
        params: {
          timeType: 'month',
          timeValue: new Date().getTime()
        }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        // 说明失败了
        this.incomeOption.series[0].data = [{
          value: 0,
          name: '暂无收入',
          itemStyle: { color: '#949494' }
        }]
        this.incomeOption.series[0].name = '暂无收入'
        this.incomeOption.title[1].show = true
      } else {
        // 有数据则进行下一步操作
        // map循环拿出需要的数据
        this.incomeOption.legend.data = res.data.map(item => item.incomeType_name)
        this.incomeOption.series[0].data = res.data.map(item => ({
          name: item.incomeType_name,
          value: item.sumMoney
        }))
      }
      console.log(this.incomeOption)
      const incomeCharts = this.drawEcharts(this.$refs.income, this.incomeOption)
      window.addEventListener('resize', function () {
        incomeCharts.resize()
      })
    },
    // 获取本月支出的数据
    async getExpendOption () {
      const { data: res } = await this.$http.get(`/expend/type/sumMoney/${this.$store.state.userObj.uid}`, {
        params: {
          timeType: 'month',
          timeValue: new Date().getTime()
        }
      })
      if (res.meta.status !== 200) {
        this.expendOption.title[1].show = true
        this.expendOption.legend.data = ['暂无消费']
        this.expendOption.series[0].data = [{
          value: 0,
          name: '暂无消费',
          itemStyle: { color: '#949494' }
        }]
      } else {
        this.expendOption.legend.data = res.data.map(item => item.expendType_name)
        this.expendOption.series[0].data = res.data.map(item => ({
          value: item.sumMoney,
          name: item.expendType_name
        }))
      }
      const expendCharts = this.drawEcharts(this.$refs.expend, this.expendOption)
      window.addEventListener('resize', function () {
        expendCharts.resize()
      })
    },
    // 获取本月每日收入的数据
    async getIncomeReportOption () {
      const time = new Date()
      const { data: res } = await this.$http.get(`/income/day/sumMoney/${this.$store.state.userObj.uid}`, {
        params: {
          timeType: 'month',
          timeValue: time.getTime()
        }
      })
      // 根据当前日期，获取到这个月一共多少天
      const month = time.getMonth() + 1
      const day = new Date(time.getFullYear(), month, 0).getDate()
      const dayMap = new Map()
      for (let i = 0; i < day; i++) {
        dayMap.set(`${month}月${String(i + 1).padStart(2, 0)}日`, 0)
      }
      if (res.meta.status === 200) {
        let sum = 0
        res.data.forEach(item => {
          sum += item.sumMoney
          if (dayMap.has(item.timeDay)) {
            dayMap.set(item.timeDay, item.sumMoney)
          }
        })
        this.incomeReportOption.title.subtext = `总收入：${sum}元\n平均值：${(sum / day).toFixed(2)}元`
      }
      const xAxisData = []
      for (const key of dayMap.keys()) {
        xAxisData.push(key)
      }
      const seriesData = []
      for (const value of dayMap.values()) {
        seriesData.push(value)
      }
      this.incomeReportOption.xAxis.data = xAxisData
      this.incomeReportOption.series[0].data = seriesData
      const incomeReportCharts = this.drawEcharts(this.$refs.incomeReport, this.incomeReportOption)
      window.addEventListener('resize', function () {
        incomeReportCharts.resize()
      })
    },
    // 获取本月每日支出的数据
    async getExpendReportOption () {
      const time = new Date()
      const { data: res } = await this.$http.get(`/expend/day/sumMoney/${this.$store.state.userObj.uid}`, {
        params: {
          timeType: 'month',
          timeValue: time.getTime()
        }
      })
      console.log(res)
      // 根据当前日期，获取到这个月一共多少天
      const month = time.getMonth() + 1
      const day = new Date(time.getFullYear(), month, 0).getDate()
      const dayMap = new Map()
      for (let i = 0; i < day; i++) {
        dayMap.set(`${month}月${String(i + 1).padStart(2, 0)}日`, 0)
      }
      if (res.meta.status === 200) {
        let sum = 0
        res.data.forEach(item => {
          sum += item.sumMoney
          if (dayMap.has(item.timeDay)) {
            dayMap.set(item.timeDay, item.sumMoney)
          }
        })
        this.expendReportOption.title.subtext = `总支出：${sum}元\n平均值：${(sum / day).toFixed(2)}元`
      }
      const xAxisData = []
      for (const key of dayMap.keys()) {
        xAxisData.push(key)
      }
      const seriesData = []
      for (const value of dayMap.values()) {
        seriesData.push(value)
      }
      this.expendReportOption.xAxis.data = xAxisData
      this.expendReportOption.series[0].data = seriesData
      const expendReportCharts = this.drawEcharts(this.$refs.expendReport, this.expendReportOption)
      window.addEventListener('resize', function () {
        expendReportCharts.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  width: 100%;
}
.bill-wrap {
  padding: 20px 0;
  width: 100%;
  height: 280px;
  display: flex;
  justify-content: space-around;

  > .income {
    padding: 10px;
    background: var(--article-color-active);
    width: 40%;
    box-sizing: border-box;
  }

  > .expend {
    padding: 10px;
    background-color: var(--article-color-active);
    width: 40%;
    box-sizing: border-box;
  }
}
.income-report {
  width: 90%;
  height: 350px;
  margin: 0 5%;
  background-color: var(--article-color-active);
}
.expend-report {
  width: 90%;
  height: 350px;
  margin: 20px 5% 50px;
  background-color: var(--article-color-active);
}
</style>
