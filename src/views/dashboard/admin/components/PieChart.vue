<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { fetchList } from '@/api/transaction'
import { debounce } from '@/utils'
import DataUtils from '../../../../utils/dataUtils.js'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    overallStats: {
      type: Boolean,
      default: true
    },
    endPoint: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null,
      data: [],
      list: [],
      chartData: []
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      fetchList().then(response => {
        if (this.overallStats === false) {
          const chartData = [
            { name: 'API key', value: response.data.Data[this.endPoint].ApiKey.month },
            { name: 'Auth Key', value: response.data.Data[this.endPoint].AuthKey.month },
            { name: 'IP', value: response.data.Data[this.endPoint].IP.month }
          ]
          this.data = chartData
          const chartName = this.endPoint
          this.chart = echarts.init(this.$el, 'macarons')
          this.chart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            title: {
              text: chartName,
              textStyle: {
                color: 'white'
              }
            },
            legend: {
              left: 'center',
              bottom: '20',
              data: ['API key', 'Auth Key', 'IP'],
              textStyle: {
                color: 'white'
              }
            },
            calculable: true,
            series: [
              {
                name: chartName,
                type: 'pie',
                radius: [0, 150],
                center: ['50%', '50%'],
                data: chartData,
                animationEasing: 'cubicInOut',
                animationDuration: 1300,
                itemStyle: {
                  normal: {
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    }
                  }},
                emphasis: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            ]
          })
        } else {
          const keys = Object.keys(response.data.Data)
          const sortedResponse = []
          for (const key in keys) {
            const endpointInfo = { [keys[key]]: response.data.Data[keys[key]] }
            sortedResponse.push(endpointInfo)
          }

          this.data = DataUtils.test.sortKeys(sortedResponse, this.type)
          const legendData = this.data
          const finalData = []
          const chartData = []
          const chartSlices = 9

          for (const legend in legendData) {
            const key = Object.keys(legendData[legend])[0]
            if (legend < chartSlices) {
              chartData.push({
                value: DataUtils.test.sumTotalCalls(
                  legendData,
                  legend,
                  key,
                  this.type
                ),
                name: key
              })
              finalData[legend] = key
            } else {
              if (chartData[chartSlices] === undefined) {
                chartData.push({
                  value: DataUtils.test.sumTotalCalls(
                    legendData,
                    legend,
                    key,
                    this.type
                  ),
                  name: 'other'
                })
                finalData[legend] = 'other'
              } else {
                chartData[chartSlices].value =
                chartData[chartSlices].value +
                DataUtils.test.sumTotalCalls(
                  legendData,
                  legend,
                  key,
                  this.type
                )
              }
            }
          }
          this.chartData = chartData
          finalData.push('other')
          var chartName
          if (this.type === 'totalCalls') {
            chartName = 'Total API Endpoint Calls'
          } else {
            chartName = 'Total ' + this.type + ' Endpoint Calls'
          }
          this.chart = echarts.init(this.$el, 'macarons')
          this.chart.setOption({
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            title: {
              text: chartName,
              textStyle: {
                color: 'white'
              }
            },
            selectedMode: 'single',
            legend: {
              left: 'center',
              bottom: '20',
              data: finalData,
              textStyle: {
                color: 'white'
              }
            },
            calculable: true,
            series: [
              {
                name: chartName,
                type: 'pie',
                radius: [0, 150],
                center: ['50%', '45%'],
                data: this.chartData,
                animationEasing: 'cubicInOut',
                animationDuration: 1300
              }
            ]
          })
          this.chart.on(
            'click',
            function(params) {
              const finalData = []
              const chartData = []
              const chartSlices = 9
              for (const legend in legendData) {
                const key = Object.keys(legendData[legend])[0]
                if (legend > chartSlices) {
                  chartData.push({
                    value: DataUtils.test.sumTotalCalls(
                      legendData,
                      legend,
                      key,
                      this.type
                    ),
                    name: key
                  })
                  finalData[legend] = key
                }
              }
              this.chartData = chartData
              if (params.dataIndex === 9) {
                this.chart.setOption({

                  title: {
                    text: chartName + " 'other'"
                  },
                  series: [
                    {
                      name: chartName + " 'other'",
                      itemStyle: {
                        normal: {
                          label: {
                            show: false
                          },
                          labelLine: {
                            show: false
                          }
                        }},
                      emphasis: {
                        label: {
                          show: false
                        },
                        labelLine: {
                          show: false
                        }
                      },
                      radius: [0, 200],
                      center: ['50%', '50%'],
                      data: this.chartData
                    }
                  ]
                })
              }
            }.bind(this)
          )
        }
      })
    }
  }

}
</script>
