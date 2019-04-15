<template>
  <div class="dashboard-editor-container">
    <panel-group :all-data="allData"/>
    <el-row :gutter="5" style="padding:16px 16px 0;margin-bottom:16px;">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <LineChart
            ref="chartdiv"
            :end-point="endPoint"
            :type="type"
            :key="renderLineChart"
            :percent-mode="percentToggle"
            class="chart-div"
          />
          <div v-if="disable === true">
            <el-button class="stylebutton" @click="toggle()">Request Style</el-button>
            <el-button
              v-for="post in buttonArray "
              :class="{ active: post.isActive }"
              :key="post.id"
              class="stylebutton"
              @click="click(post.name, post.id, buttonArray)"
            >{{ post.name }}</el-button>
          </div>
          <div v-if="disable === false">
            <el-button class="stylebutton" @click="toggle()">Interval Style</el-button>
            <el-button
              v-for="post in buttonArray2"
              :class="{ active: post.isActive }"
              :key="post.id"
              class="stylebutton"
              @click="click(post.name, post.id, buttonArray2)"
            >{{ post.name }}</el-button>
            <el-button v-if="percentToggle === true" class="stylebutton active" @click="percentMode()">Percentage Change</el-button>
            <el-button v-else class="stylebutton" @click="percentMode()">Percentage Change</el-button>

          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart
            :end-point="endPoint"
            :overall-stats="overallStats"
            :type="buttonArray3[activeIndex].name"
            :key="renderPieChart"
          />
          <div>
            <el-button
              v-for="post in buttonArray3"
              :class="{ active: post.isActive }"
              :key="post.id"
              class="stylebutton"
              @click="pieChartClick(post.id)"
            >{{ post.displayName }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding:16px 16px 0;margin-bottom:16px;">
      <el-col
        :xs="{span: 24}"
        :sm="{span: 24}"
        :md="{span: 24}"
        :lg="{span: 24}"
        :xl="{span: 24}"
        style="margin-bottom:30px;"
      >
        <div>
          <transaction-table :all-data="allData" @clicked="onClickChild"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import TransactionTable from './components/TransactionTable'
import LineChart from './components/LineChart.vue'
import { fetchList } from '@/api/transaction'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PieChart,
    TransactionTable,
    LineChart
  },
  data() {
    return {
      endPoint: null,
      allData: null,
      renderLineChart: 0,
      renderPieChart: 0,
      type: 'hour',
      overallStats: true,
      percentToggle: false,
      firstClick: true,
      disable: true,
      buttonArray: [
        { name: 'hour', id: 0, isActive: true },
        { name: 'day', id: 1, isActive: false },
        { name: 'month', id: 2, isActive: false }
      ],
      buttonArray2: [
        { name: 'IP', id: 0, isActive: false },
        { name: 'AuthKey', id: 1, isActive: false },
        { name: 'ApiKey', id: 2, isActive: false }
      ],
      buttonArray3: [
        { displayName: 'Total Calls', name: 'totalCalls', id: 0, isActive: true },
        { displayName: 'IP', name: 'IP', id: 1, isActive: false },
        { displayName: 'Auth Key', name: 'AuthKey', id: 2, isActive: false },
        { displayName: 'Api Key', name: 'ApiKey', id: 3, isActive: false }
      ],
      activeIndex: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      fetchList().then(response => {
        this.allData = response
      })
    },
    onClickChild(value) {
      this.endPoint = value
      this.overallStats = false
      this.buttonArray3[this.activeIndex].isActive = false
      this.renderLineChart++
      this.renderPieChart++
    },
    click(chartType, id, buttonArray) {
      this.type = chartType
      this.renderLineChart++

      for (var button in buttonArray) {
        const buttonObj = buttonArray[button]
        if (buttonObj.id === id) {
          buttonObj.isActive = true
        } else {
          buttonObj.isActive = false
        }
      }
    },
    toggle() {
      this.disable = !this.disable
      if (this.disable === true) {
        this.renderActiveButton(this.buttonArray)
      } else {
        if (this.firstClick) {
          this.buttonArray2[0].isActive = true
          this.firstClick = false
        }
        this.renderActiveButton(this.buttonArray2)
      }
    },
    percentMode() {
      this.percentToggle = !this.percentToggle
      this.renderLineChart++
    },
    pieChartClick(id) {
      this.activeIndex = id
      let prevActiveIndex
      for (const button in this.buttonArray3) {
        const buttonObj = this.buttonArray3[button]
        if (buttonObj.isActive) {
          if (buttonObj.id === this.activeIndex) {
            this.overallStats = false
            prevActiveIndex = buttonObj.id
          }
          buttonObj.isActive = false
          break
        }
      }
      if (this.activeIndex === prevActiveIndex) {
        this.overallStats = false
      } else {
        this.overallStats = true
      }
      if (this.overallStats === true) {
        this.buttonArray3[id].isActive = true
      }
      this.renderPieChart++
    },
    renderActiveButton(buttonArray) {
      for (const button in buttonArray) {
        const buttonObj = buttonArray[button]
        if (buttonObj.isActive) {
          this.type = buttonObj.name
          this.renderLineChart++
          break
        }
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: #384552;
  .chart-wrapper {
    background: #14202f;
    padding: 16px 16px 0;
    height: 580px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .chart-wrapper2 {
    padding: 0px 16px 0;
    margin-bottom: 16px;
  }
}
.chart-div {
  width: 100%;
}
.stylebutton {
  background-color: #3e546c;
  color: white;
  font-size: 18px;
  border: none;
}

.active,
.stylebutton:hover {
  background-color: #42b983;
}
</style>
