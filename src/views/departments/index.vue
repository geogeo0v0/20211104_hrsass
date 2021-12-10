<template>
  <div class="departments-container">
    <el-card
      class="tree-card"
      v-loading="loading"
    >
      <!-- 头部 -->
      <tree-tools
        :node-data="company"
        :isRoot="true"
        @add-depts="handleAddDepts"
      ></tree-tools>
      <el-tree
        :data="departs"
        :props="defaultProps"
        :default-expand-all="true"
      >
        <!-- 用了一个行列布局 -->
        <template #default="{ data }">
          <tree-tools
            :node-data="data"
            @open-dialog="handleDialogVisible"
            @del-depts="getDepartments"
            @add-depts="handleAddDepts"
            @edit-depts="handleEditDepts"
          ></tree-tools>
        </template>
      </el-tree>
    </el-card>
    <add-dept
      ref="addDeptDialog"
      :showDialog.sync="dialogVisible"
      :depts-list="deptsList"
      :current-node="currentNode"
      @add-depts="getDepartments"
    ></add-dept>
  </div>
</template>
<!--审批 -->
<script>
import treeTools from "../../components/tree-tools.vue";
import AddDept from './addDept.vue';
import { reqGetDepartments, } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  components: { treeTools, AddDept },
  name: "Departments",
  created() {
    this.getDepartments()
  },
  data() {
    return {
      loading: false, // 用来控制进度弹层的显示和隐藏
      list: [
        {
          name: "企业部",
          children: [{ name: "策划部" }, { name: "游戏部" }],
        },
        { name: "事件部" },
        { name: "小卖部" },
      ],
      company: {
        name: 'hello',
        manager: '负责人',
        id: ''
      },
      defaultProps: {
        label: "name",
        children: "children",
      },
      departs: [], // 树形数据
      deptsList: [], // 列表式数据
      dialogVisible: false,
      currentNode: {} // 当前节点
    };
  },
  methods: {
    // 获取组织架构数据
    async getDepartments() {
      this.loading = true
      const { data } = await reqGetDepartments()
      this.departs = tranListToTreeData(data.depts, '') // 树形数据
      this.deptsList = data.depts // 列表式数据
      this.loading = false

    },
    // 添加子部门
    handleAddDepts(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    // 编辑部门
    handleEditDepts(node) {
      this.$refs.addDeptDialog.getDepartDetail(node.id)
      this.dialogVisible = true
      this.currentNode = node
    },
    handleDialogVisible(flag) {
      this.dialogVisible = flag
    }
  }
};
</script>

<style scoped lang="scss">
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
  ::v-deep {
    .el-tree-node__content {
      height: 36px;
    }
    // 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/minus-circle.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/user-filling.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
