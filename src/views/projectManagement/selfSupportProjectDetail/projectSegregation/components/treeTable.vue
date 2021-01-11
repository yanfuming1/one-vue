<template>
    <div class="treeTableProject">
        <table>
            <thead>
                <tr v-if="levelList.length> 0">
                    <th v-for="(item,index) in levelList" :key="index">{{item.rank}} --- {{item.name}}</th>
                </tr>
            </thead>
            <qt-tr :proData="proData"></qt-tr>
        </table>
    </div>
</template>

<script>
    import qtTr from './tr.vue';
    export default {
        components: {
            qtTr,
        },
        name:'qqtTable',
        props: {
            proData: {
                type: Array,
                default:() => {
                    return []
                } 
            },
            levelList: {
                type: Array,
                default:() => {
                    return []
                } 
            },
        },
        data() {
            return {
                newProData:[],
                
                newLevelList:[],
            }
        },
        methods: {
            name() {
                
            },
            forData (res) {
            // [{},{}]
                let obj;
                res.children.forEach(item => {
                    console.log(item);
                    obj = {
                        id:item.id,
                        name:item.name,
                        index:index+1,
                     }
                })
                return obj
            },

        },
        mounted () {
        },
        computed:{
            // levelData () {
            //     let levelData = [];
            //     this.newLevelList.forEach(res=> {
            //         levelData.push(res.rank)
            //         levelData.push(res.name)
            //     }) 
            //     return  levelData;
            // },
            tableData () {
                let tableData = [];
                // console.log(this.newLevelList);
                this.newProData.forEach((item,index) => {
                //     let obj = {
                //         id:item.id,
                //         name:item.name,
                //         index:index+1,
                //     }
                //     tableData.push(obj)
                //     this.forData(item)
                })
                // console.log(tableData);
            }
        },

        watch: {
            proData:{
                deep:true,
                immediate:true,
                handler(value){
                    this.newProData = value;
                }
            },
            levelList:{
                deep:true,
                immediate:true,
                handler(value){
                    this.newLevelList = value;
                }
            }
        },
    }
</script>

<style lang="scss">
.treeTableProject{
    height: 100%;
    table{
        width: 100%;
        text-align: center;
        border-collapse:collapse;
        border: 1px solid #000000;
    }
    td{
        height: 40px;
        min-width: 100px;
        border-collapse:collapse;
        border: 1px solid #000000;
    }
    th{
        height: 40px;
        min-width: 100px;
        border-collapse:collapse;
        border: 1px solid #000000;
    }
}
    
</style>