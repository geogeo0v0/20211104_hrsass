<template>
  <div class="approvals-container">
    <div class="app-container">
      <page-tools>
        <template #left>

          总记录条数: 16条
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
          >新增员工</el-button>
        </template>
      </page-tools>

      <el-card style="margin-top:10px">
        <el-table
          border
          :data="list"
          v-loading="loading"
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
          />
          <el-table-column
            label="账户状态"
            prop="enableState"
            sortable=""
          />
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
          >
            <template>
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
    </div>
  </div>
</template>
<!-- 审批 -->
<script>
import { reqGetEmployeeList } from '@/api/employees'
export default {
  name: 'Approvals',
  data() {
    return {
      list: [],
      page: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      loading: false
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
      console.log('row', rows)
      this.list = rows
      this.total = total
      this.loading = false
    },
    handleCurrentChange(newpage) {
      this.page = newpage
      this.getEmployeeList()
    },
    indexMethod(val) {
      return this.pageSize * (this.page - 1) + val + 1
    }
  }

}
</script>

<style>

</style>