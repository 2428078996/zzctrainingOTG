<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="岗位名称">
              <el-input v-model="formData.name" style="width: 60%" placeholder="岗位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位编码">
              <el-input v-model="formData.postCode" style="width: 60%" placeholder="岗位编码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位状态">
              <el-radio-group v-model="formData.status">
                <el-radio-button :label="1">正常</el-radio-button>
                <el-radio-button :label="0">停用</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getPost">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
          <el-button type="success" icon="el-icon-plus" size="mini" @click="addPost">添 加</el-button>
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
        <el-table-column prop="name" label="岗位名称" />
        <el-table-column prop="postCode" label="角色编码" />
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status===1"
              @change="changeStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" icon="el-icon-time" label="创建时间" width="200" />
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" value="修改" @click="editRole(scope.row.id)" />
            <el-button type="danger" icon="el-icon-delete" value="删除" @click="delBydIds(scope.row)" />
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
      <el-form ref="dataForm" :model="postData" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="岗位名称">
          <el-input v-model="postData.name" />
        </el-form-item>
        <el-form-item label="岗位编码">
          <el-input v-model="postData.postCode" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="postData.description" />
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
import api from '@/api/system/post'
export default {
  data() {
    return {
      formData: {
        page: 1,
        pageSize: 5,
        name: '',
        postCode: '',
        status: ''
      },
      list: [],
      selectionPost: [],
      listLoading: true,
      total: 0,
      postData: {
        id: '',
        name: '',
        postCode: '',
        description: ''
      },
      dialogVisible: false,
      saveOrUpdate: false
    }
  },

  created() {
    this.getPost()
  },

  methods: {
    // 获取选择的行数据
    handleSelectionChange(val) {
      this.selectionPost = val
      console.log(this.selectionPost)
    },
    // 重置表单
    resetData() {
      this.formData.name = ''
      this.formData.postCode = ''
      this.formData.status = ''
      this.getPost()
    },
    changeStatus(val) {
      api.switchStatus(val.id, val.status).then((result) => {
        if (result.success) {
          this.$message.success(result.msg)
          this.getPost()
        }
      })
    },

    handleSizeChange(val) {
      this.formData.pageSize = val
      this.getPost()
    },

    handleCurrentChange(val) {
      this.formData.page = val
      this.getPost()
    },
    // 批量删除角色
    delBydIds(val) {
      if (val) {
        this.selectionPost = [val]
        console.log(this.selectionPost)
      }
      if (this.selectionPost.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        this.selectionPost.forEach(function(item, index) {
          ids[index] = item.id
        })
        console.log(ids)
        return api.removeByIds(ids)
      }).then((result) => {
        if (result.success) {
          this.$message.success(result.msg || '删除成功！')
          this.selectionPost = {}
          this.getPost()
        }
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    },
    // 获取角色
    getPost() {
      api.getPageList(this.formData).then((result) => {
        this.listLoading = false
        this.list = result.data.records
        this.total = result.data.total
      })
    },
    // 根据用户ID获取用户信息
    editRole(id) {
      this.postData = {}
      this.dialogVisible = true
      this.saveOrUpdate = false
      api.getPostById(id).then((result) => {
        this.postData = result.data
      })
    },

    addPost() {
      this.dialogVisible = true
      this.saveOrUpdate = true
      this.postData = {}
    },

    saveOrUpdateM() {
      if (this.saveOrUpdate) {
        api.save(this.postData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '添加成功！')
            this.getPost()
          }
        })
      } else {
        api.update(this.postData).then((result) => {
          if (result.success) {
            this.dialogVisible = false
            this.$message.success(result.msg || '修改成功！')
            this.getPost()
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
