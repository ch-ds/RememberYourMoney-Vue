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
        title: {
          text: '本月收入',
          textStyle: {
            color: 'rgb(0,255,0)'
          }
        },
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
              { value: 335, name: '工资' },
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
        title: {
          text: '本月支出',
          textStyle: {
            color: 'red'
          }
        },
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
          text: '本周收入情况',
          subtext: '总收入：XXXXX元\n平均值：XXXXXX元',
          textStyle: {
            color: 'rgb(0,255,0)'
          },
          subtextStyle: {
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
              132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90,
              230, 210, 120, 132, 101, 134, 90, 230, 210],
            itemStyle: {
              color: 'rgb(0,255,0)'
            }
          }
        ]
      },
      expendReportOption: {
        title: {
          text: '本周支出情况',
          subtext: '总支出：XXXXX元\n平均值：XXXXXX元',
          textStyle: {
            color: 'rgb(255,0,0)'
          },
          subtextStyle: {
            color: 'rgb(200,0,0)',
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
    const incomeCharts = this.drawEcharts(this.$refs.income, this.incomeOption)
    const expendCharts = this.drawEcharts(this.$refs.expend, this.expendOption)
    const incomeReportCharts = this.drawEcharts(this.$refs.incomeReport, this.incomeReportOption)
    const expendReportCharts = this.drawEcharts(this.$refs.expendReport, this.expendReportOption)
    window.onresize = function () {
      incomeCharts.resize()
      expendCharts.resize()
      incomeReportCharts.resize()
      expendReportCharts.resize()
    }
  },
  methods: {
    drawEcharts (dom, option) {
      const myCharts = this.$echarts.init(dom)
      myCharts.setOption(option)
      return myCharts
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
  height: 250px;
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
