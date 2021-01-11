<template>
  <span>
    <el-button v-show='this.condition.id !== "1"' class="el-plus_connector" @click="updateConnector">{{ connector === '&&' ? '并且' : '或者' }}</el-button>
    <el-select v-model="value" style="width: 40%;" placeholder="请选择" @change="selectData">
      <el-option
        v-for="item in data"
        :key="item.id"
        :label="item.name"
        :value="item.id" >
      </el-option>
    </el-select>
    <el-select v-model="symbol" class="symbol" @change="selectDatas">
      <el-option label=">" value=">"></el-option>
      <el-option label="<" value="<"></el-option>
      <el-option label=">=" value=">="></el-option>
      <el-option label="<=" value="<="></el-option>
      <el-option label="!=" value="!="></el-option>
      <el-option label="==" value="=="></el-option>
    </el-select>
    <el-input v-model="connectorData" class="connectorData" @change="selectDatas"></el-input>
  </span>
</template>

<script>
export default {
  name: 'SelectFrame',
  props: {
    data: Array,
    condition: Object
  },
  data () {
    return {
      value: this.condition.defaultId || '',
      connector: this.condition.connector || '&&',
      symbol: this.condition.symbol || '>',
      connectorData: this.condition.connectorData || '',
      dataList: []
    }
  },
  methods: {
    selectData (item) {
      if (item) {
        this.condition.defaultId = item
      }
      if (this.condition.id !== '1') {
        this.condition.connector = this.connector
      }
      this.condition.symbol = this.symbol
      this.condition.connectorData = this.connectorData
      if (this.connectorData === '' || this.symbol === '') {
        return
      }
      this.data.forEach(element => {
        if (element.id === this.condition.defaultId) {
          this.$emit('selectChange', element, this.condition)
        }
      })
    },
    updateConnector () {
      if (this.connector === '&&') {
        this.connector = '||'
      } else {
        this.connector = '&&'
      }
      this.selectData()
    },
    selectDatas () {
      this.selectData()
    }
  }
}
</script>

<style scoped>
  .el-plus_connector{
    float: right;
    margin-bottom: 10px;
    width: 85%;
  }
  .symbol{
    width: 25%;
    margin-left: 5px;
  }
  .connectorData {
    width: 20%;
    margin-left: 5px;
  }
</style>
