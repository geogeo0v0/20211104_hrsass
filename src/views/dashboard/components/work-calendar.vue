<template>
  <div>
    <!-- 工作日历, 年和月 -->
    <div class="select-box">
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px; margin-right: 10px"
        @change="changeDate"
      >
        <!-- 年份取给定年份的, 前五年 + 后五年 -->
        <el-option
          v-for="item in yearList"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px;"
        @change="changeDate"
      >
        <el-option
          v-for="item in 12"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div>
      <el-calendar v-model="currentDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <div class="date-content">
            <span class="text">{{ data.day | getDay }}</span>
            <span
              v-if="isWeek(date)"
              class="rest"
            >休</span>

          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(day) {
      const str = day.split('-')[2]
      return str.startsWith('0') ? str.slice(1) : str
    }
  },
  props: {
    startDate: {
      type: Date,
      // 对于复杂类型,Object,Array等,通过工厂函数给默认值
      // default: new Date()
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null
      // restDay: [
      //   '2021-12-03',
      //   '2021-12-15',
      //   '2021-12-31'
      // ]
    }
  },
  computed: {
    // 要遍历的年的数组
    yearList() {
      return Array.from({ length: 11 }, (item, index) => index + this.currentYear - 5)
    }

  },
  watch: {
    currentDate(newValue) {
      // console.log(newValue)
      this.currentYear = newValue.getFullYear()
      this.currentMonth = newValue.getMonth() + 1
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()
    this.currentMonth = this.startDate.getMonth() + 1
    this.changeDate()
  },
  methods: {
    changeDate() {
      this.currentDate = new Date(this.currentYear + '-' + this.currentMonth)
    },
    isWeek(date) {
      // 自定义休息时间
      // console.log('data', data.day)
      // return this.restDay.includes(data.day)
      // 周末休
      console.log('date.getDay()', (date.getMonth() + 1))
      return [0, 6].includes(date.getDay()) && (date.getMonth() + 1) === this.currentMonth
    }
  }

}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
  .el-select {
    width: 120px;
    margin-left: 10px;
  }
}

::v-deep .el-calendar-day {
  height:  auto;
 }
::v-deep .el-calendar-table__row td::v-deep .el-calendar-table tr td:first-child, ::v-deep .el-calendar-table__row td.prev{
  border: none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  // margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
::v-deep .el-calendar__header {
   display: none
}
</style>
