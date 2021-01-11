<template>
    <div class="qqt-time-picker">
        <div class="input-group">
            <div v-if="isDetail">
                <p>{{ value }}</p>
            </div>
            <div v-else>
                <el-date-picker v-if="timeStyle === '1'"
                        v-model="value"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === '2'"
                        v-model="value"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        align="right"
                        :picker-options="pickerOptions"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope'"
                        v-model="value"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @blur="getTime">
                </el-date-picker>
                <el-date-picker v-if="timeStyle === 'scope-quick'"
                        v-model="value"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        @blur="getTime">
                </el-date-picker>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "qqt-date-time-picker",
        props: {
            timeStyle: String,
            // 是否显示详情
            isDetail: Boolean,
            defaultTime: String,
            scopeTime: Array
        },
        data () {
          return {
              value: '',
              pickerOptions: {
                  shortcuts: [{
                      text: '今天',
                      onClick(picker) {
                          picker.$emit('pick', new Date());
                      }
                  }, {
                      text: '昨天',
                      onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24);
                          picker.$emit('pick', date);
                      }
                  }, {
                      text: '一周前',
                      onClick(picker) {
                          const date = new Date();
                          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', date);
                      }
                  }]
              },
          }
        },
        methods: {
            getTime () {
                // 在父级调用时设置一个getTime方法接受时间
                this.$emit('getTime', this.value)
            }
        },
        beforeUpdate () {
            if(!this.isDetail){
                // 不是详情页面说明是新增或者编辑页面
                if(this.defaultTime === ''){
                    //说明是时间段
                    this.value = this.scopeTime
                } else {
                    this.value = this.defaultTime
                }
            }
        }
    }
</script>

<style scoped>

</style>
