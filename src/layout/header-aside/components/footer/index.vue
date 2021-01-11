<template>
    <el-row>
      <el-col :span="24" style="text-align: right">
        <el-pagination
          :current-page="pageNo"
          :page-size="pageSize"
          :total="total"
          :page-sizes="sizes"
          :disabled="loading"
          :layout="sizes.includes(size) ? layout : simple"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </el-row>
      <!-- style="float: right;position: relative" -->

</template>

<script>
export default {
  props: {
    current: {
      default: 1
    },
    size: {
      default: 10
    },
    total: {
      default: 0
    },
    loading: {
      default: false
    }
  },
  data() {
    return {
      sizes: [10, 25, 50, 100, 250, 500],
      layout: 'total, sizes, prev, pager, next, jumper',
      simple: 'total, prev, pager, next, jumper',
      pageNo: 1,
      pageSize: 10
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('change', {
        current: this.pageNo,
        size: val,
        total: this.total
      })
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.$emit('change', {
        current: val,
        size: this.pageSize,
        total: this.total
      })
      this.pageNo = val;
    }
  },
  watch: {
    size: {
      deep:true,
      handler(value) {
        this.pageSize = value;
      }
    },
    current: {
      deep:true,
      handler(value) {
        this.pageNo = value;
      }
    },
  },
}
</script>
