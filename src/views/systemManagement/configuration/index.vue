<template>
  <d2-container class="configuration">
    <el-card  style="min-height:100%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="公司基本信息" name="first">
          <system-tabs :childrenData="childrenData"></system-tabs>
        </el-tab-pane>
        <el-tab-pane label="付款金额上限设置" name="second">
          <money-tabs :childrenData="childrenData"></money-tabs>
        </el-tab-pane>
        <el-tab-pane label="审批特权设置" name="third">
          <module-tabs :childrenData="childrenData"></module-tabs>
        </el-tab-pane>
        <el-tab-pane label="数据库备份与恢复" name="six">
          <data-base ></data-base>
        </el-tab-pane>
        <el-tab-pane label="是否开启在线编辑" name="seven">
          <on-line-preview :onLinePreviewData='onLinePreviewData'></on-line-preview>
        </el-tab-pane>
        <el-tab-pane label="定时任务设置" name="eight">
          <timed-task :childrenData="childrenData"></timed-task>
        </el-tab-pane>
        <el-tab-pane label="阿里短信语音设置" name="nine">
          <alibaba-voice :childrenData='childrenData'></alibaba-voice>
        </el-tab-pane>
        <el-tab-pane label="发票识别设置" name="ten">
          <invoice :childrenData='childrenData'></invoice>
        </el-tab-pane>
        <!-- <el-tab-pane label="项目" name="fourth"> -->
          <!-- <project-tabs :childrenData="childrenData"></project-tabs> -->
        <!-- </el-tab-pane> -->
        <el-tab-pane label="其他设置" name="five">
          <other-tabs :childrenData="childrenData"></other-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </d2-container>
</template>

<script>
  import moduleTabs from './components/moduleTabs';
  import moneyTabs from './components/moneyTabs';
  import projectTabs from './components/projectTabs';
  import systemTabs from './components/systemTabs';
  import otherTabs from './components/otherTabs';
  import dataBase from './components/database';
  import onLinePreview from './components/onLinePreview';
  import timedTask from './components/timedTask';
  import alibabaVoice from './components/alibabaVoice';
  import invoice from './components/invoice';
  import {searchPageList, fileOnlineView} from '../../../api/configuration/index';
  export default {
    components: {
      moneyTabs,
      projectTabs,
      systemTabs,
      moduleTabs,
      otherTabs,
      dataBase,
      onLinePreview,
      timedTask,
      alibabaVoice,
      invoice
    },
    data() {
      return {
        activeName: 'first',
        selectData:{
           options:[],
        },
        childrenData: [],
        onLinePreviewData: []
      }
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab.name)
        let data = '1';
        switch (tab.name) {
          case 'first':
            data = '1';
            break;
          case 'second':
            data = '2';
            break;
          case 'third':
            data = '3';
            break;
          case 'fourth':
            data = '4';
            break;
          case 'five':
            data = '5';
            break;
          case 'eight':
            data = '6';
            break;
          case 'nine':
            data = '7';
            break;
          case 'ten':
            data = '8';
            break;
          case 'seven':
            data = '9';
            break
          default:
            break;
        }
        // if(tab.name === 'seven') {
        //   fileOnlineView({id: '1'}).then(res => {
        //     this.onLinePreviewData = res
        //   })
        // } else {
          searchPageList({'identification':data}).then(res => {
              if(data === '9') { this.onLinePreviewData = res || [] } 
               else { this.childrenData = res || []; }
          })
        // }
      }
    },
    mounted () {
      this.activeName = 'first';
      searchPageList({'identification':'1'}).then(res => {            
        this.childrenData = res || [];
      })
    },
  }
</script>

<style lang="scss" >
.configuration{
  .el-input.is-disabled .el-input__inner{
    background-color: #ffffff;
    cursor: pointer;
    border: 0;
  }
}
</style>