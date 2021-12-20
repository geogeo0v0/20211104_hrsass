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
          >excel导入</el-button>
          <el-button
            type="danger"
            size="small"
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
            sortable=""
          />
          <el-table-column
            label="姓名"
            prop="username"
            sortable=""
          />
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable=""
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            sortable=""
            :formatter="formatterEmployment"
          />
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable=""
          />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            sortable=""
          >
            <template #default="{ row, column, $index }">
              {{ row.timeOfEntry | formatData }}
            </template>
          </el-table-column>>
          <el-table-column
            label="账户状态"
            prop="enableState"
            sortable=""
          >
            <template #default="{ row, column, $index }">
              <el-switch
                :value="row.enableState === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template #default="{row}">
              <el-button
                type="text"
                size="small"
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

      <add-employee :showDialog.sync="showDialog" />
    </div>
  </div>
</template>
<!-- 审批 -->
<script>
import { reqGetEmployeeList, reqDelEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
export default {
  components: { addEmployee },
  name: 'Approvals',
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      loading: false,
      showDialog: false
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
      console.log('new', newpage)
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
    }
  }

}
</script>

<style>

</style>
