<template>
  <div>
    <div ref="chartdiv" class="chartDiv"/>
  </div>
</template>

<script>
import axios from 'axios'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'

export default {
  name: 'App',
  props: {
    endPoint: {
      type: String,
      default: null
    },
    count: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'hour'
    },
    percentMode: {
      type: Boolean,
      default: null
    }
  },
  data: function() {
    return { resp: 'value', data: {}, type1: ['hour', 'month', 'day'] }
  },
  mounted() {
    const getFullURL = function(url, options) {
      const params = []
      for (const key in options) {
        params.push(`${key}=${options[key]}`)
      }
      return url + '?' + params.join('&')
    }

    const baseUrl = 'localhost:5000/'
    const options = {
      path: this.endPoint
    }
    const fullURL = getFullURL(baseUrl, options)

    axios.get(fullURL, { headers: headers }).then(
      function(res) {
        this.data = res
        this.chart = this.createchartFull(
          this.type,
          this.$refs.chartdiv,
          this.data
        )
      }.bind(this)
    )
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.chart2) {
      this.chart2.dispose()
    }
    if (this.chart3) {
      this.chart3.dispose()
    }
  },
  methods: {
    createchartFull(interval, ref, res) {
      var chart = am4core.create(ref, am4charts.XYChart)

      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.grid.template.strokeOpacity = 0.5
      dateAxis.renderer.grid.template.strokeWidth = 1
      dateAxis.dateFormats.setKey('hour', 'HH:mm')

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.tooltip.disabled = true
      valueAxis.renderer.labels.template.fill = am4core.color('#448cff')
      valueAxis.renderer.grid.template.strokeOpacity = 0.5
      valueAxis.renderer.grid.template.strokeWidth = 1

      var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis2.tooltip.disabled = true
      valueAxis2.renderer.labels.template.fill = am4core.color('#fffa72')
      valueAxis2.renderer.grid.template.strokeOpacity = 0

      var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis3.tooltip.disabled = true
      valueAxis3.renderer.labels.template.fill = am4core.color('#c7ff96')
      valueAxis3.renderer.grid.template.strokeOpacity = 0

      var series = chart.series.push(new am4charts.LineSeries())
      series.dataFields.dateX = 'date1'
      series.dataFields.valueY = 'value1'
      series.fill = am4core.color('#448cff')
      series.stroke = am4core.color('#448cff')
      series.strokeWidth = 2
      var series2 = chart.series.push(new am4charts.LineSeries())
      series2.dataFields.dateX = 'date2'
      series2.dataFields.valueY = 'value2'
      series2.yAxis = valueAxis2
      series2.fill = am4core.color('#fffa72')
      series2.stroke = am4core.color('#fffa72')
      series2.strokeWidth = 2

      var series3 = chart.series.push(new am4charts.LineSeries())
      series3.dataFields.dateX = 'date3'
      series3.dataFields.valueY = 'value3'
      series3.yAxis = valueAxis3
      series3.fill = am4core.color('#c7ff96')
      series3.stroke = am4core.color('#c7ff96')
      series3.strokeWidth = 2

      chart.legend = new am4charts.Legend()
      chart.legend.zIndex = 100
      chart.legend.labels.template.text = '[bold {color}]{name}'
      chart.legend.position = 'top'

      var data = []
      if (this.type1.includes(this.type)) {
        series.name = 'IP'
        if (!(this.type === 'month')) {
          dateAxis.renderer.labels.template.location = 0.0001
        }
        series2.name = 'AuthKey'
        series3.name = 'ApiKey'
        dateAxis.renderer.labels.template.fill = am4core.color('white')
        data = this.createData(interval, res)
        chart.numberFormatter.numberFormat = '#a'
        chart.numberFormatter.bigNumberPrefixes = [
          { number: 1e3, suffix: 'K' },
          { number: 1e6, suffix: 'M' },
          { number: 1e9, suffix: 'B' }
        ]
      } else {
        series.name = 'hour'
        series2.name = 'day'
        series3.name = 'month'
        if (this.percentMode) {
          data = this.createDataPercentageChange(interval, res)

          valueAxis.logarithmic = true
          valueAxis2.logarithmic = true
          valueAxis3.logarithmic = true

          console.log('is percent mode', data)
        } else {
          data = this.createData2(interval, res)
          chart.numberFormatter.numberFormat = '#a'
          chart.numberFormatter.bigNumberPrefixes = [
            { number: 1e3, suffix: 'K' },
            { number: 1e6, suffix: 'M' },
            { number: 1e9, suffix: 'B' }
          ]
        }
        dateAxis.renderer.labels.template.location = 0.0001
        dateAxis.renderer.labels.template.fill = am4core.color('#448cff')

        var dateAxis2 = chart.xAxes.push(new am4charts.DateAxis())
        dateAxis2.renderer.labels.template.fill = am4core.color('#fffa72')

        dateAxis2.renderer.grid.template.strokeOpacity = 0.5
        dateAxis2.renderer.grid.template.strokeWidth = 1
        dateAxis2.renderer.labels.template.location = 0.0001

        var dateAxis3 = chart.xAxes.push(new am4charts.DateAxis())
        dateAxis3.renderer.labels.template.fill = am4core.color('#c7ff96')

        dateAxis3.renderer.grid.template.strokeOpacity = 0.0
        dateAxis3.renderer.grid.template.strokeWidth = 1

        series2.xAxis = dateAxis2
        series3.xAxis = dateAxis3
      }
      chart.data = data.reverse()
      return chart
    },
    createData(interval, res) {
      var data = []
      for (const value1 in res.data.Data['IP'][interval + '_historical']) {
        data.push({
          value1: res.data.Data['IP'][interval + '_historical'][value1].val,
          date1: new Date(
            res.data.Data['IP'][interval + '_historical'][value1].ts * 1000
          )
        })
      }
      for (const value2 in res.data.Data['AuthKey'][interval + '_historical']) {
        data.push({
          value2:
            res.data.Data['AuthKey'][interval + '_historical'][value2].val,
          date2: new Date(
            res.data.Data['AuthKey'][interval + '_historical'][value2].ts * 1000
          )
        })
      }
      for (const value3 in res.data.Data['ApiKey'][interval + '_historical']) {
        data.push({
          value3: res.data.Data['ApiKey'][interval + '_historical'][value3].val,
          date3: new Date(
            res.data.Data['ApiKey'][interval + '_historical'][value3].ts * 1000
          )
        })
      }
      return data
    },
    createData2(style, res) {
      var data = []
      for (const value1 in res.data.Data[style]['hour_historical']) {
        data.push({
          value1: res.data.Data[style]['hour_historical'][value1].val,
          date1: new Date(
            res.data.Data[style]['hour_historical'][value1].ts * 1000
          )
        })
      }
      for (const value2 in res.data.Data[style]['day_historical']) {
        data.push({
          value2: res.data.Data[style]['day_historical'][value2].val,
          date2: new Date(
            res.data.Data[style]['day_historical'][value2].ts * 1000
          )
        })
      }

      for (const value3 in res.data.Data[style]['month_historical']) {
        data.push({
          value3: res.data.Data[style]['month_historical'][value3].val,
          date3: new Date(
            res.data.Data[style]['month_historical'][value3].ts * 1000
          )
        })
      }
      return data
    },
    createDataPercentageChange(style, res) {
      var data = []
      let prevValue = 1
      for (const value1 in res.data.Data[style]['hour_historical']) {
        if (!(prevValue === 1)) {
          data.push({
            value1:
            res.data.Data[style]['hour_historical'][value1].val / prevValue,
            date1: new Date(
              res.data.Data[style]['hour_historical'][value1].ts * 1000
            )
          })
        }
        prevValue = res.data.Data[style]['hour_historical'][value1].val
      }
      prevValue = 1
      for (const value2 in res.data.Data[style]['day_historical']) {
        if (!(prevValue === 1)) {
          data.push({
            value2:
            res.data.Data[style]['day_historical'][value2].val / prevValue,
            date2: new Date(
              res.data.Data[style]['day_historical'][value2].ts * 1000
            )
          })
        }
        prevValue = res.data.Data[style]['day_historical'][value2].val
      }
      prevValue = 1
      for (const value3 in res.data.Data[style]['month_historical']) {
        if (!(prevValue === 1)) {
          data.push({
            value3:
              res.data.Data[style]['month_historical'][value3].val / prevValue,
            date3: new Date(
              res.data.Data[style]['month_historical'][value3].ts * 1000
            )
          })
        }
        prevValue = res.data.Data[style]['month_historical'][value3].val
      }
      return data
    }
  }
}
</script>

<style>
.chartDiv {
  width: 100%;
  height: 450px;
}
</style>
