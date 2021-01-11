<template>
  <div class="calcuDate">
    <div v-if="!isWrite">
      <el-input  class="moneyInput" size="medium" type="number" v-model="dayNum"
        @input="change"
        min="0"
        >
        <template slot="append" class="append">天
        </template>
      </el-input>   
      <el-input 
        readonly
        v-if="!isWrite"
        size="medium"
        class="timeInput"
        v-model="dateRange"
        >
      </el-input>
    </div>
      <p v-if="isWrite">{{ dayNum }} 天 {{ dateRange }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      isWrite: {
        type: Boolean,
        default: true 
      },
      day: {
        type: Number,
        default: 0 
      },
      startTime: {
        type: String,
        default: "" 
      },

    },
    data() {
      return {
        dayNum: 0,
        dateRange: '',
        endTimeData: ''
      }
    },
    methods: {
      change(value) {
          this.dayNum = value;
          let dateTime = value * 86400000;
          if (this.startTime) {
            let sumTime = new Date(this.startTime).getTime() + dateTime;
            let endTime = new Date(sumTime).format('yyyy-MM-dd');
            this.endTimeData = endTime
            this.dateRange = new Date(this.startTime).format('yyyy-MM-dd') + ' - ' +endTime;
          }
      },
      returnData(){
        return this.dayNum
      },
      getEndTime(){
        return this.endTimeData
      }
    },
    mounted () {
      this.dayNum = this.day
      this.change(this.dayNum)
    },
    watch: {
      day(newValue) {
        this.change(newValue)
      },
      startTime(){
        this.change(this.day)
      },
      day (newVal) {
        this.dayNum = newVal
        this.change(this.dayNum)
      }
    },
  }
</script>

<style lang="scss">
  .calcuDate {
    .moneyInput {
      width: 30%;
      .el-input__inner{
        padding:0 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-input-group__append{
          border-right: 0 !important;
          border-radius: 0 !important;
          padding: 0px 10px;
      }
    }
    .timeInput {
      width: 70%;
       .el-input__inner{
        padding:0 5px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    input[type="number"]{
      -moz-appearance: textfield;
    }
  }
</style>