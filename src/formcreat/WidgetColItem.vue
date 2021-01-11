<template>
    <el-row class="widget-col widget-view"
        :class="{
            active: selectWidget.key && selectWidget.key == element.key,
            'is_hidden': element.options.hidden
        }"
        @click.native.stop="handleSelectWidget(index)"
        type="flex"
        :gutter="element.options.gutter || 0"
        :justify="element.options.justify"
        :align="element.options.align"
    >
        <el-col v-for="(item, index) in element.columns" :key="index" 
            :span="item.span || 0" >
            <draggable
                v-model="item.list"
                v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                :no-transition-on-drag="true"
                @add="handleWidgetColAdd($event, element, index)"
                @update="handleWidgetColUpdate"
            >

                <transition-group name="fade" tag="div" class="widget-col-list">
                    <template v-for="(col, colindex) in item.list" v-if="col && col.key">

                        <widget-col-item
                            v-if="col.type === 'grid'" 
                            :key="col.key" 
                            :element="col" 
                            :select.sync="selectWidget" 
                            :index="colindex" :data="item"
                            @select-change="handleSelectChange($event, item)"  
                        >
                        </widget-col-item>

                        <widget-tab-item
                            v-else-if="col.type === 'tabs'"
                            :key="col.key"
                            :element="col"
                            :select.sync="selectWidget" 
                            :index="colindex" :data="item"
                            @select-change="handleSelectChange($event, item)"  
                        >
                        </widget-tab-item>

                        <widget-table
                            v-else-if="col.type == 'table'"
                            :key="col.key"
                            :element="col"
                            :select.sync="selectWidget" 
                            :index="colindex" :data="item"
                            @select-change="handleSelectChange($event, item)"  
                        >
                        </widget-table>

                        <widget-form-item 
                            v-else
                            :key="col.key" 
                            :element="col" 
                            :select.sync="selectWidget" 
                            :index="colindex" :data="item"
                            @select-change="handleSelectChange($event, item)"
                        >
                        </widget-form-item>
                    </template>
                </transition-group>
              
            </draggable>
        </el-col>

        <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
            <i class="iconfont icon-icon_clone" @click.stop="handleColClone(index)"></i>
            <i class="iconfont icon-trash" @click.stop="handleWidgetDelete(index)"></i>
        </div>

        <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
            <i class="iconfont icon-drag drag-widget"></i>
        </div>
    </el-row>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import WidgetTable from './WidgetTable'
import Draggable from 'vuedraggable'
import WidgetTabItem from './WidgetTabItem'
import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'

export default {
    name: 'widget-col-item',
    
    components: {
        Draggable,
        WidgetFormItem,
        WidgetTable,
        WidgetTabItem
    },

    props: ['element', 'select', 'index', 'data'],

    data () {
        return {
            selectWidget: this.select
        }
    },

    methods: {

        handleSelectWidget (index) {
            this.selectWidget = this.data.list[index]
        },

        handleWidgetDelete (index) {
            if (this.data.list.length == 1) {
                this.$emit('select-change', -1)
            } else {
                if (this.data.list.length - 1 == index) {
                    this.$emit('select-change', index - 1)
                } else {
                    this.$emit('select-change', index)
                }
            }

            this.data.list.splice(index, 1)

            setTimeout(() => {
                EventBus.$emit('on-history-add')
            }, 20)
        },

        handleColClone (index) {
            let cloneData = _.cloneDeep(this.data.list[index])

            this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

            this.$nextTick(() => {
                this.selectWidget = this.data.list[index + 1]

                this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
            })
        },

        handleWidgetColUpdate (evt) {
            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        },

        handleWidgetColAdd ($event, row, colIndex) {
            const newIndex = $event.newIndex
      
            const key = new Date().getTime() + ''
            this.$set(row.columns[colIndex].list, newIndex, {
                ...row.columns[colIndex].list[newIndex],
                options: {
                    ...row.columns[colIndex].list[newIndex].options,
                    remoteFunc: row.columns[colIndex].list[newIndex].options.remoteFunc || 'func_'+key,
                    remoteOption: row.columns[colIndex].list[newIndex].options.remoteOption || 'option_'+key
                },
                novalid: {
                    ...row.columns[colIndex].list[newIndex].novalid,
                },
                key,
                model: row.columns[colIndex].list[newIndex].model ? row.columns[colIndex].list[newIndex].model : row.columns[colIndex].list[newIndex].type + '_' + key,
                rules: row.columns[colIndex].list[newIndex].rules ? [...row.columns[colIndex].list[newIndex].rules] : []
            })

            this.$set(row.columns[colIndex].list, newIndex, _.cloneDeep(row.columns[colIndex].list[newIndex]))

            this.selectWidget = row.columns[colIndex].list[newIndex]

            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        },

        handleSelectChange (index, item) {
            setTimeout(() => {
                index >=0 ? (this.selectWidget = item.list[index]) : (this.selectWidget = {})
            })
        }
    },
    
    watch: {
        select (val) {
            this.selectWidget = val
        },
        selectWidget: {
            deep: true,
            handler (val) {
                this.$emit('update:select', val)
            }
        },
    }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
