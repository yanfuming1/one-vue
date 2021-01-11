<template>
    <div>
        <table class="tree-table">
            <tr v-for="(row, i) in temData" :key="i">
                <template v-for="(cell, j) in row">
                <td
                    v-if="cell.rowspan !== 0"
                    :key="j"
                    :rowspan="cell.rowspan"
                    :colspan="cell.colspan">
                    <div v-if="cell.isHeader" >
                        <span style="margin-right: 5px">{{ cell.identityH }}</span>---<span style="margin-left: 5px">{{ cell.label }} 【<span style="color:#FF4234">{{cell.moduleQuantity}}个</span>】</span></div>
                    <div v-else class="cell"><span style="margin-right: 5px">{{ cell.identity }}</span>{{cell.name ? '---' :''}}<span style="margin-left: 5px">{{ cell.name }}</span></div>
                </td>
                </template>
            </tr>
        </table>
    </div>    
</template>
<script>
import Vue from 'vue'
export default {
    props: ['proData', 'levelList'],
    data () {
        return {
            tableData: [],
            maxIndex: 0,
            totalArr: [],
            temData: [],
            header: [],
            tempData: [],
        }
    },
    methods: {
        tableSpanMethod () {

        },
        formatConversion ( children, index = 1, family = [], elderIdentity) {
            console.log(JSON.parse(JSON.stringify(children)),'1');
            // children如果长度等于0，则代表已经到了最低层
            // let page = (this.startPage - 1) * 10
            if (children.length > 0) {
                children.map((x, i) => {
                // 设置 __level 标志位 用于展示区分层级
                Vue.set(x, 'level', index)
                // 设置 __family 为家族关系 为所有父级，包含本身在内
                Vue.set(x, 'family', [...family, elderIdentity + '.' + i])
                // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
                Vue.set(x, 'identity', elderIdentity ? elderIdentity + '.' + (i+1) : (i+1) )
                // parent.push(x)
                // 如果仍有子集，则进行递归
                if (x.children !== undefined && x.children.length > 0) {
                    this.formatConversion( x.children, 
                                index + 1, [...family, elderIdentity + '.' + i], elderIdentity ? elderIdentity + '.' + (i+1) : (i+1))
                }
                })
            }
            return children
        },

        setData (data) {
            let result = this.parseTreeToRow(data)
            if(result.length > 0){
                result.forEach((item, index) => {
                    if (item.length < this.levelList.length) {
                        let tempNum = parseInt(this.levelList.length) - item.length
                        for (let y = 0;y < tempNum; y++) {
                            item.push({ identity: ' ', label: ' ', rowspan: '1',bs:'',})
                        }
                        
                    }
                })
            }
            result.unshift(this.header)
            // result.forEach((item, index, oldArr) => {
            //     if(item.length > 0){
            //         item.forEach((tem, j) => {
            //             if(tem.rowspan > 1) {
            //                 for(let i = 1;i<tem.rowspan; i++) { 
            //                     oldArr[index + i][j].rowspan = 0
            //                 }
            //             }
            //         })
            //     }
            // })
            return result
        },

        // 新方法
        // 递归树状结构，转化为行数据
        parseTreeToRow(node, data = [], row = []) {
            if (!node.children || node.children.length === 0) {
                data.push(row);
            } else {
                for (let i = 0; i < node.children.length; i++) {
                    let child = node.children[i];
                    let cell = { 
                        label: child.label,
                        identity: child.number,
                        level: child.level,
                        name: child.name,
                        id:child.id,
                        bs:'',
                        rowspan: child.heightOccupied,
                    }
                    this.parseTreeToRow(child, data, [...row, cell]);
                }
            }
            return data;
        },

        /**
            1. 计算某个节点下叶子节点的数量
            2. @param { Object } node 节点
            3. @returns { Number }  leafCount   叶子节点的数量
        */
        computeLeafCount(node,data = []) {
            node.children.forEach(ele => {
                data.push(ele)
                ele.children && this.computeLeafCount(ele,data);
            });
            return data
            // return data
            // if(!node.children || node.children.length === 0){
            //     // node.rowspan = 1;
            //     return 1;
            // } else {
            //     let leafCount = 0;
            //     for(let i = 0 ; i < node.children.length ; i++) {
            //         leafCount = leafCount + this.computeLeafCount(node.children[i]);
            //     }
            //     // node.rowspan = leafCount;
            //     return leafCount;
            // }
        },
        resetIndex (array) {
            let newData = []
            array.forEach((item,index) => {
                item.forEach((res,k)=>{
                    res.bs = index;
                    newData.push(JSON.parse(JSON.stringify(res)))
                })
            })
            return this.uniqueByKey(newData,'id')
        },
        uniqueByKey(arr,key) {
            let hash = {};
            let result = arr.reduce((total, currentValue) => {
                if (!hash[currentValue[key]] || !currentValue[key]) { //如果当前元素的key值没有在hash对象里，则可放入最终结果数组
                    hash[currentValue[key]]= true; //把当前元素key值添加到hash对象
                    total.push(currentValue); //把当前元素放入结果数组
                }
                return total; //返回结果数组
            },[]);
            result = Object.values(result.reduce((res, item) => 
                {res[item.bs] ? res[item.bs].push(item) : res[item.bs] = [item];
                return res;
            }, {}));
            return result;
        },
        setTableData (data) {
            // this.tableData = this.formatConversion(data) 
            let newData = this.setData({children: data})
            this.temData = this.resetIndex(newData)
            // this.resetIndex()
            // console.log(JSON.parse(JSON.stringify(this.temData)))
        },

        setHead (level, data) {
            this.header = []
            level.forEach(item => {
                let tem = {
                    identityH: item.number,
                    label: item.name,
                    moduleQuantity: item.moduleQuantity,
                    isHeader: true,
                    rowspan: '1',
                }
                this.header.push(tem)
            })
            this.setTableData(data)
        }

    },
    mounted() {
        // this.tempData = Object.assign({}, this.proData)
        this.setHead (this.levelList, JSON.parse(JSON.stringify(this.proData)))
  
    },
    watch: {
        proData: {
            deep: true,
            handler(newVal, oldVal) {
                this.tempData = Object.assign({}, newVal)
                this.setHead (this.levelList, JSON.parse(JSON.stringify(newVal)))
            }
        },
        levelList: {
            deep: true,
            handler(newVal, oldVal) {
                this.tempData = Object.assign({}, this.proData)
                this.setHead (newVal, JSON.parse(JSON.stringify(this.proData)))
            }
        }
    }
}
</script>
<style lang="scss" scoped>
// .tree-table{
//     width: 100%;
//     tr{
//         line-height: 30px;
//         td{
//             border: 1px solid #DDD;
//         }
//     }
// }
.tree-table{
    width: 100%;
    text-align: center;
    border-collapse:collapse;
    border: 1px solid #000000;
    td{
        height: 40px;
        min-width: 100px;
        border-collapse:collapse;
        border: 1px solid #000000;
    }
    tr{
        height: 40px;
        min-width: 100px;
        border-collapse:collapse;
        border: 1px solid #000000;
    }
    tr:nth-child(1){
        background-color: #EFF6FA;
        td{
            color: #909399;
            font-weight: 700;
            font-size: 15px;
        }
    }
    .cell {
        float: left;
        padding-left: 10px;
    }
}
</style>