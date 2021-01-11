<template>
    <div class="qqt-flow-diagram">
        <el-tooltip class="item" effect="dark" content="开始" placement="bottom" v-if="flowDiagram.length !== 0">
            <div class="qqt-flow-diagram-startAndEnd">开始</div>
        </el-tooltip>
        <div class="qqt-flow-diagram-line" v-if="flowDiagram.length !== 0">
            <div class="qqt-flow-diagram-transverseLine">
                <div class="qqt-flow-diagram-topAngle"></div>
                <div class="qqt-flow-diagram-bottomAngle"></div>
            </div>
        </div>
        <div v-for="(item, index) of flowDiagram" :key="index" class="qqt-flow-diagram___node">
            <el-tooltip class="item" effect="dark" content="开始" placement="bottom">
                <div slot="content">
                   <span>类型: {{ item.category === 1 ? '申请' : '审批'}}</span>
                    <br/>
                    <span>审批人员: {{ item.candidatesName || '无' }}</span>
                    <br/>
                    <span>节点设置: {{ item.setting | neaten }}</span>
                    <br/>
                    <span>超时提醒: {{ item.intervalTime || '无' }}</span>
                </div>
                <div class="qqt-flow-diagram-node">
                    <div class="qqt-flow-diagram-node___title">
                        {{ item.name || '无' }}
                    </div>
                    <div class="qqt-flow-diagram-node___line"></div>
                    <div class="qqt-flow-diagram-node___user">
                        {{ item.candidatesName || '无' }}
                    </div>
                </div>
            </el-tooltip>
            <div class="qqt-flow-diagram-line">
                <div class="qqt-flow-diagram-transverseLine">
                    <div class="qqt-flow-diagram-topAngle"></div>
                    <div class="qqt-flow-diagram-bottomAngle"></div>
                </div>
            </div>
        </div>
        <el-tooltip class="item" effect="dark" content="结束" placement="bottom" v-if="flowDiagram.length !== 0">
            <div class="qqt-flow-diagram-startAndEnd">结束</div>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'qqtFlowDiagram',
    props: {
        flowDiagram: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
        }
    },

    methods: {},

    watch: {
        flowDiagram () {
        }
    },

    filters: {
        neaten (value) {
            if (!value) return '无'
            let str = ''
            let list = JSON.parse (value)
            list.filter (item => {
                switch (item) {
                    case '1':
                        str += '会签' + ','
                        break
                    case '2':
                        str += '手写签名' + ','
                        break
                    case '3':
                        str += '存档签名' + ','
                        break
                    case '8':
                        str += '指定处理' + ','
                        break
                    case '9':
                        str += '节点时效' + ','
                        break
                }
            })
        
            return str.substring (0, str.length - 1)
        }
    }
}
</script>

<style lang='scss' scoped>
.qqt-flow-diagram {
    width: max-content;
    padding: 20px;
    .qqt-flow-diagram-startAndEnd {
        border: 4px solid #b1cef6;
        border-radius: 50%;
        height: 50px;
        width: 50px;
        line-height: 43px;
        text-align: center;
        top: -29px;
        position: relative;
        display: inline-block;
    }
    .qqt-flow-diagram-line {
        display: inline-block;
        position: relative;
        top: -30px;
        .qqt-flow-diagram-transverseLine {
            border: 1px solid #b1cef6;
            width: 60px;
            position: relative;
            margin: 0 20px 0 10px;
            .qqt-flow-diagram-topAngle, .qqt-flow-diagram-bottomAngle {
                width: 0;
                height: 0;
                display: block;
                position: absolute;
                left: 58px;
                top: -10px;
                border-top: 10px transparent dashed;
                border-right: 10px transparent dashed;
                border-bottom: 10px transparent dashed;
                border-left: 10px white solid;
                overflow: hidden;
            }
            .qqt-flow-diagram-topAngle {
                left: 60px;
                /*重要*/
                border-left: 10px #b1cef6 solid;
            }
            .qqt-flow-diagram-bottomAngle {
                border-left: 10px white solid;
            }
        }
        
    }
    .qqt-flow-diagram___node {
        display: inline-block;
        .qqt-flow-diagram-node {
            border: 2px solid #b1cef6;
            border-radius: 10px;
            height: 100px;
            width: 140px;
            position: relative;
            display: inline-block;
            padding: 15px;
            .qqt-flow-diagram-node___title {
                text-align: center;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 600;
            }
            .qqt-flow-diagram-node___line {
                border: 1px dashed #dddddd;
                margin: 10px 0;
            }
            .qqt-flow-diagram-node___user {
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
