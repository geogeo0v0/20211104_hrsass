<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    :before-close="closeRoleDialog"
    @open="dialogOpen"
  >
    <!-- v-model绑定Array类型的变量 -->
    <el-checkbox-group
      v-model="roleIds"
      v-loading="loading"
    >
      <el-checkbox
        v-for="item in roleList"
        :key="item.id"
        :label="item.id"
      >{{item.name}}</el-checkbox>

    </el-checkbox-group>
    <template #footer>
      <el-button
        type="primary"
        size="small"
        @click="clickSubmit"
      >确定</el-button>
      <el-button
        size="small"
        @click="closeRoleDialog"
      >取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetRoleList } from '@/api/setting'
import { reqGetUserDetailById } from '@/api/user'
import { reqAssignRoles } from '@/api/employees'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },

  methods: {
    dialogOpen() {
      // 打开弹框->发送获取角色列表的请求和获取当前用户拥有的角色的请求
      // v-model绑定选中的多选框roleIds 和label值匹配
      this.loading = true
      Promise.all([this.getRoleList(),
      this.getUserDetailById()]).then(() => this.loading = false)
    },
    async getRoleList() {
      const { data: { rows } } = await reqGetRoleList()
      this.roleList = rows
    },
    async getUserDetailById() {
      const { data: { roleIds } } = await reqGetUserDetailById(this.userId)
      this.roleIds = roleIds
    },
    async clickSubmit() {
      await reqAssignRoles({ id: this.userId, roleIds: this.roleIds })
      this.closeRoleDialog()
      this.$message.success('分配成功')
    },
    closeRoleDialog() {
      this.$emit('update:showRoleDialog', false)
    },

  }
}
</script>
<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      font-size: 30px;
    }
  }
}
</style>