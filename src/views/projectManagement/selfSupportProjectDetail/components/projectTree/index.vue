<template>
    <div>
        <el-tree :data="temData" :props="defaultProps" default-expand-all node-key="id" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span :style="{color: data.color}"><strong style='margin-right:15px;'>{{ data.__identity }}</strong> {{ data.name }}</span>
                <span v-if="canEdit">
                    <el-button type="text" icon="el-icon-plus" size="mini" @click="() => append(node, data)"></el-button>
                    <el-button type="text" icon="el-icon-edit" size="mini"  @click="() => edit(node, data)"></el-button>
                    <el-button type="text" icon="el-icon-close" size="mini"  @click="() => remove(node, data)"></el-button>
                </span>
            </span>
        </el-tree>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    props: {
        proData: {
            type: Array,
            default: ()=> {
                return []
            }
        },
        levelList: {
            type: Array,
            default: () => {
                return []
            }
        },
        canEdit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            temData: [],
        }
    },
    methods: {
        handleNodeClick (data, node, model) {

        },

        formatConversion (  children, index = 1, family = [], elderIdentity) {
          // children如果长度等于0，则代表已经到了最低层
          // let page = (this.startPage - 1) * 10
          if (children.length > 0) {
            children.map((x, i) => {
              // 设置 __level 标志位 用于展示区分层级
              Vue.set(x, '__level', index)
              if(this.levelList.length > 0){
                  Vue.set(x, 'color', this.levelList[index-1].bgColor)
              }
              // 设置 __family 为家族关系 为所有父级，包含本身在内
              Vue.set(x, '__family', [...family, elderIdentity + '.' + i])
              // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
              Vue.set(x, '__identity', elderIdentity ? elderIdentity + '.' + (i+1) : (i+1) )
            //   parent.push(x)
              // 如果仍有子集，则进行递归
              if (x.children !== undefined && x.children.length > 0) {
                this.formatConversion( x.children, 
                            index + 1, [...family, elderIdentity + '.' + i], elderIdentity ? elderIdentity + '.' + (i+1) : (i+1))
              }
            })
          }
            return children
        },

        setTreeData () {
            this.temData = this.formatConversion(this.proData)
        },

        append (node, data) {
            this.$emit('appChild', data)
        },

        edit (node, data) {
            this.$emit('editChild', data)
        },

        remove (node, data) {
            this.$emit('deleteChild', data)
        }
    },
    mounted () {
        this.setTreeData()
    },
    watch: {
        proData (newVal, oldVal) {
            this.temData = this.formatConversion(newVal)
    　　},
        levelList: {
            deep: true,
            handler (newVal, oldVal) {
                this.setTreeData()
            }
        }
    }
}
</script>