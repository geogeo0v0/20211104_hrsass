<template>
  <div class="approvals-container">
    <div class="app-container">
      <el-card>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClickTab"
        >
          <!-- 角色管理start -->
          <el-tab-pane
            label="角色管理"
            name="role"
          >
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="dialogVisible = true"
            >新增角色</el-button>

            <!-- 表格内容start -->
            <el-table
              v-loading="loading"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                :index="indexMethod"
                label="序号"
                width="120"
              />
              <el-table-column
                label="角色名称"
                width="240"
                prop="name"
              />
              <el-table-column
                label="描述"
                prop="description"
              />
              <el-table-column label="操作">
                <template #default="{row}">
                  <el-button
                    size="small"
                    type="success"
                    @click="clickShowAssignDialog(row.id)"
                  >分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="clickEditRole(row.id)"
                  >编辑</el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRole(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 表格内容end -->

            <!-- 分页组件 -->
            <!--
           1. current-page 标记当前页 (谁高亮)
           2. page-sizes 下拉框 选择每页条数列表
           3. page-size 起作用的每页条数
           4. layout 布局, 控制是展示的控件列表布局
           5. total 总条数
        -->
            <el-pagination
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :page-sizes="[ 5, 10]"
              :page-size="pagesize"
              :page-count="1"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <!-- 角色管理end -->

          <!-- 公司信息start -->
          <el-tab-pane
            label="公司信息"
            name="company"
          >公司信息</el-tab-pane>
          <!-- 公司信息end -->

        </el-tabs>

      </el-card>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="width"
      >
        <el-form
          ref="roleForm"
          :model="roleForm"
          label-width="80px"
          :rules="rules"
        >
          <el-form-item
            label="角色名称"
            prop="name"
          >
            <el-input
              v-model="roleForm.name"
              placeholder="请输入角色名称"
            />
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="description"
          >
            <el-input
              v-model="roleForm.description"
              placeholder="请输入角色描述"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="handleSubmitRole"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配权限的弹层 -->
      <el-dialog
        title="分配权限"
        :visible="showAssignDialog"
        @close="closeAssignDialog"
        @open="openAssignDialog"
      >
        <el-tree
          ref="tree"
          v-loading="treeLoading"
          :data="permissionData"
          :props="{label: 'name'}"
          :default-expand-all="true"
          :show-checkbox="true"
          :check-strictly="true"
          node-key="id"
        />
        <template #footer>
          <div style="text-align: right;">
            <el-button @click="closeAssignDialog">取消</el-button>
            <el-button
              type="primary"
              @click="clickAssign"
            >确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<!-- 审批 -->
<script>
import { reqAssignPerm, reqGetRoleList, reqDeleteRole, reqAddRole, reqUpdateRole, reqGetRoleDetail } from '@/api/setting'
import { reqGetPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Approvals',
  data() {
    return {
      activeName: 'role',
      tableData: [],
      page: 1, // 当前页
      pagesize: 5, // 每页条数
      total: 0, // 总条数
      dialogVisible: false,
      showAssignDialog: false,
      roleId: '',
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      permissionData: [],
      treeLoading: false
    }
  },
  computed: {
    dialogTitle() {
      return this.roleForm.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      this.loading = true
      const { data } = await reqGetRoleList(this.page, this.pagesize)
      const { total, rows } = data
      this.total = total
      this.tableData = rows
      this.loading = false
    },

    // 自定义序号
    indexMethod(index) {
      return (this.page - 1) * this.pagesize + index + 1
    },
    closeDialog() {
      this.dialogVisible = false
      this.roleForm = {
        name: '',
        description: ''
      }
      // 重置表单数据
      this.$refs.roleForm.resetFields()
    },
    handleSubmitRole() {
      this.$refs.roleForm.validate(async (valid) => {
        if (!valid) return
        console.log('this.roleForm.id', this.roleForm.id)
        if (this.roleForm.id) {
          await reqUpdateRole(this.roleForm)
        } else {
          await reqAddRole(this.roleForm)
        }
        this.$message.success('操作成功')
        this.closeDialog()
        this.getRoleList()
      })
    },
    handleClickTab() { },
    handleSizeChange(val) {
      console.log('val', val)
      this.pagesize = val
      this.page = 1
      this.getRoleList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getRoleList()
    },
    delRole(id) {
      this.$confirm('确认删除改角色吗?', '温馨提示').then(async () => {
        await reqDeleteRole(id)
        if (this.tableData.length === 1 && this.page > 1) {
          this.page--
        }
        this.$message.success('删除角色成功')
        this.getRoleList()
      }).catch(error => console.log('delRole', error))
    },
    async clickEditRole(id) {
      const { data } = await reqGetRoleDetail(id)
      console.log('data', data)
      this.roleForm = data
      this.dialogVisible = true
    },
    clickShowAssignDialog(id) {
      this.roleId = id
      this.showAssignDialog = true
    },
    closeAssignDialog() {
      this.showAssignDialog = false
    },
    async openAssignDialog() {
      this.treeLoading = true
      const { data } = await reqGetPermissionList()
      // 获取全部权限列表
      this.permissionData = tranListToTreeData(data, '0')
      // 获取已有权限
      const { data: roleDetail } = await reqGetRoleDetail(this.roleId)
      this.$refs.tree.setCheckedKeys(roleDetail.permIds)
      this.treeLoading = false

      console.log('permissionData', this.permissionData)
    },
    async clickAssign() {
      await reqAssignPerm({
        id: this.roleId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.$message.success('分配成功')
      this.showAssignDialog = false
    }
  }
}
</script>

<style>

</style>
