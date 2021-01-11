<template>
    <div></div>
</template>

<script>
    import * as bpmn from '../../../../enum/BPMN'
    import ElementFactory from '../../../../util/elementFactory'
    export default {
        name: 'startAndEndEvent',
        
        data () {
            return {
                endListener: [
                    {
                        event: 'start',
                        class: 'com.qqtkj.qqtoi.activiti.listener.StartEndEventListener'
                    }
                ],
            }
        },
        
        methods: {
            updataListener () {
                ElementFactory.createElement('activiti:ExecutionListener', this.endListener, true)
            }
        },

        mounted () {
            this.updataListener ()
        }
    }
</script>

<style scoped>

</style>
