<template>
  <div>
    <el-table
      ref="singleTable"
      :data="list"
      :default-sort="{prop: 'scope.row.endpoint', order: 'ascending'}"
      :header-cell-style="changeHead"
      :cell-class-name="headerRowClassName"
      class="border"
      row-class-name="success-row"
      @row-click="handleRowClick"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="handleMouseOut"
      @current-change="handleCurrentChange"
    >
      <el-table-column label="Endpoint" prop="endpoint" min-width="40" align="center" sortable/>
      <el-table-column label="ApiKey" align="center">
        <el-table-column label="Hour" prop="ApiKeyhoursort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.ApiKeyhourtoggle">{{ scope.row.ApiKeyhourformat }}</span>
            <span v-if="scope.row.ApiKeyhourtoggle">{{ scope.row.ApiKeyhour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Day" prop="ApiKeydaysort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.ApiKeydaytoggle">{{ scope.row.ApiKeydayformat }}</span>
            <span v-if="scope.row.ApiKeydaytoggle">{{ scope.row.ApiKeyday }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Month" prop="ApiKeymonthsort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.ApiKeymonthtoggle">{{ scope.row.ApiKeymonthformat }}</span>
            <span v-if="scope.row.ApiKeymonthtoggle">{{ scope.row.ApiKeymonth }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="AuthKey Website" align="center">
        <el-table-column label="Hour" prop="AuthKeyhoursort" min-width="30" align="center" sortable special="AuthKeyHour">
          <template slot-scope="scope">
            <span v-if="!scope.row.AuthKeyhourtoggle">{{ scope.row.AuthKeyhourformat }}</span>
            <span v-if="scope.row.AuthKeyhourtoggle">{{ scope.row.AuthKeyhour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Day" prop="AuthKeydaysort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.AuthKeydaytoggle">{{ scope.row.AuthKeydayformat }}</span>
            <span v-if="scope.row.AuthKeydaytoggle">{{ scope.row.AuthKeyday }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Month" prop="AuthKeymonthsort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.AuthKeymonthtoggle">{{ scope.row.AuthKeymonthformat }}</span>
            <span v-if="scope.row.AuthKeymonthtoggle">{{ scope.row.AuthKeymonth }}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column style="width: 100%; border-color: red" label="IP" align="center">
        <el-table-column label="Hour" prop="IPhoursort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.IPhourtoggle">{{ scope.row.IPhourformat }}</span>
            <span v-if="scope.row.IPhourtoggle">{{ scope.row.IPhour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Day" prop="IPdaysort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.IPdaytoggle">{{ scope.row.IPdayformat }}</span>
            <span v-if="scope.row.IPdaytoggle">{{ scope.row.IPday }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Month" prop="IPmonthsort" min-width="30" align="center" sortable>
          <template slot-scope="scope">
            <span v-if="!scope.row.IPmonthtoggle">{{ scope.row.IPmonthformat }}</span>
            <span v-if="scope.row.IPmonthtoggle">{{ scope.row.IPmonth }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/transaction'
import DataUtils from '../../../../utils/dataUtils.js'
export default {
  data() {
    return {
      list: null,
      responseToSort: [],
      isSelected: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    mouseEnter(row, cell) {
      row.ApiKeyhourtoggle = true
      row.AuthKeyhourtoggle = true
      row.IPhourtoggle = true

      row.ApiKeydaytoggle = true
      row.AuthKeydaytoggle = true
      row.IPdaytoggle = true

      row.ApiKeymonthtoggle = true
      row.AuthKeymonthtoggle = true
      row.IPmonthtoggle = true
    },
    handleMouseOut: function(row, cell) {
      row.ApiKeyhourtoggle = false
      row.AuthKeyhourtoggle = false
      row.IPhourtoggle = false

      row.ApiKeydaytoggle = false
      row.AuthKeydaytoggle = false
      row.IPdaytoggle = false

      row.ApiKeymonthtoggle = false
      row.AuthKeymonthtoggle = false
      row.IPmonthtoggle = false
    },
    handleRowClick(val) {
      if (this.currentRow === val && this.isSelected === true) {
        this.currentRow === undefined
        this.isSelected = false
        this.$emit('clicked', null)
      } else {
        this.currentRow = val
        this.isSelected = true
        this.$emit('clicked', val.endpoint)
      }
    },

    handleCurrentChange(val) {
      // this.currentRow = val
      // this.$emit('clicked', val.endpoint)
    },
    headerRowClassName({ row, rowIndex }) {
      // if (this.currentRow === undefined) {
      //   this.currentRow = row
      // }
      if (this.currentRow === row && this.isSelected === true) {
        return 'no-hover'
      } else {
        return 'success-row'
      }
    },
    changeHead({ row, column, rowIndex, columnIndex }) {
      return {
        backgroundColor: '#1f2d3d',
        color: 'white',
        fontSize: '18px',
        border: '1px solid #14202f'
      }
    },
    fetchData() {
      fetchList().then(response => {
        const keys = Object.keys(response.data.Data)
        for (const key in keys) {
          const endpointInfo = { [keys[key]]: response.data.Data[keys[key]] }
          endpointInfo.showChart = false
          this.responseToSort.push(endpointInfo)
        }
        this.data = DataUtils.test.sortKeys(this.responseToSort, 'IP')
        this.list = DataUtils.test.convertToTableFormat(this.data)
      })
    }
  }
}
</script>
<style>
.el-table .success-row {
  background-color: #3e546c;
  color: white;
  border: 1px solid #14202f;
}

.el-table .no-hover {
  background-color: #42b983 !important;
  border: 1px solid #14202f;
}

.el-table .success-row:hover > td {
  background-color: #42b983 !important;
  border: 1px solid #14202f;
}

.el-table--border,
.el-table--group {
  width: 100%;
  border-color: #14202f;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #14202f;
}

.colors {
  background-color: #415a6e;
  color: white;
  font-size: 18px;
  border: 1px solid #14202f;
}
</style>
