<template>
  <div>
    <qqt-radio v-model="soundMonitor.event" :value="soundMonitor.event" :options="radioList" :radio="performedBeforeAndAfter"></qqt-radio>
    <qqt-select v-model="soundMonitor.class" :value="soundMonitor.class" :options="options" @select="getSelectData"></qqt-select>
  </div>
</template>

<script>
import { qqtRadio, qqtSelect } from '../../../../components/qqt-subassembly'
export default {
  name: 'monitorBinding',
  props: {
    listener: {
      type: Object,
      default: () => {
        return {
          class: '1',
          event: '1'
        }
      }
    }
  },
  data () {
    return {
      options: [{
        value: '1',
        label: '监听1'
      }, {
        value: '2',
        label: '监听2'
      }, {
        value: '3',
        label: '监听3'
      }, {
        value: '4',
        label: '监听4'
      }, {
        value: '5',
        label: '监听5'
      }],
      soundMonitor: this.listener,
      radioList: [
        {
          value: 'start',
          label: '执行前'
        },
        {
          value: 'end',
          label: '执行后'
        }
      ]
    }
  },
  methods: {
    getSelectData (item) {
      this.soundMonitor.class = item
      this.$emit('selectMonitorData', this.soundMonitor)
    },
    performedBeforeAndAfter (item) {
      this.soundMonitor.event = item
      if (this.soundMonitor.class !== '') {
        this.$emit('selectMonitorData', this.soundMonitor)
      }
    }
  },
  watch: {
    // 数据改变重载页面数据
    listener () {
      this.soundMonitor = this.listener
    }
  },
  components: {
    'qqt-radio': qqtRadio,
    'qqt-select': qqtSelect
  }
}
</script>

<style scoped>

</style>
