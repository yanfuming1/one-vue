import store from '../store/index'
import * as BPMN from '../enum/BPMN'
const ElementFactory = {}
let dataList = []
let prepositionNode = []
/**
 * 添加一个自定义元素标签
 * @param elementType 要生成的标签名称
 * @param parent 当前的的节点信息
 * @param factory bpmn对象
 * @returns {elementType}
 */
ElementFactory.createElement = function (elementType, data, isSingleton = false) {
    let element = store.state.d2admin.processDefinition.nodeData
    let bpmnFactory = store.state.d2admin.processDefinition.bpmnModeler.get('moddle')
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    // 目前只能创建一个
    var extensionElements
    // 创建一个 ExtensionElements 拓展标签 所有 bpmn.js不存在的标签 如有需要 必须创建在此标签下
    if (element.businessObject.extensionElements == null || isSingleton) {
        extensionElements = bpmnFactory.create('bpmn:ExtensionElements')
    } else {
        extensionElements = element.businessObject.extensionElements
    }
    var executionListener = ''
    if (data && data.length > 0) {
        data.forEach(res => {
            // 创建对应的需求标签
            executionListener = bpmnFactory.create(elementType)
            // 初始化赋值
            executionListener.class = res.class
            executionListener.event = res.event
            // 存入 ExtensionElements 拓展标签
            extensionElements.get('values').push(executionListener)
        })
    }
    // 更新数据
    modeling.updateProperties(element, { extensionElements: extensionElements })
}

/**
 *  更新角色组数据
 * @param candidateGroups
 */
ElementFactory.updateCandidateGroups = function (candidateGroups) {
    // var element = store.getters.nodeData.nodeData
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    // var modeling = store.getters.modeling.modeling
    modeling.updateProperties(element, {
        'activiti:candidateGroups': candidateGroups === null ? '${' + candidateGroups + '}' : `${'assignee'}`
    })
}

/**
 *  更新用户组数据
 * @param candidateGroups
 */
ElementFactory.updateCandidateUsers = function (isCandidateUser) {
    // var element = store.getters.nodeData.nodeData
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    // var modeling = store.getters.modeling.modeling
    modeling.updateProperties(element, {
        'activiti:candidateUsers': isCandidateUser ? '${assignee}' : '${deployNodeService.getCandidateUsers(execution)}'
    })
}

/**
 *  更新节点名称
 * @param name
 */
ElementFactory.updateName = function (name) {
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    modeling.updateProperties(element, {
        name: name
    })
}

/**
 *  更新节点id
 * @param name
 */
ElementFactory.updateId = function (id) {
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    modeling.updateProperties(element, {
        id: id
    })
}

/**
 *  更新节点对应的form表单
 * @param formKey
 */
ElementFactory.updateFormKey = function (formKey) {
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    modeling.updateProperties(element, {
        'activiti:formKey': formKey
    })
}

/**
 *  更新节点对应的节点leixing
 * @param formKey
 */
ElementFactory.updateCategory = function (category) {
    let element = store.state.d2admin.processDefinition.nodeData
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    modeling.updateProperties(element, {
        'activiti:category': category
    })
}

/**
 * 更新 到下一个节点的判断条件
 * @param sequenceFlow
 * @constructor
 */
ElementFactory.UpdateSequenceFlow = function (sequenceFlow) {
    let element = store.state.d2admin.processDefinition.nodeData
    let bpmnFactory = store.state.d2admin.processDefinition.bpmnModeler.get('moddle')
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    var newCondition = bpmnFactory.create('bpmn:FormalExpression', {
        body: '${ ' + sequenceFlow + '}'
    })
    modeling.updateProperties(element, {
        conditionExpression: newCondition
    })
}

/**
 * 更新会签
 * @param isCreate
 * @constructor
 */
