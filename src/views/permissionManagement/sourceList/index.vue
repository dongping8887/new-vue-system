<template>
  <div class="wrapper">
    <div class="search clearfix">
      <el-button class="fr" type="primary" @click="handleAddRole">添加角色</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="排序" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.roleSort}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色名称" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色描述" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.describes}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.enabled === '1' ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" :formatter="getCreateTime">
        </el-table-column>
        <el-table-column align="center" label="修改时间" :formatter="getUpdateTime">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.roleName === '超级管理员'">
              ----
            </div>
            <div v-else>
              <el-button
                size="mini"
                type="primary"
                @click="handleCheck(scope.row.roleId)"
              >操作</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handleAllot(scope.row.roleId)"
              >分配权限</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteRole(scope.row.roleId)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="330px">
      <div>
        <el-row>
        <span>角色名称：</span>
        <el-input
          style="width: 200px"
          v-model="roleName"
          placeholder="请输入角色名称">
        </el-input>
        </el-row>
        <el-row style="margin-top: 20px">
        <span>是否禁用：</span>
        <el-select
          style="width: 200px"
          v-model="enabled"
          placeholder="请选择">
          <el-option
            v-for="item in enableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="dialogRoleVisible"
      width="300px">
      <div>
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultTreeData"
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAllotubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="updateWrapper"
      width="420px">
      <el-form label-width="100px" :model="adminForm" ref="adminForm" :rules="rules">
        <el-form-item label="排序：" prop="roleSort">
          <el-input
            style="width: 240px"
            placeholder="请输入账号"
            v-model="adminForm.roleSort"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" prop="roleName">
          <el-input
            style="width: 240px"
            placeholder="角色名称"
            v-model="adminForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="describes">
          <el-input
            style="width: 240px"
            placeholder="角色描述"
            v-model="adminForm.describes"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用：" prop="enabled">
          <el-select
            style="width: 240px"
            v-model="adminForm.enabled"
            placeholder="请选择">
            <el-option
              v-for="item in enableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmitUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Role',
  data () {
    return {
      list: [],
      dialogVisible: false,
      dialogRoleVisible: false,
      updateWrapper: false,
      roleName: '',
      enabled: '',
      allotId: '',
      adminForm: {
        roleId: '',
        roleSort: '',
        roleName: '',
        describes: '',
        enabled: ''
      },
      rules: {
        roleSort: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        describes: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      enableOptions: [
        {
          value: '1',
          label: '启用'
        },
        {
          value: '0',
          label: '禁用'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      defaultTreeData: [],
      total: '',
      currentPage: 1
    }
  },
  created () {
    this.getSysRoleList()
  },
  methods: {
    getSysRoleList () {
      this.$api['role.list']({
        pageSize: 10,
        pageNumber: this.currentPage
      }).then(res => {
        this.list = res.list
      })
    },
    onRoleSubmit () {
      if (this.roleName.length > 0) {
        this.$api['role.add']({
          roleName: this.roleName,
          enabled: this.enabled
        }).then(res => {
          this.getSysRoleList()
          this.$message.success('添加成功!')
          this.dialogVisible = false
        })
      } else {
        this.$message.error('请输入角色名称')
      }
    },
    handleDeleteRole (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['role.delete']({
          id: id
        }).then(res => {
          this.getSysRoleList({
            pageSize: 10,
            pageNumber: this.currentPage
          })
          this.$message.success('删除成功！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleAllot (id) {
      this.dialogRoleVisible = true
      this.allotId = id
      // queryPermission('sys/function/function/query', {
      //   roleId: id
      // }).then(res => {
      //   if (res.code === 0) {
      //     this.treeData = res.data.allTreeMapList
      //     this.defaultTreeData = res.data.checkNodeIds
      //   }
      // })
    },
    onAllotubmit () {
      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // updateSysRole('sys/role/function/update', {
      //   checkedKeys: checkedKeys.join(','),
      //   sysRoleId: this.allotId
      // }).then(res => {
      //   if (res.code === 0) {
      //     this.dialogRoleVisible = false
      //     this.$message.success('分配成功！')
      //   }
      // })
    },
    handleCheck (id) {
      this.updateWrapper = true
      this.adminForm.roleId = id
      this.$api['role.detail']({
        id
      }).then(res => {
        this.adminForm.roleName = res.roleName
        this.adminForm.describes = res.describes
        this.adminForm.roleSort = res.roleSort
        this.adminForm.enabled = res.enabled
      })
    },
    onSubmitUpdate () {
      this.$api['role.update'](this.adminForm).then(res => {
        this.getSysRoleList({
          pageSize: 10,
          pageNumber: this.currentPage
        })
        this.$message.success('修改成功！')
        this.updateWrapper = false
      })
    },
    handleAddRole () {
      this.roleName = ''
      this.dialogVisible = true
    },
    getCreateTime (row) {
      return moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
    },
    getUpdateTime (row) {
      return moment(row.updateTime).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  padding: 20px 20px;
  box-sizing: border-box;
  .search {
    margin-bottom: 20px;
  }
}
</style>
