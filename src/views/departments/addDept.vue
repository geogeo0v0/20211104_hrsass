<template>

  <el-dialog
    :title="showTitle"
    :visible.sync="showDialog"
    :before-close="handleClose"
  >
    <el-form
      ref="deptForm"
      v-loading="loading"
      :model="form"
      label-width="120px"
      :rules="rules"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          type="input"
          placeholder="1-50个字符"
          style="width:80%"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="form.code"
          type="input"
          placeholder="1-50个字符"
          style="width:80%"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          v-model="form.manager"
          placeholder="请选择"
          style="width:80%"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="form.introduce"
          type="textarea"
          placeholder="1-300个字符"
          style="width:80%"
        />
      </el-form-item>

    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <div slot="footer">
      <el-button
        type="primary"
        size="small"
        @click="handleSubmit"
      >确定</el-button>
      <el-button
        size="small"
        @click="handleClose"
      >取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { reqGetEmployeeSimple } from '@/api/employees'
import { reqAddDepartments, reqGetDepartDetail, reqUpdateDepartments } from '@/api/departments'
export default {
  name: 'AddDept',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      required: true
    },
    deptsList: {
      type: Array,
      required: true
    }
  },
  data() {
    const checkNameRepeat = (rule, value, callback) => {
      if (this.form.id) {
        callback()
        return
      }
      // 遍历同级部门, 看有没有重名的
      // item.pid:所有的子部门
      // this.currentNode.id：把当前数据的id作为子部门的pid
      const flag = this.deptsList.filter(item => item.pid === this.currentNode.id).some(i => i.name === value)
      flag ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = (rule, value, callback) => {
      if (this.form.id) {
        callback()
        return
      }
      const flag = this.deptsList.filter(item => item.pid === this.currentNode.id).some(i => i.code === value)
      flag ? callback(new Error(`同级部门下已经有${value}的编码了`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      loading: false,
      peoples: [
        '张三', '李四'
      ],
      rules: {
        name: [
          { required: true, message: '必填1-50字符', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '必填1-50字符', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '必填1-300字符', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.form.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    async getEmployeeSimple() {
      const res = await reqGetEmployeeSimple()
      this.peoples = res.data
    },
    async getDepartDetail(id) {
      this.loading = true
      const { data } = await reqGetDepartDetail(id)
      this.form = data
      this.loading = false
    },
    handleClose() {
      this.$emit('update:showDialog', false)
      // el-form中的resetFields不能重置掉非表单中的一些数据，所以在取消的位置需要强制加上 重置数据
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 管理者
        introduce: '', // 部门介绍
        id: ''
      }
      this.$refs.deptForm.resetFields()
    },
    handleSubmit() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          if (this.form.id) {
            const { message } = await reqUpdateDepartments(this.form)
            this.$message.success(message)
          } else {
            const { message } = await reqAddDepartments({ ...this.form, pid: this.currentNode.id })
            this.$message.success(message)
          }
          this.$emit('add-depts')
          this.handleClose()
        }
      })
    }

  }
}
</script>

<style>

</style>
