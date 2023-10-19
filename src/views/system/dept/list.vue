<template>
  <div class="app-container">

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" :disabled="$hasBP('bnt.sysDept.add') === false" @click="add()">添 加</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table
      :data="sysDeptList"
      style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="name" label="部门名称" width="210" />
      <el-table-column prop="leader" label="部门负责人" width="210" />
      <el-table-column prop="phone" label="部门电话" width="210" />
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            :disabled="scope.row.children.length > 0"
            @change="changeMenuStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="210" />

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type !== 2" type="success" icon="el-icon-plus" size="mini" title="添加下级节点" @click="add(scope.row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" :disabled="scope.row.children.length > 0" @click="removeDataById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 修改或者添加 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysDept" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="sysDept.id === ''" label="上级部门">
          <el-input v-model="sysDept.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="sysDept.name" />
        </el-form-item>
        <el-form-item label="部门领导" prop="name">
          <el-input v-model="sysDept.leader" />
        </el-form-item>
        <el-form-item label="电话" prop="name">
          <el-input v-model="sysDept.phone" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="sysDept.sortValue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysDept.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/dept'
export default {
  // 定义数据
  data() {
    return {
      sysDeptList: [],
      expandKeys: [], // 需要自动展开的项
      dialogTitle: '',

      dialogVisible: false,
      saveBtnDisabled: false,
      sysDept: {
        id: '',
        parentId: '',
        name: '',
        sortValue: 1,
        status: 1
      }
    }
  },

  // 当页面加载时获取数据
  created() {
    this.getDept()
  },

  methods: {
    // 调用api层获取数据库中的数据
    getDept() {
      api.findNodes().then((result) => {
        this.sysDeptList = result.data
        console.log(this.sysDeptList)
      })
    },
    // 修改状态
    changeMenuStatus(val) {
      api.changeMenuStatus(val.id, val.status).then((result) => {
        if (result.success) {
          this.$message.success(result.msg)
          this.getDept()
        }
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
      }).then((result) => {
        this.getDept()
        this.$message({
          type: 'success',
          message: result.msg
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    // 弹出添加的表单
    add(row) {
      this.dialogTitle = '添加下级节点'
      this.dialogVisible = true
      this.sysDept = {}
      this.sysDept.id = ''
      if (row) {
        this.sysDept.parentId = row.id
        this.sysDept.parentName = row.name
        this.sysDept.treePath = row.treePath
      } else {
        this.dialogTitle = '添加目录节点'
        this.sysDept.parentId = 0
      }
    },

    // 编辑
    edit(row) {
      this.dialogTitle = '修改菜单'
      this.dialogVisible = true

      this.sysDept = Object.assign({}, row)
      this.sysDept.createTime = ''
      this.sysDept.updateTime = ''
    },

    // 添加或更新
    saveOrUpdate() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.sysDept.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // 添加
    save() {
      api.save(this.sysDept).then(response => {
        this.$message.success(response.msg || '操作成功')
        this.dialogVisible = false
        this.sysDept = {}
        this.getDept()
      })
    },

    // 更新
    update() {
      api.updateById(this.sysDept).then(response => {
        this.$message.success(response.msg || '操作成功')
        this.dialogVisible = false
        this.sysDept = {}
        this.getDept()
      })
    }
  }
}
</script>
