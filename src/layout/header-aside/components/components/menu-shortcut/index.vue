<template>
    <div class="menu-shortcut">
        <draggable
            v-model="list"
            @add='addCollection'
            :group='{name: "menu" || "son"}'
        >
            <div class="menu-shortcut_layout">
                <i class="el-icon-plus"/>
                <div>添加首页快捷菜单</div>
            </div>
        </draggable>
        <div class="menu-shortcut_-shade"></div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'

    import Draggable from 'vuedraggable'
    export default {
        props: {
            data: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },

        components: {
            'draggable': Draggable
        },

        computed: {
            ...mapState('d2admin/menu', [
                'aside'
            ])
        },

        data () {
            return {
                list: []
            }
        },

        methods: {

            addCollection (evt) {
                this.aside[evt.oldIndex]
            }
        }
    }
</script>
<style lang="scss">
    .menu-shortcut {
        .menu-shortcut_layout {
            position: fixed;
            width: 220px;
            border: 2px dashed $color-text-sub;
            left: 215px;
            z-index: 6;
            top: 400px;
            border-radius: 7px;
            text-align: center;
            padding: 20px;
            color: $color-text-sub;
            transition: all 0.3s;
            .el-icon-plus {
                font-size: 30px
            }
            div {
                font-size: 16px
            }
        }
        .menu-shortcut_layout:hover {
            transform: scale(1.1);
        }
        .menu-shortcut_-shade {
            position: fixed;
            background: rgba(0, 0, 0, 0.6);
            top: 95px;
            left: 200px;
            z-index: 3;
            width: 100%;
            height: 100%;
        }
    }
</style>