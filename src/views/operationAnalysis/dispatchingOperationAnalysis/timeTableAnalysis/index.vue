<template>
  <div class="time-table-analysis">
    <header>
      <headerNav @configCheck="configCheck"></headerNav>
    </header>
    <div class="content">
      <contentWrapper
        :headerParams="headerParams"
        :isUpdateUp="isUpdateUp"
        :isUpdateDown="isUpdateDown"
        @isUpdateFaUp="isUpdateFaUp"
        @isUpdateFaDown="isUpdateFaDown"
      ></contentWrapper>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import headerNav from './Components/header'
import contentWrapper from './Components/content'
import moment from 'moment'
export default {
  name: 'timeTableAnalysis',
  data () {
    return {
      headerParams: {},
      isUpdateUp: false,
      isUpdateDown: false,
      timeNow: '',
      initLine: ''
    }
  },
  components: {
    headerNav,
    contentWrapper
  },
  created () {
    this.getInitLineid()
  },
  watch: {
    headerParams: {
      deep: true,
      handler () {
        this.timeNow = moment(Date.now()).valueOf()
      }
    }
  },
  methods: {
    configCheck (data) {
      let oldTime = this.timeNow
      this.timeNow = moment(Date.now()).valueOf()
      if (this.timeNow - oldTime < 1) {
        this.$message.warning('短时间内请勿重复操作')
      } else {
        this.isUpdateUp = true
        this.isUpdateDown = true
      }
      this.headerParams = data
    },
    isUpdateFaUp () {
      this.isUpdateUp = false
    },
    isUpdateFaDown () {
      this.isUpdateDown = false
    },
    getInitLineid () {
    }
  }
}
</script>

<style lang="scss" scoped>
.time-table-analysis {
  width: 100%;
}
</style>
