<template>
    <div class="widget-form-container">
        <el-form :size="data.config.size" label-suffix=":" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
            <div v-if="data.list.length == 0" class="form-empty">从左侧拖拽来添加字段</div>
            <draggable 
                class="" 
                v-model="data.list" 
                v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                @add="handleWidgetAdd"
                @update="handleWidgetUpdate"
            >

                <transition-group name="fade" tag="div" class="widget-form-list">

                    <template v-for="(element, index) in data.list" v-if="element && element.key">

                        <widget-table
                            v-if="element.type == 'table'"
                            :key="element.key"
                            :element="element"
                            :select.sync="selectWidget" 
                            :index="index" :data="data"
                            @select-change="handleSelectChange"  
                        >
                        </widget-table>

                        <widget-tab-item
                            v-else-if="element.type === 'tabs'"
                            :key="element.key"
                            :element="element"
                            :select.sync="selectWidget" 
                            :index="index" :data="data"
                            @select-change="handleSelectChange"  
                        >
                        </widget-tab-item>

                        <widget-form-item 
                            v-else-if="element.type !== 'grid'" 
                            :key="element.key" 
                            :element="element" 
                            :select.sync="selectWidget" 
                            :index="index" :data="data"
                            @select-change="handleSelectChange"  
                        >
                        </widget-form-item>

                        <widget-col-item
                            v-else
                            :key="element.key" 
                            :element="element" 
                            :select.sync="selectWidget" 
                            :index="index" :data="data"
                            @select-change="handleSelectChange"  
                        >
                        </widget-col-item>
                    </template>
                </transition-group>
            </draggable>
        </el-form>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetFormItem from './WidgetFormItem'
import WidgetColItem from './WidgetColItem'
import WidgetTable from './WidgetTable'
import WidgetTabItem from './WidgetTabItem'
import { EventBus } from '../util/event-bus.js'
import _ from 'lodash'

export default {
    components: {
        Draggable,
        WidgetFormItem,
        WidgetColItem,
        WidgetTable,
        WidgetTabItem
    },
    props: ['data', 'select'],
    data () {
        return {
            selectWidget: this.select
        }
    },
    mounted () {

        document.body.ondrop = function (event) {
            let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
            if (isFirefox) {
                event.preventDefault()
                event.stopPropagation()
            }
        },

        EventBus.$on('on-field-add', item => {
            console.log('.....')
            console.log(item, this.data, this.select)
            const key = new Date().getTime() + ''
            let widgetItem = _.cloneDeep({
                ...item,
                options: {
                    ...item.options,
                    remoteFunc: 'func_' + key,
                    remoteOption: 'option_' + key
                },
                key,
                model: item.type + '_' + key,
                rules: []
            })
            this._addWidget(this.data.list, widgetItem)

            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        })
    },

    methods: {

        _addWidget (list, widget) {
            if (this.selectWidget && this.selectWidget.key) {
                const index = list.findIndex(item => item.key == this.selectWidget.key)

                if (index >= 0) {
                    list.splice(index + 1, 0, widget)

                    this.selectWidget = list[index + 1]
                } else {
                    list.forEach(item => {
                        if (item.type === 'grid') {
                            item.columns.forEach(column => {
                                this._addWidget(column.list, widget)
                            })
                        }
                        if (item.type === 'table') {
                            this._addWidget(item.tableColumns, widget)
                        }
                        if (item.type === 'tabs') {
                            item.tabs.forEach(tab => {
                                this._addWidget(tab.list, widget)
                            })
                        }
                    })
                }
            } else {
                list.push(widget)

                this.selectWidget = list[list.length - 1]
            }
        },

        handleWidgetUpdate (evt) {
            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        },

        handleWidgetAdd (evt) {
          
            console.log('add', evt)
            console.log('end', evt)
            const newIndex = evt.newIndex
            const to = evt.to
            console.log(to)
            
            //为拖拽到容器的元素添加唯一 key
            const key = new Date().getTime() + ''
            this.$set(this.data.list, newIndex, {
                ...this.data.list[newIndex],
                options: {
                    ...this.data.list[newIndex].options,
                    remoteFunc: this.data.list[newIndex].options.remoteFunc || 'func_' + key,
                    remoteOption: this.data.list[newIndex].options.remoteOption || 'option_' + key,
                },
                key,
                // 绑定键值
                model: this.data.list[newIndex].model ? this.data.list[newIndex].model : this.data.list[newIndex].type + '_' + key,
                rules: this.data.list[newIndex].rules ? [...this.data.list[newIndex].rules] : []
            })

            this.$set(this.data.list, newIndex, _.cloneDeep(this.data.list[newIndex]))

            this.selectWidget = this.data.list[newIndex]

            this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
        },

        handleWidgetDelete (index) {
            if (this.data.list.length - 1 === index) {
                if (index === 0) {
                    this.selectWidget = {}
                } else {
                    this.selectWidget = this.data.list[index - 1]
                }
            } else {
                this.selectWidget = this.data.list[index + 1]
            }

            this.$nextTick(() => {
                this.data.list.splice(index, 1)

                this.$nextTick(() => {         EventBus.$emit('on-history-add')       })
            })
        },

        handleSelectChange (index) {
            console.log('select-change', index)
            setTimeout(() => {
                index >=0 ? (this.selectWidget = this.data.list[index]) : (this.selectWidget = {})
            })
        }
    },

    watch: {
        select (val) {
            this.selectWidget = val
        },
        selectWidget: {
            handler (val) {
                this.$emit('update:select', val)
            },
            deep: true
        }
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
