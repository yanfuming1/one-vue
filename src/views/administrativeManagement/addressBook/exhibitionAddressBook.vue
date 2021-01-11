<template>
    <el-dialog v-dialogDrag :visible="dialogVisible" title="通讯录详情" width="40%" :before-close="handleClose">
        <fm-generate-form :data="jsonData" :remote="remote" :transform="transform" :value="data" ref="generateForm"></fm-generate-form>
        <div class="qrcode-layout">
            <div id="qrcode"></div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('close')">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { formGetJson } from '../../../api/system/fromManagement/index'
    import { ADMINISTRATIVEMANAGEMENT } from '../../../enum/FORMCODE'

    import QRCode from 'qrcodejs2'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: () => false
            },

            data: {
                type: Object,
                default: () => {}
            }
        },
        data () {
            return {
                jsonData: {},
                remote: {
                    getJob (resolve) {
                        resolve ([
                            {
                                value: '0',
                                label: '否'
                            },
                            {
                                value: '1',
                                label: '是'
                            }
                        ])
                    }
                },
                transform: {
                    isShowDetails: true
                },
                content: 
                `
                    BEGIN:VCARD
                    FN: ${this.data.name}
                    TEL;CELL,VOICE: ${this.data.phone}
                    EMAIL;INTERNET,HOME:${this.data.email}
                    END:VCARD
                `,
                contentNotEmail: 
                `
                    BEGIN:VCARD
                    FN: ${this.data.name}
                    TEL;CELL,VOICE: ${this.data.phone}
                    END:VCARD
                `,
            }
        },

        methods: {

            handleClose () {
                this.$emit ('close')
            },

            getFormByJson () {
                formGetJson ({'code': ADMINISTRATIVEMANAGEMENT.EXHIBITIONADDRESSBOOK}).then(res => {
                    if (res) {
                        this.jsonData = JSON.parse(res)
                    }
                })
            },

            qrcode () {
                this.$nextTick(() => {
                    let qrcode = new QRCode('qrcode', {
                        width: 132,  
                        height: 132,
                        text: this.data.email ? this.content : this.contentNotEmail,
                        colorDark : "#000",
                        colorLight : "#fff",
                        correctLevel : 0
                    })
                })
            }
        },

        created () {
            this.getFormByJson ()
        },

        mounted () {
            this.qrcode()
        }
    }
</script>

<style lang='scss' scoped>
.qrcode-layout {
    text-align: center;
    #qrcode {
        background: #efefef;
        padding: 6px;
        display: inline-block;
    }
}
</style>
