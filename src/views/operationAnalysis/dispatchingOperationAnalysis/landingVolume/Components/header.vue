<template>
  <div class="header">
    <el-form :inline="true" size="mini" :model="formInline" class="form-inline">
      <el-form-item label="搜索站点">
        <el-select
          @change="getLabel"
          ref="elSelectWrapperUp"
          style="width:200px;"
          multiple
          filterable
          collapse-tags
          clearable
          v-model="formInline.station"
          remote
          reserve-keyword
          :remote-method="remoteMethod"
          placeholder="请选择">
          <el-option
            v-for="item in searchStationOptions"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
      <el-form-item label="选择日期">
        <el-date-picker
          v-model="formInline.date"
          style="width: 410px;"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </el-form-item>
        <el-form-item label="选择时间">
          <el-time-select
          style="width: 120px"
          placeholder="起始时间"
          v-model="formInline.startTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '24:00'
          }">
        </el-time-select>
        -
        <el-time-select
          placeholder="结束时间"
          style="width: 120px"
          v-model="formInline.endTime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '24:00',
            minTime: formInline.startTime
          }">
        </el-time-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="warning" @click="onClear">重置</el-button>
      </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment'
export default {
  data () {
    return {
      formInline: {
        station: [],
        date: [],
        startTime: '07:00',
        endTime: '09:00'
      },
      loading: false,
      searchStation: '',
      selectStation: [],
      lineOptions: [],
      stationOptions: [],
      searchStationOptions: [],
      tableData: []
    }
  },
  created () {
    let endTime = new Date()
    let startTime = new Date() - 3600 * 1000 * 24
    this.formInline.date[0] = moment(startTime).format('YYYY-MM-DD')
    this.formInline.date[1] = moment(endTime).format('YYYY-MM-DD')
  },
  mounted () {
    this._lineList()
    this._stationList()
    if (this.formInline.station.length > 0) {
      this._lineStation({
        startDate: this.formInline.date[0],
        endDate: this.formInline.date[1],
        stationIds: this.formInline.station,
        startHour: this.formInline.startTime.substring(0, 2),
        endHour: this.formInline.endTime.substring(0, 2)
      })
    }
  },
  watch: {
  },
  methods: {
    _lineList () {
      this.$store.dispatch('getLineList').then(res => {
        this.lineOptions = res
      })
    },
    _stationList () {
      this.$store.dispatch('getStationList').then(res => {
        let arr = res
        arr.forEach(item => {
          this.stationOptions.push({
            value: item.staUuid,
            label: item.staName
          })
        })
      })
    },
    _lineStation (params) {
      this.$api['schedulingAnalysis.getStationOnOffTableDatas'](params).then(res => {
        if (res.length !== 0) {
          this.tableData = res
          this.$emit('configTableData', this.tableData)
          this.$message.success('数据更新')
        } else {
          this.selectStation = {}
          this.tableData = []
          this.$emit('configTableData', this.tableData)
          this.$message.warning('暂无数据')
        }
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.searchStationOptions = this.stationOptions.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getLabel (val) {
      // this.selectStation = [];
      // val.forEach(i => {
      //   this.selectStation.push(this.stationOptions.filter(item => item.label === i));
      // });
      // console.log(this.selectStation);
    },
    onSubmit () {
      console.log(this.formInline.date)
      if (this.formInline.date.length === 0 ||
        this.formInline.station.length === 0 ||
        this.formInline.startTime === '' ||
        this.formInline.startTime === null ||
        this.formInline.endTime === '' ||
        this.formInline.endTime === null
      ) {
        this.$message.error('请填写完整的查询信息')
      } else {
        this.formInline.date[0] = moment(this.formInline.date[0]).format('YYYY-MM-DD')
        this.formInline.date[1] = moment(this.formInline.date[1]).format('YYYY-MM-DD')
        this.selectStation = this.formInline.station.map(item => item.label)
        let idArry = this.formInline.station.map(item => item.value)
        // console.log(this.selectStation);
        this.$emit('selectStation', this.selectStation)
        this._lineStation({
          startDate: this.formInline.date[0],
          endDate: this.formInline.date[1],
          stationIds: idArry,
          startHour: this.formInline.startTime.substring(0, 2),
          endHour: this.formInline.endTime.substring(0, 2)
        })
      }
    },
    onClear () {
      this.formInline = {
        station: [],
        date: [],
        startTime: '',
        endTime: ''
      }
    }
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  min-height: 110px;
  border-bottom: 1px solid #eee;
  padding: 20px 20px;
  box-sizing: border-box;
  box-shadow: 0 1px 10px rgba(0,0,0, 0.5);
  .form-inline {
   height: 38px;
  }
}
</style>
