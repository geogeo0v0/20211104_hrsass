<template>
  <div class="approvals-container">
    <div class="app-container">
      <page-tools>
        <template #left>

          总记录条数: {{total}}条
        </template>
        <template #right>
          <el-button
            type="warning"
            size="small"
            @click="$router.push('/import?type=user')"
          >excel导入</el-button>
          <el-button
            type="danger"
            size="small"
            @click="clickExport"
          >excel导出</el-button>
          <el-button
            type="primary"
            size="small"
            @click="addEmployee"
          >新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top:10px">
        <el-table
          border
          v-loading="loading"
          :data="list"
        >
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
          />
          <el-table-column
            label="姓名"
            prop="username"
          />
          <el-table-column
            label="头像"
            prop="staffPhoto"
          >
            <template #default="{ row }">
              <img
                v-imgerror="defaultImg"
                class="staff"
                :src="row.staffPhoto || defaultImg"
                alt=""
                @click="clickShowCodeDialog(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterEmployment"
          />
          <el-table-column
            label="部门"
            prop="departmentName"
          />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
          >
            <template #default="{ row, column, $index }">
              {{ row.timeOfEntry | formatData }}
            </template>
          </el-table-column>>
          <el-table-column
            label="账户状态"
            prop="enableState"
          >
            <template #default="{ row }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="280"
          >
            <template #default="{row}">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
              >转正</el-button>
              <el-button
                type="text"
                size="small"
              >调岗</el-button>
              <el-button
                type="text"
                size="small"
              >离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 60px; margin-top: 10px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      <!-- 分享展示, 预览的二维码的弹层 -->
      <el-dialog
        title="二维码"
        :visible="showCodeDialog"
        :before-close="closeDialog"
      >
        <el-row
          type="flex"
          justify="center"
        >
          <canvas ref="myCanvas" />
        </el-row>
      </el-dialog>
      <assign-role
        :show-role-dialog.sync="showRoleDialog"
        :user-id="userId"
      />
      <add-employee :showDialog.sync="showDialog" />
    </div>
  </div>
</template>
<!-- 审批 -->
<script>
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees'
import QrCode from 'qrcode'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
export default {
  components: { addEmployee, AssignRole },
  name: 'Approvals',
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: '',
      defaultImg: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2146034403,1504718527&fm=26&gp=0.jpg'
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { data } = await reqGetEmployeeList(this.page, this.pageSize)
      const { rows, total } = data
      this.list = rows
      this.total = total
      this.loading = false
    },
    formatterEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getEmployeeList()
    },
    indexMethod(val) {
      return this.pageSize * (this.page - 1) + val + 1
    },
    addEmployee() {
      this.showDialog = true
    },
    delEmployee(id) {
      this.$confirm('确定删除该员工吗?', '提示').then(async () => {
        await reqDelEmployee(id)
        if (this.list.length === 1 && this.page > 1) {
          this.page--
        }
        this.getEmployeeList()
        this.$message.success('删除成功')

      }
      ).catch((error) => console.log('取消'))
    },
    // 导出
    async clickExport() {
      // 请注意: 如果导出的是当前页, 那么数据, this.list 即可,
      // 但是我们一般导出的是全部的数据, 需要请求到所有的数据
      const { data: { rows } } = await reqGetEmployeeList(1, this.total)
      const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const headersRelations = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const dataArr = this.formatJson(rows, headersArr, headersRelations)
      import('@/vendor/Export2Excel').then(excel => {
        console.log('excel', excel)
        excel.export_json_to_excel({
          header: headersArr, // 表格头部
          data: dataArr, // 二维数组
          filename: '批量员工数据', // 导出的文件名
          autoWidth: true, // 是否开启单元格宽度自适应
          bookType: 'xlsx' // 类型
        })
      })
    },

    // 导出数据格式化-将表头数据和数据进行对应
    formatJson(rows, headersArr, headersRelations) {
      // [
      //   [ 值1, 值2, 值3, ... ]
      // ]
      console.log({ rows, headersArr, headersRelations })
      const resArr = rows.map(item => {
        const arr = []
        headersArr.forEach(key => {
          arr.push(item[headersRelations[key]])
        })
        return arr
      })
      return resArr
    },

    clickShowCodeDialog(url) {
      if (!url) return
      this.showCodeDialog = true
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url)
      })

    },
    closeDialog() {
      this.showCodeDialog = false
    },
    editRole(id) {
      this.showRoleDialog = true
      this.userId = id
    }
  }

}
</script>

<style lang="scss" scoped>

  .staff {
    width: 70px;
    height: 70px;
    border-radius: 50%;
}
</style>