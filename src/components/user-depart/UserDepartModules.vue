<template>
    <div class="user-div" v-if="showUserModule">
      <div class="user-module-box">
        <el-header>选择用户</el-header>
        <el-main>
          <el-row>
            <el-col :span="12" class="pt-10">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="员工" name="first">
                  <div class="tab-con">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <el-input placeholder="搜索" v-model="filterText" class="search" size="mini"></el-input>
                      </el-col>
                    </el-row>
                    <el-tree
                      :data="dataMember"
                      node-key="id"
                      ref="tree"
                      :show-checkbox="defaultProps.showCheckbox"
                      :props="defaultProps"
                      :default-checked-keys="defaultCheckedUserKeys"
                      :filter-node-method="filterNode"
                      @check="getNodeInfo">
                    </el-tree>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="部门" name="second">
                  <div class="tab-con">
                    <el-row>
                      <el-col :span="20" :offset="2">
                        <el-input placeholder="搜索" v-model="filterText" class="search" size="mini"></el-input>
                      </el-col>
                    </el-row>
                    <el-tree
                      :data="dataDepart"
                      node-key="id"
                      ref="tree1"
                      :show-checkbox="defaultProps.showCheckbox"
                      :default-checked-keys="defaultCheckedDepartKeys"
                      :props="defaultProps"
                      :filter-node-method="filterNode"
                      @check="getNodeDepart">
                    </el-tree>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="12" class="pt-10">
              <el-row>
                <el-col :span="16">
                  <p class="chose-info">
                    已选择  员工(<span>{{ choseNumber }}</span>) 部门(<span>{{ choseDepart }}</span>)
                  </p>
                </el-col>
                <el-col :span="8">
                  <el-button class="clear-btn" @click="clearAll">清空</el-button>
                </el-col>
              </el-row>
              <div class="tab-con">
                <p v-show="choseList.length<1" class="no-con">没有选择内容</p>
                <ul id="v-for-object" v-show="choseList.length>0" class="chose-li">
                  <li v-for="value in choseList" :key='value.id'>
                    <p>{{ value.name }}<i class="el-icon-close" @click="deleteChose(value)"></i></p>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-main>
        <el-row class="button">
          <el-button type="primary" size="small" @click="getUserData">确定</el-button>
          <el-button size="small" @click="closeModule">关闭</el-button>
        </el-row>
      </div>
    </div>
