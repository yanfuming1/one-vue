<template>
  <div style="height:97%" class="detailMsgBox">
      <el-card class="box-card" style="height:100%">
        <div slot="header" >
          <h1 class="d2-text-center">{{detailData.title}}</h1>
          <h3 class="d2-text-center">{{detailData.subheading}}</h3>
          <br>
          <h4 class="d2-text-center headerClolr">最后编辑：{{detailData.updateTime}} 浏览量：{{detailData.browse ? detailData.browse : 0}}</h4>
        </div>
        <div v-html="detailData.content" class="detailData-content"></div>
        <!-- <quill-editor v-html="detailData.content" ref="myQuillEditor"  :options="editorOption"  style="height: 400px" >
        </quill-editor> -->
        
        <el-row class="d2-mt">
          <el-col :span="24" class="d2-text-center">
            <el-button type="info" size="mini" @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import {newsDetails} from "../../../../api/personal-information/messageManagement"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { mapActions } from 'vuex'
  export default {
    name: 'newsDetail',
    components: {
      quillEditor
    },
    data() {
      return {
        editorOption: {},
        detailData: {
          title: '',
          subheading: '',
          updateTime: '',
          browse: '',
          content: ''
        }
      }
    },
    methods: {
      ...mapActions('d2admin/page', [
          'close',
          'open' // 打开一个新页面
      ]),
      cancel() {
        this.$router.go(-1)
        let tagName = this.$route.path
        this.close ({ tagName })
      }
    },
    mounted () {
      let params = null;
      params = this.$route.params.detailData;
      //  117389933267569459
      if (typeof params === 'object') {
        this.detailData = params;
      } else {
        newsDetails ({id:params}).then((res)=>{
          this.detailData = res;
        })
      }
    },
  }
</script>

<style lang="scss">
.headerClolr{
  color: rgb(192,179,182)
}
.detailMsgBox .ql-container{
  height: 90%;
}
.detailData-content {
  height: 550px;
  overflow: auto;
}
</style>