ElementFactory.UpdateMultiInstanceLoopCharacteristics = function (isCreate) {

    let element = store.state.d2admin.processDefinition.nodeData
    let bpmnFactory = store.state.d2admin.processDefinition.bpmnModeler.get('moddle')
    let modeling = store.state.d2admin.processDefinition.bpmnModeler.get('modeling')
    var loopCharacteristics = null
    if (isCreate) {
        var loopCharacteristics = bpmnFactory.create('bpmn:MultiInstanceLoopCharacteristics')
      
        loopCharacteristics['collection'] = '${deployNodeService.getMultipleUsers(execution)}'
        loopCharacteristics['elementVariable'] = 'assignee'
    }
    modeling.updateProperties(element, { loopCharacteristics: loopCharacteristics });
}

/**
 * 获取所有节点（有序）
 */
ElementFactory.getCurrentNodePrepositionNode = function () {

    dataList = []
    prepositionNode = []
    let startEvent = {}
    let data = {}

    // 获取元素的注册列表 (只获取userTask)
    let neatenElement = store.state.d2admin.processDefinition.bpmnModeler.get ('elementRegistry').filter(function(element) {
        return is(element, BPMN.USERTEST);
    });
    
    // 获取开始节点
    startEvent = store.state.d2admin.processDefinition.bpmnModeler.get ('elementRegistry').get ('_2')

    // 当前点击的元素
    let element = store.state.d2admin.processDefinition.nodeData
  

    if (element.type !== BPMN.USERTEST) {
        return
    }

    if (neatenElement.length === 0) { return }

    elementIngoingLingth (element, neatenElement, startEvent, false, 'source')

    let s = dataList[dataList.length - 1]

    let m = dataList.filter((item, index) => {
        return dataList.indexOf(item) === index
    })
    
    let endIndex = m.findIndex (i => i.id === s.id)
    m.splice (endIndex, 1)
    m.push (s)

    data = {
        'dataList': neatenElement,
        'prepositionNode': prepositionNode
    } 

    return data
}

/**
 * 判断outgoing的长度
 * @param {*} item 
 * @param {*} elementList 
 */
function elementOutgoingLingth (item, elementList, element, isGetAll, isIngoing) {
    if (item && item['outgoing'] && item['outgoing'].length === 1) {
        neatenElementRegistry (item['outgoing'][0], elementList, element, isGetAll, isIngoing)
    } else if (item && item['outgoing'] && item['outgoing'].length > 1) {
        item['outgoing'].forEach (res => {
            neatenElementRegistry (res, elementList, element, isGetAll, isIngoing)
        })
    }
}

/**
 * 判断ingoing的长度
 * @param {*} item 
 * @param {*} elementList 
 */
function elementIngoingLingth (item, elementList, startEvent, isGetAll, isIngoing) {
    
    if (item['incoming'][0][isIngoing]['id'] === startEvent.id) {
        return
    }
    if (item && item['incoming'] && item['incoming'].length === 1) {
        neatenElementRegistry (item['incoming'][0], elementList, startEvent, isGetAll, isIngoing)
    } else if (item && item['incoming'] && item['incoming'].length > 1) {
        item['incoming'].forEach (res => {
            neatenElementRegistry (res, elementList, startEvent, isGetAll, isIngoing)
        })
    }
}

/**
 * 整理数据
 */
function neatenElementRegistry (data, elementList, element, isGetAll, isIngoing) {
    
    let item = {}
    let defaultElement = {}
    switch (data[isIngoing]['type']) {
        case BPMN.USERTEST:
            item = elementList.find (r => r.id === data[isIngoing]['businessObject']['id'])
            if (isGetAll) {
                dataList.push (item)
                elementOutgoingLingth (item, elementList, element, isGetAll, isIngoing)
            } else {
                prepositionNode.push (item)
                elementIngoingLingth (item, elementList, element, isGetAll, isIngoing)
            }
            
            break
        default:
            defaultElement = elementList.find (r => r.id === data[isIngoing]['businessObject']['id'])
            if (isGetAll) {
                elementOutgoingLingth (defaultElement, elementList, element, isGetAll, isIngoing)
            } else {
                elementIngoingLingth (item, elementList, element, isGetAll, isIngoing)
            }
            break
    }
}

function is(element, type) {
    var bo = getBusinessObject(element);
  
    return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
  }

function getBusinessObject(element) {
    return (element && element.businessObject) || element;
}

/**
 *  对应的bpmn 标签 会有对应变量接收 如果需要新增标签请去查看源码
 */
export default ElementFactory