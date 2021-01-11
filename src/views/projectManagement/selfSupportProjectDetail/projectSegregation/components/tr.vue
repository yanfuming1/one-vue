<template>
    <tbody>
        <template v-for="(rowdata,o) in  newData">
            <tr v-for="(item,index) in rowdata" :key="item.id">
                <td  :rowspan="index == 0 ? rowdata.length: 1">{{proData[o].name}}</td>
                <td>
                    121
                </td>
            </tr>
        </template>
        <!-- <tr  :key="item.id">
            <td :rowspan="item.length">
                121
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr> -->
        <!-- <tr>
            <td rowspan="3">1</td>
            <td>2</td>
            <td>3</td>
        </tr>
        <tr>
            <td>12</td>
            <td>12</td>
        </tr>
        <tr>
            <td>12</td>
            <td>12</td>
        </tr> -->
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
                 newData.forEach(ele => {
                    let totalLength = 0;
                    totalLength += ele.length
                    ele[0].totalLength = totalLength
                });
                console.log(newData);
                return newData
            },
            // totalLength () {
            //     let totalLength = 0;
            //     let data = this.list(this.proData);
               
            // }
        },
    }
</script>

<style lang="scss" scoped>

</style>