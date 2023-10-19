<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="KeyBod">
              <el-input v-model="formData.keyword" style="width:80%" placeholder="关键字...." />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间">
              <div class="block">
                <el-date-picker
                  v-model="formData.createTimeBegin"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="margin-right: 10px;width: 70%;"
                /></div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束时间">
              <div class="block">
                <el-date-picker
                  v-model="formData.createTimeEnd"
                  type="date"
                  placeholder="选择日期时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="margin-right: 10px;width: 70%;"
                /></div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getUser">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="addUser">添 加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delBydIds()">批量删除</el-button>
        </el-row>
      </el-form>
    </div>
    <div class="app-container">
      <!-- 数据表格 -->
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
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="phone" label="手机" />
        <el-table-column label="部门">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.deptName }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.username }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="postName" label="岗位" />
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status === 1"
              @change="switchStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />

        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" title="修改" :disabled="$hasBP('bnt.sysUser.update') === false" @click="editUser(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" title="删除" @click="delBydIds(scope.row)" />
            <el-button type="warning" icon="el-icon-baseball" title="分配角色" @click="showAssignRole(scope.row)" />
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
    <!-- 用户添加/修改 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="userData" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userData.username" />
        </el-form-item>
        <el-form-item v-if="!userData.id" label="密码" prop="password">
          <el-input v-model="userData.password" type="password" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userData.name" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="userData.phone" />
        </el-form-item>
        <el-form-item label="岗位" prop="phone">
          <template>
            <el-select v-model="userData.postId" placeholder="请选择">
              <el-option
                v-for="item in postData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdateM()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="userData.username" />
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRole" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="assignRole">保存</el-button>
        <el-button size="small" @click="dialogRoleVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import api from '@/api/system/user'
import post from '@/api/system/post'

export default {
  data() {
    return {
      formData: {
        page: 1,
        pageSize: 5,
        keyword: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      list: [],
      selectionUser: [],
      userRoleIds: [],
      allRole: [],
      listLoading: true,
      total: 0,
      userData: {
        id: '',
        username: '',
        name: '',
        phone: '',
        postId: '',
        password: '',
        status: 1
      },
      postData: [],
      dialogVisible: false,
      dialogRoleVisible: false,
      saveOrUpdate: false,
      checkAll: false,
      isIndeterminate: false
    }
  },

  created() {
    this.getUser()
  },

  methods: {
    getPost() {
      post.getAll().then((result) => {
        if (result.success) {
          this.postData = result.data
        }
      })
    },
    // 获取选择的行数据
    handleSelectionChange(val) {
      this.selectionUser = val
      console.log(this.selectionUser)
    },
    // 获取全选的角色数据
    handleCheckAllChange(val) {
      this.userRoleIds = val ? this.allRole.map(item => item.id) : []
      this.isIndeterminate = false
    },
    // 获取某个角色数据
    handleCheckedChange(val) {
      const { userRoleIds, allRole } = this
      this.checkAll = userRoleIds.length === allRole.length && allRole.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRole.length
      console.log(val)
    },
    // 重置表单
    resetData() {
      this.formData.keyword = ''
      this.formData.createTimeBegin = ''
      this.formData.createTimeEnd = ''
      this.getUser()
    },
    // 改变当前页
    handleSizeChange(val) {
      this.formData.pageSize = val
      this.getUser()
    },
    // 改变页面尺寸
    handleCurrentChange(val) {
      this.formData.page = val
      this.getUser()
    },
    // 修改用户状态
    switchStatus(val) {
      api.status(val.id, val.status).then((result) => {
        if (result.success) {
          this.$message.success(result.msg)
          this.getUser()
        }
      })
    },
    // 批量删除用户
    delBydIds(val) {
      if (val) {
        this.selectionUser = [val]
        console.log(this.selectionUser)
      }

      if (this.selectionUser.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selectionUser.forEach(function(item, index) {
          ids[index] = item.id
        })
        return api.removeByIds(ids)
      }).then((result) => {
        if (result.success) {
          this.$message.success('删除' + this.selectionUser.length + '条记录')
          this.selectionUser = {}
          this.getUser()
        }
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 获取用户
    getUser() {
      api.getPageList(this.formData).then((result) => {
        this.listLoading = false
        this.list = result.data.records
        this.total = result.data.total
      })
    },

    // 修改用户信息
    editUser(val) {
      this.dialogVisible = true
      this.saveOrUpdate = false
      api.getUserById(val.id).then((result) => {
        this.userData = result.data
      })
      this.getPost()
    },
    // 添加用户
    addUser() {
      this.dialogVisible = true
      this.saveOrUpdate = true
      this.userData = {}
      this.getPost()
    },
    // 提交用户数据
    saveOrUpdateM() {
      if (this.saveOrUpdate) {
        api.save(this.userData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '添加成功！')
            this.getUser()
          }
        })
      } else {
        this.userData.createTime = ''
        this.userData.updateTime = ''
        api.update(this.userData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '修改成功！')
            this.getUser()
          }
        })
      }
    },
    // 查询用户拥有的角色
    showAssignRole(val) {
      this.dialogRoleVisible = true
      this.userData = val
      api.getRolesByUserId(val.id).then((result) => {
        this.allRole = result.data.allRole
        this.userRoleIds = result.data.userRoleIds
        this.checkAll = this.userRoleIds.length === this.allRole.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRole.length
      })
    },
    // 给用户分配角色
    assignRole() {
      var params = { userId: this.userData.id, userRoleIds: this.userRoleIds }
      api.assignRoles(params).then((result) => {
        if (result.success) {
          this.$message.success(result.msg)
          this.dialogRoleVisible = false
        }
      })
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
