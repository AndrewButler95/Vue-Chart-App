<template>
  <el-row :gutter="5" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">Total Calls</div>
          <div class="card-panel-num">{{ totalCalls.toLocaleString() }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">Total API Calls</div>
          <div class="card-panel-num">{{ apiTotalCalls.toLocaleString() }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">Total AUTH Calls</div>
          <div class="card-panel-num">{{ authTotalCalls.toLocaleString() }}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-description">
          <div class="card-panel-text">Total IP Calls</div>
          <div class="card-panel-num">{{ ipTotalCalls.toLocaleString() }}</div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import DataUtils from '../../../../utils/dataUtils.js'
import { fetchList } from '@/api/transaction'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      data: [],
      totalCalls: 0,
      apiTotalCalls: 0,
      authTotalCalls: 0,
      ipTotalCalls: 0
    }
  },
  mounted() {
    const here = this
    here.fetchData()
    setInterval(function() {
      here.totalCalls = 0
      here.apiTotalCalls = 0
      here.authTotalCalls = 0
      here.ipTotalCalls = 0
      here.fetchData()
    }, 60000)
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    fetchData() {
      fetchList().then(response => {
        const keys = Object.keys(response.data.Data)
        const sortedResponse = []
        for (const key in keys) {
          const endpointInfo = { [keys[key]]: response.data.Data[keys[key]] }
          sortedResponse.push(endpointInfo)
        }
        this.data = DataUtils.test.sortKeys(sortedResponse, 'IP')
        for (const index in this.data) {
          const key = Object.keys(this.data[index])[0]
          this.totalCalls =
            this.totalCalls +
            DataUtils.test.sumTotalCalls(this.data, index, key, 'totalCalls')
          this.apiTotalCalls =
            this.apiTotalCalls + this.data[index][key]['ApiKey'].total_calls
          this.authTotalCalls =
            this.authTotalCalls + this.data[index][key]['AuthKey'].total_calls
          this.ipTotalCalls =
            this.ipTotalCalls + this.data[index][key]['IP'].total_calls
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 16px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    background: #14202f;
    border-radius: 5px;
    .card-panel-description {
      display: flex;
      font-weight: bold;
      margin: 26px;
      flex-direction: column;
      text-align: center;
      .card-panel-text {
        line-height: 18px;
        color: #51667c;
        font-size: 18px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 32px;
         color: #fff;
      }
    }
  }
}
</style>
