<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="操作模块">
              <el-input v-model="formData.title" style="width:80%" placeholder="操作模块" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作人">
              <el-input v-model="formData.opername" style="width:80%" placeholder="操作人" />
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getOperLog">搜索</el-button>
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
        <el-table-column prop="title" label="系统模块" />
        <el-table-column prop="businessType" label="操作类型" />
        <el-table-column prop="requestMethod" label="请求方式" />
        <el-table-column prop="operName" label="操作人员" />
        <el-table-column prop="operIp" label="操作IP" />
        <el-table-column label="请求方法">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <p>{{ scope.row.method }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
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
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="getOne(scope.row.id)">详情</el-button>
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
    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="operData" label-width="100px">
        <el-form-item label="操作模块">
          <el-input v-model="operData.title" disabled="true" />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-input v-model="operData.businessType" disabled="true" />
        </el-form-item>
        <el-form-item label="请求方法">
          <el-input v-model="operData.method" disabled="true" />
        </el-form-item>
        <el-form-item label="请求IP">
          <el-input v-model="operData.operIp" disabled="true" />
        </el-form-item>
        <el-form-item label="操作人员">
          <el-input v-model="operData.operName" disabled="true" />
        </el-form-item>
        <el-form-item label="请求URL">
          <el-input v-model="operData.operUrl" disabled="true" />
        </el-form-item>
        <el-form-item label="操作机器">
          <el-input v-model="operData.operatorType" disabled="true" />
        </el-form-item>
        <el-form-item label="请求类型">
          <el-input v-model="operData.requestMethod" disabled="true" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="operData.createTime" disabled="true" />
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import api from '@/api/system/operLog'

export default {
  data() {
    return {
      formData: {
        page: 1,
        pageSize: 5,
        opername: '',
        title: '',
        createTimeBegin: '',
        createTimeEnd: ''
      },
      operData: {},
      list: [],
      listLoading: true,
      total: 0,
      dialogVisible: false
    }
  },

  created() {
    this.getOperLog()
  },

  methods: {
    // 重置表单
    resetData() {
      this.formData.opername = ''
      this.formData.title = ''
      this.formData.createTimeBegin = ''
      this.formData.createTimeEnd = ''
      this.getOperLog()
    },
    // 改变当前页
    handleSizeChange(val) {
      this.formData.pageSize = val
      console.log(val)
      this.getOperLog()
    },
    // 改变页面尺寸
    handleCurrentChange(val) {
      this.formData.page = val

      this.getOperLog()
    },
    // 获取用户
    getOperLog() {
      api.getPageList(this.formData).then((result) => {
        this.listLoading = false
        this.list = result.data.records
        this.total = result.data.total
      })
    },
    getOne(val) {
      this.dialogVisible = true
      api.getOne(val).then((result) => {
        if (result.success) {
          this.operData = result.data
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
