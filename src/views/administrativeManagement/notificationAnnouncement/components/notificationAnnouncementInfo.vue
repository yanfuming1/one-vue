<template>
    <div class="addPubilshDialog">
        <el-form :model="addPubilshData" ref="addPubilshData" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="addPubilshData.title" placeholder="请输入消息标题"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subheading">
                <el-input v-model="addPubilshData.subheading" placeholder="请输入消息副标题"></el-input>
            </el-form-item>
            <el-row>
            <el-col :span="11">
                <el-form-item label="类型" prop="type">
                    <el-select v-model="addPubilshData.type" placeholder="请选择消息类型" style='width:100%'>
                        <el-option
                            v-for="it in typeOptions"
                            :key="it.value"
                            :label="it.label"
                            :value="it.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="11" :offset='2'>
                <el-form-item label="可见范围" prop="scopeName">
                    <qqt-input v-model="addPubilshData.scopeName"  :value="addPubilshData.scopeName" readonly placeholder="请选择授权对象" @btnClick="showScopeDialog" @input="addPubilshData.scopeName = $event" btnTitle="选择"></qqt-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="外部链接" prop="url">
            <el-input v-model="addPubilshData.url" placeholder="可输入外部链接"></el-input>
        </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="打开方式：">
                        <el-radio-group v-model="addPubilshData.openMode">
                            <el-radio v-model="radio" label="1">当前窗口</el-radio>
                            <el-radio v-model="radio" label="2">新窗口</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否置顶：">
                        <el-switch v-model="addPubilshData.stick"
                            active-value="1"
                            inactive-value="0">
                    </el-switch>
                     </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                 <el-col :span="12">
                    <el-form-item label="发布状态:">
                        <el-radio-group v-model="addPubilshData.state">
                            <el-radio v-model="radio" label="0">草稿件</el-radio>
                            <el-radio v-model="radio" label="1">正式文件</el-radio>
                            <el-radio v-model="radio" label="2">发布文件</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
           <el-form-item  prop="content">
               <div class="message-content-c">
                   <span class="message-content">*</span> <p> 消息内容</p>
               </div>
                    
                    <quill-editor v-model="addPubilshData.content" ref="myQuillEditor"  :options="editorOption"  style="height: 200px" >
                    </quill-editor>
            </el-form-item>
        </el-form>
        <user-modules v-if="isShow" :userIds="user" :department="department" :startCrew="startCrew" @clearUserPage="clearUserPage" @closeFun="closeFun"></user-modules>
    </div>
</template> 

<script>
import userModules from './userModules';
import { quillEditor } from 'vue-quill-editor'
import UserDepartModules from '../../../../components/user-depart/UserDepartModules'
import { qqtInput} from '../../../../components/qqt-subassembly'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    name: "addPublishInfo",
    props:{
        addPubilshInfo:Object
    },
    data () {
        return {
            rules: {
                title: [{ required: true, message: "请输入消息标题", trigger: 'blur' }],
                subheading: [{ required: true, message: "请输入消息副标题", trigger: 'blur' }],
                type: [{ required: true, message: "请选择消息类型", trigger: 'blur' }],
                scopeName: [{ required: true, message: "请选择可见范围", trigger: 'blur' }],
                content: [{ required: true, message: "请填写内容", trigger: ["blur",'change'] }],
            },
            addPubilshData:{
                title:'',
                subheading:'',
                content:'',
                type:'',
                scopeName:'',
                url:'',
                state:'',
                stick:0,
                openMode:'1'
            },
            typeOptions:[{
                value: '1',
                label: '系统'
                }, {
                value: '2',
                label: '公告'
                }, {
                value: '3',
                label: '通知'
                }, {
                value: '4',
                label: '消息'
            }],
            isAuditman: false,
            isCopire: false,
            content: null,
            editorOption: {},
            isTop:true,
            radio: '1',
            myType: '',
            isShow:false,
            user: [],
            department: [],
            startCrew: [],
        }
    },
    methods: {
      // 可视范围
      showScopeDialog () {
          this.isShow = true;
      },
      clearUserPage(item) {
            this.isShow = !this.isShow
            this.getDataModule(item)
      },
      getDataModule (item) {
        let str = ''
        let strId = []
        this.isShow = false
        if (item.length > 0) {
            item.forEach(res => {
                str += res.name + ','
                strId.push(res.id)
                strId +=res.id + ','
            })
            // console.log(strId)
            this.addPubilshData.scopeName = str.substring(0, str.length - 1);
            this.addPubilshData.scope =  strId.substring(0, strId.length - 1);
            this.workflowInfo.data.startCrewName = str.substring(0, str.length - 1)
            this.workflowInfo.data.startCrew = strId
        }
    },
      closeFun () {
          this.isShow = false;
      }
    },
    mounted () {
        this.addPubilshData = this.addPubilshInfo;
        this.myType = this.addPubilshInfo.type;
    },
    watch: {
        addPublishInfo () {
            this.addPubilshData = this.addPublishInfo;
            this.myType = this.addPubilshInfo.type;
        }
    },
    components: {
        quillEditor,
        userModules,
        qqtInput,
        'user-depart-modules': UserDepartModules,
    },
}
</script>
<style scoped>
    .addPubilshDialog{
        overflow-y:scroll;
        padding: 0 20px;
    }
    .message-content-c{
        display: flex
    }
    .message-content{
        margin: 6px;
        font-size: 26px;
        color: #f63838
        
    }
</style>