</template>
<script>
import { GetDepartTree } from '../../api/system/depart/depart-tree'
import { staffStaffDictionary } from '../../api/system/staff/staff'
let temp = []
export default {
  name: 'UserDepartModules',
  props: {
    user: {
      type: Array,
      default: () => []
    },
    department: {
      type: Array,
      default: () => []
    },
    showUserModule: {
      type: Boolean,
      default: false
    },
    namesList: {
      type: Array,
      default: ''
    }
  },
  components: {
  },
  data: function () {
    return {
      filterText: '',
      activeName: 'first',
      choseList: [],
      choseNumber: 0,
      choseDepart: 0,
      dataMember: [],
      dataDepart: [],
      defaultProps: {
        children: 'child',
        label: 'name',
        showCheckbox: true
      },
      defaultCheckedUserKeys: [],
      defaultCheckedDepartKeys: []
    }
  },
  methods: {
    handleClick (tab, event) {
      this.activeName = tab.name
    },
    // 人员树的选择
    getNodeInfo (data, obj) {
      // obj是树中被选中的节点
      if(this.isCheckTest(data, obj)){
        // 当前节点是选中状态
        if(!this.checkToRight(data)){
          // 不存在的时候加入右边
          this.choseList.push(data)
          this.choseNumber++
        }
      } else {
        // 当前节点不是选中状态
        if(this.checkToRight(data)){
          this.deleteChose(data)
        }
      }
    },
    // 部门树的选择
    getNodeDepart (data, obj) {
      if(this.isCheckTest(data,obj)){
        // 当前节点是选中状态
        if(!this.checkToRight(data)){
          this.choseList.push(data)
          this.choseDepart++
        }
      } else {
        if(this.checkToRight(data)){
          this.deleteChose(data)
        }
      }
    },
    // 判断当前节点是否被选择
    isCheckTest (data, obj) {
      let isChecked = false
      obj.checkedKeys.forEach(function (item, index) {
        if(data.id === item){
          isChecked = true
        }
      })
      return isChecked
    },
    // 判断当前节点是否在右边已经存在
    checkToRight (data) {
      let exist = false
      this.choseList.forEach(function (item, index) {
        if(data.id === item.id){
          exist = true
        }
      })
      return exist
    },
    deleteChose (item) {
      // 删除选中的内容
      for (let i = 0; i < this.choseList.length; i++) {
        if (this.choseList[i].id === item.id) {
          // 把选中的清除
          this.choseList.splice(i, 1)
        }
      }
      if(item.id.indexOf('H') === -1){
        // 说明删除的是员工
        this.choseNumber--
        this.$refs.tree.setChecked(item.id, false, false)
      }else{
        // 说明删除的是部门
        this.choseDepart--
        this.$refs.tree1.setChecked(item.id, false, false)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    clearAll () {
      this.choseList = []
      this.$refs.tree.setCheckedNodes([])
      this.$refs.tree1.setCheckedNodes([])
    },
    getUserData () {
      // 获取选中的数据返回给父级
      this.$emit('getChoseData', this.choseList)
    },
    closeModule () {
      // this.$emit('getChoseData', this.choseList, 2)
      this.$emit('closeModule')
    },
    setAttr (data) {
      // 对人员的数据进行选择限制
      let that = this
      if(data.children !== undefined){
        data.disabled = true
        data.children.forEach(function (item, index) {
          that.setAttr(item)
        })
      }
      return
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },

    user : {
      deep: true,
      immediate: true,
      handler(val) {
        this.choseNumber = val.length
        this.defaultCheckedUserKeys = val
      }
    },

    department : {
      deep: true,
      immediate: true,
      handler(val) {
        this.choseDepart = val.length
        this.defaultCheckedDepartKeys = val
      }
    },
    
    namesList : {
      deep: true,
      immediate: true,
      handler(val) {
        this.choseList = val
      }
       
    }
  },
  created () {
    // dataDepart:部门
    // dataMember:人员
    // 为dataMember做限制
    let that = this
    this.dataMember.forEach(function (item, index) {
      that.setAttr(item)
    })
    this.dataDepart.forEach(function (item, index) {
      that.setAttr(item)
    })
  },
  mounted () {
    if (this.showUserModule) {
      this.clearAll()
    }
    this.choseDepart = 0
    this.choseNumber = 0
  },
  created () {
    staffStaffDictionary().then(res => {
      this.dataMember = res
    })
    GetDepartTree().then(res => {
      this.dataDepart = []
      this.dataDepart.push(res)
    })
  }
}
</script>
<style scoped>
.user-div{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: rgba(0,0,0,.1);
  border-radius: 5px;
  z-index: 2130;
}
.user-module-box{
  width: 700px;
  height: 500px;
  background: #ffffff;
  margin-left: calc(50% - 350px);
  margin-top: 100px;
  /* box-shadow: 1px 1px 11px #bfbfbf; */
}
header{
  background: #F5F5F5;
  border-bottom: 1px solid rgba(0,0,0,.1);
  line-height: 60px;
}
.button{
  text-align: right;
  padding-right: 30px;
}
.pt-10{
  padding: 0px 10px;
}
.chose-info{
  color: rgba(0,0,0,.4);
  margin: 10px 0px 5px 0px;
  height: 40px;
}
.clear-btn{
  color: #409EFF;
  border: none;
  line-height: 21px;
  float: right;
}
.clear-btn:hover{
  background: none;
}
.btn-div{
  padding-top: 150px;
}
.tab-con{
  height: 270px;
  border: 1px solid #d7dae2;
  border-radius: 4px;
  overflow-y: scroll;
}
.chose-li{
  padding-left: 0px;
  margin: 5px 0px;
}
.chose-li li{
  list-style: none;
  cursor: pointer;
  padding: 5px 0px 5px 10px;
}
.chose-li li p{
  margin: 0px;
  color: rgba(0,0,0,.5);
  font-size: 15px;
  line-height: 21px;
}
.chose-li li:hover{
  background: #EDF3FC;
}
.chose-li li i{
  float: right;
  margin-right: 10px;
  display: none;
  font-weight: bold;
}
.chose-li li:hover i{
  display: block;
  line-height: 21px;
}
.no-con{
  text-align: center;
  color: rgba(0,0,0,.5);
}
.search{
  margin: 5px 0px;
}
.el-input__inner{
  height: 30px !important;
  border-radius: 15px !important;
}
</style>
