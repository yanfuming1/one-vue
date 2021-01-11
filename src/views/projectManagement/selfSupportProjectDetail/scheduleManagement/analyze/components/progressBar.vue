<template>
    <div class="progressBar" >
        <div v-for="(item,index) in dataList" :key="index" class="bar" :style="{'--percent': item[prop],'--color':setColor(index)}">
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: {
                type: Array,
                default: ()=> {
                    return []
                }
            },
            prop:{
                type:String,
                default: ''
            }
        },
        data() {
            return {
                dataList:[],
                
                colorList:[
                    '#FD7464',
                    '#C890FF',
                    '#8C99FF',
                    '#FFC543',
                    '#2FE0B2',
                    '#3DB8FE',
                    '#70ADFD',
                    '#303133',
                    '#62CDFD',
                    '#4C5DC0'
                ]
            }
        },
        methods: {
            setColor(index) {
                let newIndex = index.toString().substring(index.toString().length-1,index.toString().length)
                return this.colorList[newIndex]
            }
        },
        watch: {
            data: {
                deep:true,
                handler(data){
                    this.dataList = data;
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.progressBar{
    --percent:0;
    .bar{
        height: 45px;
        margin:5px 0;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
        background: #EBEBEB;
    }  
    .bar::before {
        counter-reset: progress var(--percent);
        /* counter-reset属性创建或重置一个或多个计数器。 */
        content: counter(progress) '%\2000';
        /* \2000 类似于间隔 或空格*/
        display: block;
        width: calc(100% * var(--percent) / 100);
        font-size: 15px;
        height: 45px;
        line-height: 45px;
        color: #fff;
        background: var(--color);
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
    }
}
</style>