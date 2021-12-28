<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button
            type="primary"
            size="small"
            @click="clickAdd(1,'0')"
          >添加权限</el-button>
        </div>
        <el-table
          :data="tableData"
          border
          row-key="id"
          :tree-props="{children: 'children'}"
        >
          <!-- 用prop属性来对应对象中的键名即可填入数据 -->
          <!-- 用label属性来定义表格的列名。 -->
          <el-table-column
            prop="name"
            label="名称"
            width="width"
          />
          <el-table-column
            prop="code"
            label="标识"
            width="width"
          />
          <el-table-column
            prop="description"
            label="描述"
            width="width"
          />
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template #default="{row}">
              <!-- 当 type为1 时为访问权限， type为2 时为功能权限, 功能权限就不显示添加子权限了 -->
              <el-button
                v-if="row.type === 1"
                size="small"
                type="text"
                @click="clickAdd(2,row.id)"
              >添加权限点</el-button>
              <el-button
                size="small"
                type="text"
                @click="clickShowEdit(row.id)"
              >查看</el-button>
              <el-button
                size="small"
                type="text"
                @click="clickDel(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-dialog
        :title="showTitle"
        :visible.sync="dialogVisible"
        width="width"
        :before-close="dialogBeforeClose"
      >
        <el-form
          ref="form"
          :model="formData"
          label-width="80px"
        >
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-color="#13ce66"
              active-text="启用"
              inactive-text="不启用"
              active-value="1"
              inactive-value="0"
            />

          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogBeforeClose">取 消</el-button>
          <el-button
            type="primary"
            @click="clickSubmit"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!-- 审批 -->
<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      tableData:
        [
          {
            'id': '1',
            'name': 'SAAS企业管理',
            'type': 1,
            'code': 'saas-clients',
            'description': '',
            'pid': '0',
            'enVisible': '0'
          },
          {
            'id': '1063315016368918528',
            'name': '员工管理',
            'type': 1,
            'code': 'employees',
            'description': '用户管理菜单',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1063327833876729856',
            'name': '组织架构',
            'type': 1,
            'code': 'departments',
            'description': '组织架构菜单',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1064104257952813056',
            'name': '权限管理',
            'type': 1,
            'code': 'permissions',
            'description': '权限菜单',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1146308691438043136',
            'name': '社保',
            'type': 1,
            'code': 'social_securitys',
            'description': '社保菜单',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1151424682926747648',
            'name': '考勤',
            'type': 1,
            'code': 'attendances',
            'description': '考勤',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1151747519034093568',
            'name': '工资',
            'type': 1,
            'code': 'salarys',
            'description': '工资模块',
            'pid': '0',
            'enVisible': '1'
          },
          {
            'id': '1172702828368498688',
            'name': '审批',
            'type': 1,
            'code': 'approvals',
            'description': '审批',
            'pid': '0',
            'enVisible': '1'
          }
        ],
      dialogVisible: false,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下

      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      this.tableData = tranListToTreeData(data, '0')
    },
    clickAdd(type, pid) {
      this.dialogVisible = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async clickShowEdit(id) {
      this.dialogVisible = true
      const { data } = await reqGetPermissionDetail(id)
      console.log('', data)
      this.formData = data
    },
    clickDel(id) {
      this.$confirm('确定删除该权限吗', '提示').then(async () => {
        await reqDelPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      }).catch(() => console.log('取消'))
    },

    async clickSubmit() {
      if (this.formData.name === '' || this.formData.code === '') {
        this.$message.error('权限名称和权限标识不能为空')
        return
      }
      this.formData.id ? await reqUpdatePermission(this.formData) : await reqAddPermission(this.formData)
      this.$message.success('操作成功')
      this.getPermissionList()
      this.dialogVisible = false
    },
    dialogBeforeClose() {
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style>

</style>
