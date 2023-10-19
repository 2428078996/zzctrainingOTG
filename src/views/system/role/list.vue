<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input v-model="formData.queryParams" style="width: 60%" placeholder="角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getRole">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="addRole">添 加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delBydIds()">批量删除</el-button>
        </el-row>
      </el-form>
    </div>
    <div class="app-container">
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        stripe
        border
        style="width: 100%;margin-top: 10px;"
        @selection-change="handleSelectionChange"
      >

        <el-table-column width="70" align="center" type="selection" />
        <el-table-column label="序号" width="70" align="center" type="index" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column prop="createTime" icon="el-icon-time" label="创建时间" width="200" />
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" value="修改" @click="editRole(scope.row.id)" />
            <el-button type="danger" icon="el-icon-delete" value="删除" @click="removeDataById(scope.row.id)" />
            <el-button type="warning" icon="el-icon-baseball" title="分配权限" @click="showAssignAuth(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="block" style="margin-top:20px;float:right">
        <el-pagination
          :current-page="formData.page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="formData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="roleData" :rules="rules" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="roleData.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="roleData.roleCode" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleData.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdateM()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import api from '@/api/system/role'
export default {
  data() {
    return {
      formData: {
        page: 1,
        pageSize: 5,
        queryParams: ''
      },
      list: [],
      selectionRole: [],
      listLoading: true,
      total: 0,
      roleData: {
        id: '',
        roleName: '',
        roleCode: '',
        description: ''
      },
      dialogVisible: false,
      saveOrUpdate: false,
     
    }
  },

  created() {
    this.getRole()
  },

  methods: {
    // 给角色分配权限
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id=' + row.id + '&roleName=' + row.roleName)
    },
    // 获取选择的行数据
    handleSelectionChange(val) {
      this.selectionRole = val
    },
    // 重置表单
    resetData() {
      this.formData.queryParams = ''
      this.getRole()
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.formData.pageSize = val
      this.getRole()
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.formData.page = val
      this.getRole()
    },
    // 批量删除角色
    delBydIds() {
      if (this.selectionRole.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selectionRole.forEach(function(item, index) {
          ids[index] = item.id
        })
        return api.removeByIds(ids)
      }).then((result) => {
        if (result.success) {
          this.$message.success(result.msg || '删除成功！')
          this.getRole()
        }
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 获取角色
    getRole() {
      api.getPageList(this.formData).then((result) => {
        this.listLoading = false
        this.list = result.data.records
        this.total = result.data.total
      })
    },
    // 根据id删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.getRole(this.page)
        this.$message.success(response.msg || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    // 修改用户信息
    editRole(id) {
      this.roleData = {}
      this.dialogVisible = true
      this.saveOrUpdate = false
      api.getRoleById(id).then((result) => {
        this.roleData = result.data
      })
    },

    addRole() {
      this.dialogVisible = true
      this.saveOrUpdate = true
      this.roleData = {}
    },

    saveOrUpdateM() {
      if (this.saveOrUpdate) {
        api.save(this.roleData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '添加成功！')
            this.getRole()
          }
        })
      } else {
        api.update(this.roleData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '修改成功！')
            this.getRole()
          }
        })
      }
    }

  }

}
</script>

<style>
    .search-div {
        padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
    }
    .tools-div {
        margin-top: 10px;padding:10px;border: 1px solid #EBEEF5;border-radius:3px;
    }
</style>
