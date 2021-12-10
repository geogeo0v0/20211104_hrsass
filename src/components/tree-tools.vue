<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%;"
  >
    <!-- 左边部门 -->
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <!-- 右边负责人和操作 -->
    <el-col :span="4">
      <el-row
        type="flex"
        justify="end"
      >
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown
            trigger="click"
            @command="handleCommand"
          >
            <span @click.stop>操作<i class="el-icon-arrow-down" /> </span>

            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDepartments } from '@/api/departments'
export default {
  name: 'TreeTools',
  props: {
    // 定义传入的属性
    nodeData: {
      type: Object,
      required: true
    },
    // 是否根节点
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    handleCommand(type) {
      switch (type) {
        case 'add':
          this.$emit('add-depts', this.nodeData)
          break;
        case 'edit':
          this.$emit('edit-depts', this.nodeData)
          break;
        case 'del':
          this.$confirm('确认删除吗?', '温馨提示').then(async () => {
            await reqDelDepartments(this.nodeData.id)
            this.$message.success('删除成功')

            this.$emit('del-depts')
          }).catch(error =>
            console.log('error')
          )
          break;
        default:
          console.log('handleCommand', type)

          break;
      }
    }
  }
}
</script>

<style>

</style>