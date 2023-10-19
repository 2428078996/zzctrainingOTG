<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="登录用户">
              <el-input v-model="formData.username" style="width:80%" placeholder="登录用户" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getLoginLog">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
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
      >

        <el-table-column label="序号" width="70" align="center" type="index" />
        <el-table-column prop="username" label="登录账号" />
        <el-table-column prop="ipaddr" label="登录IP" />
        <el-table-column label="操作状态">
          <template slot-scope="scope">
            <p v-if="scope.row.status ===1">
              成功
            </p>
            <p v-if="scope.row.status===0">
              失败
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="提示信息" />
        <el-table-column prop="createTime" label="创建时间" />
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
  </div>

</template>

<script>
import api from '@/api/system/loginLog'

export default {
  data() {
    return {
      formData: {
        page: 1,
        pageSize: 5,
        usernaem: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      list: [],
      listLoading: true,
      total: 0,
      dialogVisible: false
    }
  },

  created() {
    this.getLoginLog()
  },

  methods: {
    // 重置表单
    resetData() {
      this.formData.username = ''
      this.formData.createTimeBegin = ''
      this.formData.createTimeEnd = ''
      this.getLoginLog()
    },
    // 改变当前页
    handleSizeChange(val) {
      this.formData.pageSize = val
      this.getLoginLog()
    },
    // 改变页面尺寸
    handleCurrentChange(val) {
      this.formData.page = val
      this.getLoginLog()
    },
    // 获取用户
    getLoginLog() {
      api.getPageList(this.formData).then((result) => {
        this.listLoading = false
        this.list = result.data.records
        this.total = result.data.total
      })
    },
    getOne(val) {
      api.getOne(val).then((result) => {
        if (result.success) {
          this.loginLog = result.data
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
