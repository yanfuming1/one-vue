<template>
    <div class="commonlyShortcut">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>常用快捷</span>
                <i class="iconfont icondaozhangzijindengji"/>
                <div class="line"></div>
            </div>
            <div v-for="(item, index) in routerList" :key="index" class="commonlyShortcut—icon" @click="routerLink (item)">
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="item.icon"></use>
                </svg>
                <div>{{ item.name }}</div>
            </div>
            <div v-if="routerList.length == 0" class="commonlyShortcut-empty">暂无数据</div>
        </el-card>
    </div>
</template>

<script>
    //图标和跳转路径
    import SHORTCUT from '../../../../enum/SHORTCUT'
    import { mapState } from 'vuex'
    export default {
        data () {
            return {

                basicComponents: SHORTCUT,
                routerList: []
            }
        },

        methods: {

            filtrateCommonlyShortcut () {
                this.routerList = []
                //forEach循环数组，每个值为res进行回调
                this.basicComponents.forEach (res => {
                   // console.log(res)
                    if (res.path == 'no') return
                    //当sourceData数组中的数据和res.path相等时，写入routerList数组
                    let item = this.sourceData.find (f => f.href === res.path)
                    if (item) {
                        this.routerList.push (res)
                    }
                })
            },
           //点击跳转，路径为参数所带
            routerLink (index) {
                console.log(index.fullPath ? index.fullPath : index.path)
                this.$router.push ({
                    path: '/' + (index.fullPath ? index.fullPath : index.path)
                })
            }
        },
         //页面渲染前加载数据
        created () {
            this.filtrateCommonlyShortcut ()
        },

        computed: {
            //不太懂
            ...mapState ('d2admin/menu', [
                'sourceData'
            ])
        }
    }
</script>

<style lang='scss'>
    .commonlyShortcut {
        .box-card {
            height: 350px;
            .clearfix {
                font-size: 16px;
                .line {
                    border-bottom: 2px solid $startusing;
                    width: 67px;
                    position: relative;
                    top: 8px
                }
                i {
                    float: right;
                    color: $startusing;
                    font-size: 24px;
                    position: relative;
                    top: -6px;
                }
            }
            .commonlyShortcut—icon {
                cursor: pointer;
                float: left;
                width: 145px;
                height: 95px;
                padding-top: 20px;
                text-align: center;
                svg {
                    height: 30px;
                    width: 30px;
                }
                .add {
                    position: relative;
                    top: 8px;
                    border: 1px solid;
                    border-radius: 4px;
                    font-size: 26px;
                    padding: 6px;
                    background-color: $color-card-button-bg;
	                border: solid 1px $color-border-5;
                }
            }
            .commonlyShortcut—icon:hover {
                background: $color-table-hover
            }
            .commonlyShortcut-empty {
                text-align: center;
                padding-top: 20px;
                color: $color-text-placehoder
            }
        }
        .el-card__header {
            border-bottom: 1px solid transparent !important;
        }
        .el-card__body {
            height: 285px;
            overflow: auto;
            padding: 0 20px !important
        }
    }
</style>
