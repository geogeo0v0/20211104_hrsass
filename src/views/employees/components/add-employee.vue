<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    :before-close="closeDialog"
  >
    <el-form
      ref="addEmployee"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="姓名"
        prop="username"
      >
        <el-input
          v-model="formData.username"
          style="width:50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item
        label="手机"
        prop="mobile"
      >
        <el-input
          v-model="formData.mobile"
          style="width:50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item
        label="入职时间"
        prop="timeOfEntry"
      >
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width:50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item
        label="聘用形式"
        prop="formOfEmployment"
      >
        <el-select
          v-model="formData.formOfEmployment"
          style="width:50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="工号"
        prop="workNumber"
      >
        <el-input
          v-model="formData.workNumber"
          style="width:50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item
        label="部门"
        prop="departmentName"
      >
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @click.native="getDepartments"
        />
        <div
          class="tree-box"
          v-if="showTree"
        >
          <el-tree
            :data="treeData"
            :props="{label:'name'}"
            @node-click="selectNode"
            v-loading="loading"
          >
          </el-tree>

        </div>
      </el-form-item>
      <el-form-item
        label="转正时间"
        prop="correctionTime"
      >
        <el-date-picker
          v-model="formData.correctionTime"
          style="width:50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <template #footer>

      <el-button
        type=""
        @click="closeDialog"
      >取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetDepartments } from '@/api/departments'
import { reqAddEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  name: 'AddEmployee',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      showTree: false,
      treeData: [],
      loading: false,
      EmployeeEnum
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialog', false)
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果

    },
    // 获取树型部门数据
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { data } = await reqGetDepartments()
      this.treeData = tranListToTreeData(data.depts, '')
      this.loading = false
    },
    // 选择部门节点
    selectNode(node) {
      if (node.children?.length > 0) return
      this.formData.departmentName = node.name
      this.showTree = false
      console.log(' this.formData.departmentName', this.formData.departmentName)
    },
    async handleSubmit() {
      await reqAddEmployee(this.formData)
      this.$message.success('添加成功')
      this.closeDialog()
      // 通知到父组件更新数据
      this.$parent.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: hidden;
  background-color: #fff;
}
</style>