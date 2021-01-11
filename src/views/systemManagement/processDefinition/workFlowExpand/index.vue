<template>
  <div class="node-layout">
    <start-and-end-event v-if="nodeType === bpmnElement.ENDEVENT"></start-and-end-event>
    <user-task :nodeId="nodeId" :nodeInfo="nodeInfo" :defaultFormKey="formKey" v-if="nodeType === bpmnElement.USERTEST"></user-task>
<!--    <process-definition v-show="nodeType === bpmnElement.PROCESS"></process-definition>-->
    <sequence-flow :nodeId="nodeId" v-if="nodeType === bpmnElement.SEQUENCEFLOW"></sequence-flow>
<!--    <exclusive-gateway v-show="nodeType === bpmnElement.EXCLUSIVEGATEWAY"></exclusive-gateway>-->
<!--    <parallel-gateway v-show="nodeType === bpmnElement.PARALLELGATEWAY"></parallel-gateway>-->
  </div>
</template>
<script>

  // import ProcessDefinition from './processNode/ProcessDefinition'
  // import ExclusiveGateway from './processNode/ExclusiveGateway'
  // import ParallelGateway from './processNode/ParallelGateway'
  import SequenceFlow from '../processNode/sequenceFlow'
  import UserTask from '../processNode/userTask'
  import StartAndEndEvent from '../processNode/startAndEndEvent'
  import * as bpmn from '../../../../enum/BPMN'

  export default {
  name: 'workFlowExpand',
  props: {
    nodeType: String,
    nodeId: String,
    nodeInfo: Array,
    formKey: String
  },
  data () {
    return {
      bpmnElement: bpmn
    }
  },
  components: {
    UserTask,
    StartAndEndEvent,
    // ProcessDefinition,
    SequenceFlow
    // ExclusiveGateway,
    // ParallelGateway
  }
}
</script>

<style scoped>
  .node-layout {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 435px;
    top: 0;
    padding: 20px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    backface-visibility: hidden;
    overflow-y: auto;
    overflow-x: hidden
  }
</style>
