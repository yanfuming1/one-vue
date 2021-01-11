<template>
    <d2-container class="contacts">
        <div class="contacts-center">
            <customer-details-header :customerInfor="customerInfor" :identification="identification" :isShowTime="true" />
            <div class="contacts-center___bottom">
                <div class="contacts-center-title">
                    <div class="contacts-center___longString">
                        <p>联系人</p>
                    </div>
                </div>
                <div class="contacts-center_right">
                    <el-button type="primary" plain @click="drawer = true" v-if="!customerInfor.iCanSeeIt">添加次要联系人</el-button>
                </div>
                <div class="contacts-center___bottomLine"></div>
                <div class="contacts-center___generate" v-if="!customerInfor.iCanSeeIt">
                    <div v-for="(item, index) in contactsList" :key="index">
                        <fm-generate-form :data="jsonData" :remote="remote" :transform="item" :value="item" ref="generateForm"></fm-generate-form>
                        <div class="contacts-center-generate___main" v-if="item.mainman === '1'">
                            <el-button type="primary" size="mini">主要联系人</el-button>
                        </div>
                        <div class="contacts-center-generate___setting" v-if="item.mainman === '0' && auth.setting">
                            <el-button @click="setMainMan(item)" type="primary" plain size="mini">设置主要联系人</el-button>
                        </div>
                        <div class="contacts-center-generate___edit" v-if="item.isShowDetails && auth.edit">
                            <el-button @click="item.isShowDetails = false" type="primary" plain size="mini">编辑</el-button>
                        </div>
                        <div class="contacts-center-generate___edit" v-if="!item.isShowDetails">
                            <el-button @click="saveGenerateData(item)" type="primary" plain size="mini">保存</el-button>
                        </div>
                        <div class="contacts-center-generate___line"></div>
                    </div>
                </div>
                <div class="contacts-center___button" v-if="auth.add">
                    <div class="contacts-center-button___return">
                        <el-button @click="closeTag">返回</el-button>
                    </div>
                </div>
            </div>
        </div>
        <add-contacts v-if="drawer" :dialogVisible="drawer" @change="updataContactsList"></add-contacts>
    </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { formGetJson } from '../../../../../api/system/fromManagement/index'
import { CUSTOMERAUTHORIZATIONFORM } from '../../../../../enum/FORMCODE'
import { setMainManData, editContactsData, getContactsList,
         setFirstPartyMainManData, editFirstPartyContactsData, getFirstPartyContactsList } from '../../../../../api/customerManagement/contacts'

import { CITYJSON } from '../../../../../enum/CTIYS'

