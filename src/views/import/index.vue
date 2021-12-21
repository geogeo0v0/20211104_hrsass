<template>
  <upload-excel :on-success="handleSuccess" />
</template>

<script>
import { reqImportEmployee } from '@/api/employees'
export default {
  name: 'Import',
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    handleSuccess({ header, results }) {
      switch (this.type) {
        case 'user':
          this.typeUserImport(header, results)
          break;

        default:
          break;
      }
      // data: [{}, {}, {}, {}, ... ]

      // const arr = []
      // results.forEach(item => {
      //   let obj = {}
      //   for (let key in item) {
      //     obj[userRelations[key]] = item[key]
      //   };
      //   arr.push(obj)
      // });
      // console.log('result11111', arr)
    },
    async typeUserImport(header, results) {
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = results.reduce((pre, cur) => {
        const obj = {}
        for (let key in cur) {
          ['timeOfEntry', 'correctionTime'].includes(userRelations[key]) ? obj[userRelations[key]] = this.formatExcelDate(cur[key], '-') : obj[userRelations[key]] = cur[key]

        }
        pre.push(obj)
        return pre
      }, [])
      console.log('arr', arr)
      const { message } = await reqImportEmployee(arr)
      this.$message.success(message)
    },
    formatExcelDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)  // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
