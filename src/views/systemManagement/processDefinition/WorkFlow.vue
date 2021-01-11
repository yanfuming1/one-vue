<template>
    <div class='containers' ref='content'>
      <div class='canvas' ref='canvas'></div>
      <transition name="el-zoom-in-top">
        <work-flow-expand v-show="isShow" :nodeInfo="nodeInfo" :formKey="formKey" :nodeId="nodeId" :nodeType="nodeType"></work-flow-expand>
      </transition>
      <div class="io-import-export">
        <ul class="io-import io-control io-control-list io-horizontal bpmnxml">
          <li>
            <input type="file" @change="showBPMN()" ref="bpmnxml" style="display: none"/>
            <button title="导入本地BPMN" @click="openLocal()">
              <span class="icons el-icon-folder-add" ></span>
            </button>
          </li>
          <li class="outline">
            <button title="创建一个新的流程图" @click="createNew()">
              <span class="icons el-icon-circle-plus-outline"></span>
            </button>
          </li>
        </ul>
        <ul class="io-import io-control io-control-list io-horizontal tt">
          <li>
            <a ref='saveDiagram' href='javascript:' class="icons el-icon-download" title='导出XML'></a>
          </li>
          <li>
            <a ref='saveSvg' href='javascript:' class="icons el-icon-picture-outline" title='导出SVG'></a>
          </li>
        </ul>
        <ul class="io-import io-control io-control-list io-horizontal">
          <li>
            <button title="保存" @click="saveBPMN()">
              <span class="icons el-icon-check" ></span>
            </button>
          </li>
        </ul>
        <ul class="io-import io-control io-control-list io-horizontal">
          <li>
            <button title="关闭页面" @click="closeTag()">
              <span class="icons el-icon-close" ></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from '../../../bpmn-js/lib/Modeler'
import customTranslate from '../../../util/i18n/customTranslate'
import WorkFlowExpand from './workFlowExpand'
import * as bpmn from '../../../enum/BPMN'
import * as defaultNodeName from '../../../enum/DEFAULTNODENAME'
import defaultXml from '../../../util/defaultXml'
import activiti from '../../../util/activiti'
import { getModelSynopsisIdByDetails, updateModelSynopsisSuspend } from '../../../api/system/workflow'
import { mapActions } from 'vuex'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

