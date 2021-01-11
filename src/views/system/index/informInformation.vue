<template>
    <div class="inform-information">
        <div class="inform-information___content">
            <i class="el-icon-bell" />
            通知:
            
            <span @mouseenter="stop" @mouseleave="up" :class="{anim: animate == true}" class="inform-information-content___details" v-for="(item, index) in informList" :key="index">
                <el-link type="primary">{{ item.name }}</el-link>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                informList: [],

                animate: false,
                intNum: 0
            }
        },

        methods: {

            scroll () {
                this.intNum = setInterval(() => {
                    this.animate = true
                    setTimeout (() => {
                        this.informList.push(this.informList[0])
                        this.informList.shift()
                        this.animate = false
                    }, 500)
                }, 1000)
            },

            stop () {
                clearInterval (this.intNum)
            },

            up () {
                this.scroll ()
            }
        },

        created () {
            this.scroll ()
        }
    }
</script>

<style lang='scss'>
    .inform-information {
        height: 40px;
        line-height: 40px;
        background: $color-carousel-bg;
        font-size: 16px;
        padding: 0 15px;
        margin-bottom: 10px;
        .inform-information___content {
            color: $color-text-carousel;
            i {
                padding-right: 10px;
                font-size: 20px;
                position: relative;
                top: 3px
            }
            .inform-information-content___details {
                padding-left: 30px;
                position: relative;
                top: -1px
            }
            .anim{
                transition: all 0.5s;
                margin-top: -40px;
            }
        }
        .el-link {
            display: inline !important;
        }
    }
</style>