import customerDetailsHeader from '../../components/customerDetailsHeader'
import addContacts from './addContacts'
let than = this
export default {
    data () {
        return {
            jsonData: {},
            contactsList: [],
            drawer: false,
            remote: {
                getSex (resolve) {
                    resolve ([
                        {
                            value: '男',
                            label: '男'
                        },
                        {
                            value: '女',
                            label: '女'
                        }
                    ])
                },
                getCity (resolve) {
                    resolve (CITYJSON)
                }
            },
            auth: {
                add: true,
                edit: true,
                setting: true
            }
        }
    },

    methods: {

        ...mapActions('d2admin/page', [
            'close',
        ]),

        getFormByJson () {
            formGetJson ({'code': CUSTOMERAUTHORIZATIONFORM.CONTACTSDETAILS}).then(res => {
                if (res) {
                    this.jsonData = JSON.parse(res)
                }
            })
        },

        getContacts (id) {
            let url = ''
            this.contactsList = []
            switch (this.identification) {
                case '0':
                    url = getContactsList
                    break
                case '1':
                    url = getFirstPartyContactsList
                    break
            }
            url ({'id': id}).then(res => {

                if (res && res.contactInfos && res.contactInfos.length > 0) {
                    res.contactInfos.forEach(item => {
                        try {
                            item['city'] = JSON.parse (item['city'])
                        } catch (error) {   
                        }
                        item['isShowDetails'] = true
                    })
                    this.contactsList = res.contactInfos
                }

                if (res && res.contactsInfos && res.contactsInfos.length > 0) {
                    res.contactsInfos.forEach(item => {
                        try {
                            item['city'] = JSON.parse (item['city'])
                        } catch (error) {   
                        }
                        item['isShowDetails'] = true
                    })
                    this.contactsList = res.contactsInfos
                }
            })
        },

        updataContactsList () {
            this.drawer = false
            this.getContacts (this.customerInfor.id)
        },

        setMainMan (item) {
            let url = ''
            switch (this.identification) {
                case '0':
                    url = setMainManData
                    break
                case '1':
                    url = setFirstPartyMainManData
                    break
            }
            url ({'id': item.id}).then(res => {
                if (res.code === 200) {
                    this.$message.success ('设置主要联系人成功')
                    this.getContacts (this.customerInfor.id)
                }
            })
        },

        saveGenerateData (item) {
            let index = this.contactsList.findIndex (r => r.id === item.id)
            this.$refs.generateForm[index].getData ().then(data => {
                if (data) {
                    data['id'] = item.id
                    let url = ''
                    switch (this.identification) {
                        case '0':
                            url = editContactsData
                            break
                        case '1':
                            url = editFirstPartyContactsData
                            break
                    }
                    if (data['city'] && data['city'].length > 0) {
                        data['city'] = JSON.stringify (data['city'])
                    }
                    url (data).then(res => {
                        if (res.code === 200) {
                            this.$message.success ('修改成功')
                            item['isShowDetails'] = true
                            this.getContacts (this.customerInfor.id)
                        }
                    })
                }
            })
        },

        // 验证权限
        _validationAuth () {
            this.auth.add = this.identification === '0' ? this.$has ('contactinfo:list:add') : this.$has ('contactinfos:list:add')
            this.auth.edit = this.identification === '0' ? this.$has('contactinfo:list:edit') : this.$has ('contactinfos:list:edit')
            this.auth.setting = this.identification === '0' ? this.$has('contactinfo:list:setMainMan') : this.$has ('contactinfos:list:setMainMan')
        },

        closeTag () {
            let tagName = this.$route.path
            let path = ''
            
            if (this.customerInfor.myClientPath) {
                path = `/customerManagement/myClientModule/${this.customerInfor.myClientPath}`
            } else {
                path = `/customerManagement/customerList/${this.identification}`
            }
            this.close ({tagName, path})
        }
    },

    computed: {
        ...mapState('d2admin/customer', [
            'customerInfor',
            'remoteFuncs',
            'identification'
        ])
    },

    mounted () {
        than = this
    },

    created () {
        this.$store.dispatch ('d2admin/customer/identificationSet', this.$route.params.identification)
        this.$store.dispatch ('d2admin/customer/identificationLoad')
        this.$store.dispatch ('d2admin/customer/customerInformationLoad')
        this.$store.dispatch ('d2admin/customer/remoteFuncsLoad')
        this.getFormByJson ()
    },

    watch: {
        customerInfor () {
            if (this.customerInfor.id) {
                this.getContacts (this.customerInfor.id)
            }
        },

        $route (val) {
            if (val.path.indexOf('contacts') !== -1) {
                this.$store.dispatch ('d2admin/customer/identificationSet', val.params.identification)
                this.$store.dispatch ('d2admin/customer/customerInformationLoad')
                this.getFormByJson ()
            }
        }
    },

    components: {
        'add-contacts': addContacts,
        'customer-details-header': customerDetailsHeader
    }
}
</script>

<style lang='scss' scoped>
    .contacts {
        .contacts-center {
            height: 100%;
            padding: 10px;
            .contacts-center___bottom {
                 height: 83%;
                margin-top: 20px;
                box-shadow: 0 2px 12px 0 $color-border-shadow;
                background: $color-bg3;
                font-size: 14px;
                .contacts-center-title {
                    padding: 30px 32px 10px;
                    .contacts-center___longString {
                        border-left: 3px solid $color-text-title;
                        p {
                            color:  $color-text-title;
                            display: inline-block;
                            margin: 0px;
                            margin-left: 10px;
                        }
                    }
                }
                .contacts-center___bottomLine {
                    top: -5px;
                    border-top: solid $color-straight-line3 1px;
                    right: -20px;
                }
                .contacts-center___generate {
                    background: $color-bg4;
                    padding: 35px 0;
                    height: 450px;
                    overflow-x: hidden;
                    border-bottom: 1px solid $color-straight-line3;
                    .contacts-center-generate___line {
                        border: 1px dashed $color-straight-line3;
                        margin: 20px 50px 35px 42px;
                    }

                     .contacts-center-generate___main {
                        position: relative;
                        top: -170px;
                        float: right;
                        padding-right: 50px;
                        button {
                            width: 120px;
                        }
                    }
                    .contacts-center-generate___setting {
                        position: relative;
                        top: -170px;
                        float: right;
                        padding-right: 50px;
                        button {
                            width: 120px;
                        }
                    }
                    .contacts-center-generate___edit {
                        position: relative;
                        top: -118px;
                        float: right;
                        margin-right: -120px;
                        button {
                            width: 120px;
                        }
                    }


                }
                .contacts-center___button {
                    text-align: right;
                    padding-top: 20px;
                    padding-right: 66px;
                    .contacts-center-button___return {
                        text-align: center
                    }
                    
                }
                .contacts-center_right {
                    position: relative;
                    float: right;
                    margin-top: -40px;
                    right: 20px;
                    button {
                        height: 30px;
                        padding: 6px 10px;
                        .el-button--primary {
                            background-color: $color-button-dialog-affirm
                        }
                    }
                }
            }
        }
    }
    .contacts-header-button {
        height: 26px;
        border-radius: 3px;
        color: #ffffff;
        background-color: $color-button-typeface1;
        border: 1px solid $color-button-typeface1
    }
    .el-button--mini, .el-button--mini.is-round {
        padding: 6px 10px !important;
        top: -1px
    }
</style>