export default {
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      processName: '',
      BpmnViewer: null,
      // 节点信息
      nodeData: null,
      // 节点类型
      nodeType: '',
      nodeId: '',
      nodeName: '',
      isShow: false,
      modelSynopsis: null,
      nodeInfo: [],
      formKey: '',
      downloadLink: '',
      downloadSvgLink: ''
    }
  },
  methods: {

    ...mapActions('d2admin/page', [
      'close',
    ]),

    createNewDiagram (item) {

      let bpmnXmlStr = ''
      if (!item) {
        if (this.modelSynopsis && this.modelSynopsis.xml != null && this.modelSynopsis.xml !== '') {
          bpmnXmlStr = this.modelSynopsis.xml
          // 初始化 填充编码
          this.setEncoded (this.downloadLink, 'diagram.bpmn', bpmnXmlStr)
        } else {
          bpmnXmlStr = defaultXml.xml()
        }
      } else {
        bpmnXmlStr = item
      }
        
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
        if (err) {
          console.error(err)
        }
      })
    },
    // SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // bpmn格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      let newXml = ''
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
        newXml = xml
        // 实际 调用的为setEncoded方法
        done(err, xml)
      })
      this.modelSynopsis.xml = newXml
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        // link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    openLocal () {
      this.$refs.bpmnxml.click()
    },
    showBPMN () {
      let than = this
      let bpmn = this.$refs.bpmnxml.files[0]
      let reader = new FileReader();
      reader.readAsText(bpmn, "UTF-8");
      reader.onload = function (evt) {
        than.createNewDiagram (evt.target.result)
      }
    },
    // 创建一个新的流程设计界面
    createNew () {
      this.createNewDiagram()
    },
    // 节点信息存储
    getNodeData (event) {
      if (event && event.element && event.element.type) {
        this.$store.commit('d2admin/processDefinition/setNodeData',  event.element)
        this.nodeType = event.element.type
        this.nodeId = event.element.id
      }
    },
    filtrateNodeData (event, modeling) {
      if (event.element.businessObject.name != null && event.element.businessObject.name !== '') {
        return
      }
      this.isShow = false
      switch (event.element.type) {
        case bpmn.ENDEVENT:
          this.updateNodeData(event, modeling, defaultNodeName.ENDEVENT_NAME)
          break
        case bpmn.USERTEST:
          this.isShow = true
          this.updateNodeData(event, modeling, defaultNodeName.USERTEST_NAME)
          break
        case bpmn.PROCESS:
          this.updateNodeData(event, modeling, defaultNodeName.PROCESS_NAME)
          break
        case bpmn.EXCLUSIVEGATEWAY:
          this.updateNodeData(event, modeling, defaultNodeName.EXCLUSIVEGATEWAY_NAME)
          break
        case bpmn.PARALLELGATEWAY:
          this.updateNodeData(event, modeling, defaultNodeName.PARALLELGATEWAY_NAME)
          break
        case bpmn.STARTEVENT:
          this.updateNodeData(event, modeling, defaultNodeName.STARTEVENT_NAME)
          break
        case bpmn.SEQUENCEFLOW:
          this.isShow = true
          break
      }
    },
    updateNodeData (event, modeling, name) {
      if (this.nodeId !== event.element.id) {
        this.nodeId = event.element.id
      } else {
        return
      }
      modeling.updateProperties(event.element, {
        name: name
      })
    },
    getModelSynopsisIdByDetailsData () {
      let id = this.$route.query.atPresentid
      getModelSynopsisIdByDetails ({'id': id}).then(res => {
        if (res) {
          this.modelSynopsis = res
          this.nodeInfo = JSON.parse(res.nodeInfo)
          this.formKey = res.formKey
          this.$store.commit('d2admin/processDefinition/setInfo', this.modelSynopsis)
          this.createNewDiagram()
        }
      })
    },
    saveBPMN () {
      this.modelSynopsis.nodeInfo = JSON.stringify(this.nodeInfo)
      updateModelSynopsisSuspend(this.modelSynopsis).then(res => {
        if (res.code === 200) {
          this.closeTag ()
          this.$message.success('操作成功')
        }
      })
    },
    closeTag () {
      let query = `?atPresentid=${this.$route.query.atPresentid}`
      let tagName = this.$route.path + query
      let path = 'workflowModel'
      this.close ({ tagName, path })
    }
  },
  mounted () {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas
    let customTranslateModule = {
      translate: ['value', customTranslate]
    }
    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      additionalModules: [
        // 国际化
        customTranslateModule
      ],
      moddleExtensions: {
        activiti: activiti
      }
    })
    // 下载画图
    let _this = this
    _this.$store.commit('d2admin/processDefinition/setBpmnModeler', this.bpmnModeler)
    // 获取a标签dom节点
    _this.downloadLink = this.$refs.saveDiagram
    _this.downloadSvgLink = this.$refs.saveSvg
    // 图层绑定点击事件, 获取用户的点击的节点信息
    this.bpmnModeler.on('element.click', function (event) {
      _this.$store.commit ('d2admin/loading/noAllowShow')
      const modeling = _this.bpmnModeler.get('modeling')
      if (event.element.type === bpmn.SEQUENCEFLOW || event.element.type === bpmn.USERTEST) {
        _this.isShow = true
      } else {
        _this.isShow = false
      }
      _this.getNodeData(event, modeling)
    })
    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('element.changed', function (event) {

      _this.saveSVG(function (err, svg) {
        _this.setEncoded(_this.downloadSvgLink, 'diagram.svg', err ? null : svg)
      })

      _this.saveDiagram(function (err, xml) {
        _this.setEncoded(_this.downloadLink, 'diagram.bpmn', err ? null : xml)
      })

      var sequenceFlowElement = _this.$store.state.d2admin.processDefinition.nodeData
      // 每次元素改变都会触发bpmn:SequenceFlow属性, 如果为bpmn:SequenceFlow属性返回
      if (event && event.element && event.element.type === 'label') {
        return
      }
      if (event && event.element && event.element.type === bpmn.SEQUENCEFLOW && sequenceFlowElement.type !== bpmn.SEQUENCEFLOW) {
        return
      }
      const modeling = _this.bpmnModeler.get('modeling')
      _this.filtrateNodeData(event, modeling)
      _this.getNodeData(event)
    })
  },
  components: {
    WorkFlowExpand
  },
  created () {
    this.getModelSynopsisIdByDetailsData()
  }
}
</script>

<style lang='scss' scope>
  /*左边工具栏以及编辑节点的样式*/
  .containers {
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    .canvas {
    width: 100%;
    height: 100%;
    }
    .panel {
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
    }

    // img, .bpp-field-description{
    //   display: none;
    // }
    .group-label {
      font-style: normal !important;
    }

    .io-import-export{
      position: relative;
      left: 20px;
      bottom: 70px;
      float: left;
    }
    .io-control-list.io-horizontal li {
      display: inline-block;
      button {
        border: 1px solid transparent;
        outline: none;
        background-color: transparent;
        cursor: pointer;
      }
    }
    .io-import {
      margin-right: 10px;
    }
    .io-control-list {
      list-style: none;
      padding: 5px !important;
      margin: 0;
      float: left;
    }
    .io-control {
      background: #FFF;
      border-radius: 2px;
      border: solid 1px #E0E0E0;
      padding: 5px !important;
      margin-right: 15px
    }
    .bpmnxml {
      padding: 6px 10px !important;
      .outline {
        margin-left: 12px;
      }
    }
    .tt {
      a {
        color: #171717 !important;
        text-decoration: solid !important;
        padding: 2px 7px;
        position: relative;
        top: 1px;
      }
    }
    
    .icons {
      font-size: 25px;
    }
  }
</style>
