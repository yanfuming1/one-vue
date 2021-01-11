
import store from '../store/index'
const defaultXml = {}

defaultXml.xml = function () {
    let groupId = store.state.d2admin.processDefinition.info.groupId
    let name = store.state.d2admin.processDefinition.info.name
    // let formKey = store.state.d2admin.processDefinition.info.formKey
    return  '<?xml version="1.0" encoding="UTF-8"?>' +
            '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"' +
            '    xmlns:activiti="http://activiti.org/schema/1.0/bpmn"' +
            '    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"' +
            '    xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC"' +
            '    xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI"' +
            '    xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
            '    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
            '    expressionLanguage="http://www.w3.org/1999/XPath"' +
            '    targetNamespace="http://www.activiti.org/test"' +
            '    typeLanguage="http://www.w3.org/2001/XMLSchema">' +
            '    <process id="' + groupId + '" name="' + name + '" isExecutable="true">' +
            '        <extensionElements>' +
            '            <activiti:executionListener event="start" class="com.qqtkj.qqtoi.activiti.listener.StartProcessListener"></activiti:executionListener>' +
            '            <activiti:executionListener event="end" class="com.qqtkj.qqtoi.activiti.listener.EndProcessListener"></activiti:executionListener>' +
            '        </extensionElements>' +
            '        <startEvent id="_2" name="开始任务" activiti:initiator="initiatorUserId"/>' +
            '        <userTask id="usertask1" name="申请人" activiti:candidateUsers="${initiatorUserId}" activiti:category="1" activiti:formKey=null>' +
            '            <extensionElements>' +
            '                <activiti:executionListener event="start" class="com.qqtkj.qqtoi.activiti.listener.StartTaskListener"></activiti:executionListener>' +
            '                <activiti:executionListener event="end" class="com.qqtkj.qqtoi.activiti.listener.EndTaskListener"></activiti:executionListener>' +
            '                <activiti:taskListener event="create" class="com.qqtkj.qqtoi.activiti.listener.CreateTaskListener"></activiti:taskListener>' +
            '                <activiti:taskListener event="assignment" class="com.qqtkj.qqtoi.activiti.listener.AssignmentTaskListener"></activiti:taskListener>' +
            '                <activiti:taskListener event="complete" class="com.qqtkj.qqtoi.activiti.listener.CompleteTaskListener"></activiti:taskListener>' +
            '            </extensionElements>' +
            '       </userTask>' +
            '       <sequenceFlow id="flow1" sourceRef="_2" targetRef="usertask1"></sequenceFlow>' +
            '    </process>' +
            '    <bpmndi:BPMNDiagram documentation="background=#FFFFFF;count=1;horizontalcount=1;orientation=0;width=842.4;height=1195.2;imageableWidth=832.4;imageableHeight=1185.2;imageableX=5.0;imageableY=5.0" id="Diagram-_1" name="New Diagram">' +
            '        <bpmndi:BPMNPlane>' +
            '        <bpmndi:BPMNShape bpmnElement="_2" id="Shape-_2">' +
            '            <omgdc:Bounds height="32.0" width="32.0" x="230.0" y="150.0"/>' +
            '       </bpmndi:BPMNShape>' +
            '        </bpmndi:BPMNPlane>' +
            '    </bpmndi:BPMNDiagram>' +
            '</definitions>'
}

export default defaultXml