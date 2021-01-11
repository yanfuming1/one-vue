<template>
  <div class="sequence-flow">
    <el-form label-width="80px" :model="formLabelAlign" size="medium">
      <el-form-item label="名称:">
        <el-input v-model="formLabelAlign.name" @change="updateUserTaskData"></el-input>
      </el-form-item>
      <el-form-item label="判断条件:">
        <el-button icon="el-icon-plus" size="mini" class="el-plus" @click="addInput"></el-button>
        <div v-for="(data, index) in conditionList" :key="index" class="sequence-flow-selected">
          <select-frame :data="formLabelAlign.condition" :condition="data" @selectChange="selectedData"></select-frame>
          <el-button icon="el-icon-delete" v-show='data.id !== "1"' size="mini" class="el-plus" @click="deleteData(index)"></el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ElementFactory from '../../../../util/elementFactory'
import SelectFrame from '../processModules/selectFrame'
export default {
  name: 'sequenceFlow',
  props: {
    nodeId: String
  },
  data () {
    return {
      formLabelAlign: {
        name: '',
        condition: [
          {
            id: '1',
            name: '条件一'
          },
          {
            id: '2',
            name: '条件二'
          },
          {
            id: '3',
            name: '条件三'
          },
          {
            id: '4',
            name: '条件四'
          },
          {
            id: '5',
            name: '条件五'
          }
        ],
        value: '',
        nodeId: ''
      },
      conditionList: [
        {
          id: '1',
          defaultId: '1',
          defaultName: '',
          connector: '',
          symbol: '',
          connectorData: ''
        }
      ],
      dataList: []

    }
  },
  methods: {
    updateUserTaskData (item) {
      ElementFactory.updateName(item)
    },
    addInput () {
      let item = {
        id: (this.conditionList.length + 1).toString(),
        defaultId: '',
        defaultName: '',
        connector: '',
        symbol: '',
        connectorData: ''
      }
      this.conditionList.push(item)
    },
    selectedData (item, condition) {
      let connectorStr = ''
      if (item != null && item !== '') {
        let num = this.conditionList.indexOf(condition)
        this.conditionList[num]['defaultId'] = item.id
        this.conditionList[num]['defaultName'] = item.name
        this.conditionList[num]['connector'] = condition.connector
        this.conditionList[num]['symbol'] = condition.symbol
        this.conditionList[num]['connectorData'] = condition.connectorData
      }
      this.conditionList.forEach((item, indexs) => {
        switch (item.connector) {
          case '||':
            if (this.conditionList.length === 2) {
              connectorStr = connectorStr + ' || ' + item.defaultId + item.symbol + item.connectorData
              return
            }
            let conne = connectorStr.split('&&')
            let dataOr = []
            let dataAnd = []
            connectorStr = ''
            conne.forEach(dev => {
              if (dev.indexOf('||') !== -1) {
                dataOr.push(dev)
              } else {
                dataAnd.push(dev)
              }
            })
            if (dataOr.length === 0) {
              // connectorStr = connectorStr + ' || ' + item.defaultId + item.symbol + item.connectorData
              dataAnd.forEach((ent, index) => {
                if (dataAnd.length - 1 === index) {
                  connectorStr += '(' + ent + ' || ' + item.defaultId + item.symbol + item.connectorData + ')'
                } else {
                  connectorStr += ent + '&&'
                }
              })
            } else {
              dataOr.forEach((element, indexer) => {
                let s = element.replace(/[()]/g, '')
                if (dataOr.length - 1 === indexer) {
                  connectorStr += '(' + s + ' || ' + item.defaultId + item.symbol + item.connectorData + ')'
                } else {
                  connectorStr = connectorStr + s + '|| '
                }
                dataAnd.forEach(and => {
                  connectorStr += '&&' + and
                })
              })
            }
            break
          case '&&':
            connectorStr = connectorStr + ' && ' + item.defaultId + item.symbol + item.connectorData
            break
          default:
            connectorStr += item.defaultId + item.symbol + item.connectorData
            break
        }
      })
      ElementFactory.UpdateSequenceFlow(connectorStr)
    },
    deleteData (index) {
      this.conditionList.splice(index, 1)
      this.selectedData()
    },
    updateDefaultData () {
      let nodeData = this.$store.state.d2admin.processDefinition.nodeData.businessObject
      if (nodeData == null) {
        return
      }
      this.formLabelAlign.name = nodeData.name || ''
      this.formLabelAlign.nodeId = nodeData.id || ''
      let conditionExpression = ''
      if (nodeData.conditionExpression && nodeData.conditionExpression.body) {
        conditionExpression = nodeData.conditionExpression.body
      } else {
        this.conditionList = []
        this.addInput()
        return
      }
      this.dataList = []
      let condition = conditionExpression.replace(/[${}]/g, '')
      let andList = condition.split('&&')
      andList.forEach(item => {
        if (item.indexOf('||') !== -1) {
          let s = item.replace(/[()]/g, '')
          let orList = s.split('||')
          orList.forEach(element => {
            this.filtrateData(element, '||')
          })
        } else {
          this.filtrateData(item, '&&')
        }
      })
    },
    // 添加获取条件信息
    setConditionData (ter, symbol, connector) {
      this.formLabelAlign.condition.forEach(item => {
        let id = ter[0].replace(/(^\s*)|(\s*$)/g, '')
        if (item.id === id) {
          let conditionData = {
            id: (this.dataList.length + 1).toString(),
            defaultId: item.id,
            defaultName: item.name,
            connector: connector,
            symbol: symbol,
            connectorData: ter[1]
          }
          this.dataList.push(conditionData)
        }
      })
      this.conditionList = this.dataList
    },
    filtrateData (data, connector) {
      if (data.indexOf('>') !== -1) {
        let greater = data.split('>=')
        if (greater.length > 1) {
          this.setConditionData(greater, '>=', connector)
        } else {
          greater = data.split('>')
          this.setConditionData(greater, '>', connector)
        }
      } else if (data.indexOf('<') !== -1) {
        let greater = data.split('<=')
        if (greater.length > 1) {
          this.setConditionData(greater, '<=', connector)
        } else {
          greater = data.split('<')
          this.setConditionData(greater, '<', connector)
        }
      } else if (data.indexOf('!=') !== -1) {
        let greater = data.split('!=')
        this.setConditionData(greater, '!=', connector)
      } else if (data.indexOf('==') !== -1) {
        let greater = data.split('==')
        this.setConditionData(greater, '==', connector)
      }
    }
  },
  components: {
    SelectFrame
  },
  created () {
    this.updateDefaultData()
  },
  watch: {
    nodeId () {
      this.updateDefaultData()
    }
  }
}
</script>

<style scoped>
  label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .el-plus {
    float: right;
    cursor: pointer;
  }
  .sequence-flow-selected {
    padding: 0 0 10px 0;
  }
  .el-button--mini, .el-button--mini.is-round{
    padding: 11px 7px;
  }
</style>
