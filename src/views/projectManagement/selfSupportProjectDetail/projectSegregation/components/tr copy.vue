<template>
    <tbody>
        <tr v-for="topIndex in totalLength" :key="topIndex">
            <td v-for="(item,index) in newData" :key="index" :rowspan="item.length">
            </td>
         
        </tr>
    </tbody>
</template>

<script>
    export default {
        name:'ComTr',
        props: {
            proData: {
                type: Array,
                default: () => {
                    return []
                }
            },
        },
        data() {
            return {
                length:0
            }
        },
        methods: {
            list(datas,data=[]){ //遍历树  获取id数组
                datas.forEach((ele,index) => {
                    if (ele.children) {
                       let allData =  this.getlist(ele.children)
                        data.push(allData)
                    } else {
                        data.push([])
                    }
                });
                return data
            },
            getlist(datas,data=[]){ //遍历树  获取id数组
                for(var i in datas){
                    data.push(datas[i])
                    datas[i].children && this.getlist(datas[i].children,data);
                }
                return data
            },
        },
        computed: {
            newData() {
                let newData = this.list(this.proData);
                return newData
            },
            totalLength () {
                let totalLength = 0;
                let data = this.list(this.proData);
                data.forEach(ele => {
                    totalLength += ele.length
                });
                return totalLength
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>