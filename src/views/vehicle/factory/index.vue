<template>
  <div class="app-container">

    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工厂编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入工厂编码" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工厂名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入工厂名称" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="工厂简称" prop="shortName">
        <el-input v-model="queryParams.shortName" placeholder="请输入工厂简称" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="注释" prop="remark">
        <el-input v-model="queryParams.remark" placeholder="请输入注释" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="IP地址" prop="ip">
        <el-input v-model="queryParams.ip" placeholder="请输入IP地址" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="省份" prop="province">
        <el-input v-model="queryParams.province" placeholder="请输入省份" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRangeCreateTime" size="small" style="width: 240px" value-format="yyyy-MM-dd"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-form-item label="经度" prop="lon">
        <el-input v-model="queryParams.lon" placeholder="请输入经度" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="纬度" prop="lat">
        <el-input v-model="queryParams.lat" placeholder="请输入纬度" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['vehicle:factory:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   v-hasPermi="['vehicle:factory:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="工厂编码" align="center" prop="code" />
      <el-table-column label="工厂名称" align="center" prop="name" />
      <el-table-column label="工厂简称" align="center" prop="shortName" />
      <el-table-column label="注释" align="center" prop="remark" />
      <el-table-column label="IP地址" align="center" prop="ip" />
      <el-table-column label="省份" align="center" prop="province" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" align="center" prop="lon" />
      <el-table-column label="纬度" align="center" prop="lat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['vehicle:factory:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['vehicle:factory:delete']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 对话框(添加 / 修改) -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工厂编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入工厂编码" />
        </el-form-item>
        <el-form-item label="工厂名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工厂名称" />
        </el-form-item>
        <el-form-item label="工厂简称" prop="shortName">
          <el-input v-model="form.shortName" placeholder="请输入工厂简称" />
        </el-form-item>
        <el-form-item label="注释" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入注释" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="省份" prop="province">
          <el-input v-model="form.province" placeholder="请输入省份" />
        </el-form-item>
        <el-form-item label="经度" prop="lon">
          <el-input v-model="form.lon" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input v-model="form.lat" placeholder="请输入纬度" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createFactory, updateFactory, deleteFactory, getFactory, getFactoryPage, exportFactoryExcel } from "@/api/vehicle/factory";

export default {
  name: "Factory",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工厂配置列表
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dateRangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        code: null,
        name: null,
        shortName: null,
        remark: null,
        ip: null,
        province: null,
        lon: null,
        lat: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        code: [{ required: true, message: "工厂编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "工厂名称不能为空", trigger: "blur" }],
        shortName: [{ required: true, message: "工厂简称不能为空", trigger: "blur" }],
        ip: [{ required: true, message: "IP地址不能为空", trigger: "blur" }],
        province: [{ required: true, message: "省份不能为空", trigger: "blur" }],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // 处理查询参数
      let params = {...this.queryParams};
      this.addBeginAndEndTime(params, this.dateRangeCreateTime, 'createTime');
      // 执行查询
      getFactoryPage(params).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 表单重置 */
    reset() {
      this.form = {
        id: undefined,
        code: undefined,
        name: undefined,
        shortName: undefined,
        remark: undefined,
        ip: undefined,
        province: undefined,
        lon: undefined,
        lat: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工厂配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getFactory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工厂配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        // 修改的提交
        if (this.form.id != null) {
          updateFactory(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
          return;
        }
        // 添加的提交
        createFactory(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除工厂配置编号为"' + id + '"的数据项?').then(function() {
          return deleteFactory(id);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // 处理查询参数
      let params = {...this.queryParams};
      params.pageNo = undefined;
      params.pageSize = undefined;
      this.addBeginAndEndTime(params, this.dateRangeCreateTime, 'createTime');
      // 执行导出
      this.$modal.confirm('是否确认导出所有工厂配置数据项?').then(() => {
          this.exportLoading = true;
          return exportFactoryExcel(params);
        }).then(response => {
          this.$download.excel(response, '${table.classComment}.xls');
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
