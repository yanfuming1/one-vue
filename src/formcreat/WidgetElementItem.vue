<template>
    <span class="widget-element-item">
        <template v-if="element.type == 'input'">
            <el-input
                v-model="element.options.defaultValue"
                :style="{width: isTable ? '100%' : element.options.width}"
                :placeholder="element.options.placeholder"
                :disabled="element.options.disabled"
            >
                <template slot="prepend" v-if="element.options.frontSlot">{{element.options.frontText}}</template>
                <template slot="append" v-if="element.options.laterSlot">{{element.options.laterText}}</template>
            </el-input>
        </template>

        <template v-if="element.type == 'textarea'">
            <el-input type="textarea" :rows="5"
                v-model="element.options.defaultValue"
                :style="{width: isTable ? '100%' : element.options.width}"
                :disabled="element.options.disabled"
                :placeholder="element.options.placeholder"
            ></el-input>
        </template>

        <template v-if="element.type == 'number'">
            <el-input-number
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :controls-position="element.options.controlsPosition"
                :style="{width: isTable ? '100%' : element.options.width}"
            ></el-input-number>
        </template>

        <template v-if="element.type == 'radio'">
            <el-radio-group v-model="element.options.defaultValue"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
                <el-radio
                    :style="{display: element.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
                >
                    {{element.options.showLabel ? item.label : item.value}}
                </el-radio>
            </el-radio-group>
        </template>

        <template v-if="element.type == 'checkbox'">
            <el-checkbox-group v-model="element.options.defaultValue"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
                <el-checkbox
                    :style="{display: element.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value" v-for="(item, index) in element.options.options" :key="item.value + index"
                >
                    {{element.options.showLabel ? item.label : item.value}}
                </el-checkbox>
            </el-checkbox-group>
        </template>

        <template v-if="element.type == 'time'">
            <el-time-picker
                v-model="element.options.defaultValue"
                :is-range="element.options.isRange"
                :placeholder="element.options.placeholder"
                :start-placeholder="element.options.startPlaceholder"
                :end-placeholder="element.options.endPlaceholder"
                :readonly="element.options.readonly"
                :disabled="element.options.disabled"
                :editable="element.options.editable"
                :clearable="element.options.clearable"
                :arrowControl="element.options.arrowControl"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
            </el-time-picker>
        </template>

        <template v-if="element.type == 'date'">
            <el-date-picker
                v-model="element.options.defaultValue"
                :type="element.options.type"
                :is-range="element.options.isRange"
                :placeholder="element.options.placeholder"
                :start-placeholder="element.options.startPlaceholder"
                :end-placeholder="element.options.endPlaceholder"
                :readonly="element.options.readonly"
                :disabled="element.options.disabled"
                :editable="element.options.editable"
                :clearable="element.options.clearable"
                default-time="09:00:00"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
            </el-date-picker>
        </template>

        <template v-if="element.type == 'rate'">
            <el-rate v-model="element.options.defaultValue"
                :max="element.options.max"
                :disabled="element.options.disabled"
                :allow-half="element.options.allowHalf"
            ></el-rate>
        </template>

        <template v-if="element.type == 'color'">
            <el-color-picker
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :show-alpha="element.options.showAlpha"
            ></el-color-picker>
        </template>

        <template v-if="element.type == 'select'">

            <el-select
                v-if="element.options.btnIcon == null || element.options.btnIcon === ''"
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :multiple="element.options.multiple"
                :clearable="element.options.clearable"
                :placeholder="element.options.placeholder"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
                <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></el-option>
            </el-select>

            <el-select
                v-else
                class="select-prefix"
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :multiple="element.options.multiple"
                :clearable="element.options.clearable"
                :placeholder="element.options.placeholder"
                :style="{width: isTable ? '100%' : element.options.width}"
            >
                <span slot="prefix">
                    <el-button v-if="element.options.btnIcon" :icon="element.options.btnIcon" @click.stop=""></el-button>
                </span>
                <el-option v-for="item in element.options.options" :key="item.value" :value="item.value" :label="element.options.showLabel?item.label:item.value"></el-option>
            </el-select>
        </template>

        <template v-if="element.type=='switch'">
            <el-switch
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
            >
            </el-switch>
        </template>

        <template v-if="element.type=='slider'">
            <el-slider
                v-model="element.options.defaultValue"
                :min="element.options.min"
                :max="element.options.max"
                :disabled="element.options.disabled"
                :step="element.options.step"
                :show-input="element.options.showInput"
                :range="element.options.range"
                :style="{width: isTable ? '100%' : element.options.width}"
            ></el-slider>
        </template>

        <template v-if="element.type=='imgupload'">
            <fm-upload
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :style="{'width': isTable ? '100%' : element.options.width}"
                :width="element.options.size.width"
                :height="element.options.size.height"
                token="xxx"
                domain="xxx"
            >

            </fm-upload>
        </template>

        <template v-if="element.type == 'cascader'">
            <el-cascader
                v-model="element.options.defaultValue"
                :disabled="element.options.disabled"
                :clearable="element.options.clearable"
                :placeholder="element.options.placeholder"
                :style="{width: isTable ? '100%' : element.options.width}"
                :options="element.options.remoteOptions"
                :props="{ multiple:  element.options.multiple, checkStrictly:  element.options.checkStrictly }"
            >

            </el-cascader>
        </template>

  <!--    <template v-if="element.type == 'editor'">-->
  <!--      <vue-editor-->
  <!--        v-model="element.options.defaultValue"-->
  <!--        :style="{width: isTable ? '100%' : element.options.width}"-->
  <!--      >-->
  <!--      </vue-editor>-->
  <!--    </template>-->

        <template v-if="element.type=='blank'">
            <div style="height: 50px;color: #999;background: #eee;line-height:50px;text-align:center;">自定义区域</div>
        </template>

        <template v-if="element.type == 'text'">
            <span>{{element.options.defaultValue}}</span>
        </template>

        <template v-if="element.type == 'fileupload'">
            <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :style="{width: isTable ? '100%' : element.options.width}"
                :disabled="element.options.disabled"
                :limit="element.options.limit"
            >
                <el-button size="small" type="primary">点击上传</el-button>
                <div v-if="element.options.tip" class="el-upload__tip" slot="tip">{{element.options.tip}}</div>
            </el-upload>
        </template>
    </span>
</template>

<script>
import FmUpload from './Upload'
// import { VueEditor } from "vue2-editor"

export default {
    components: {
        FmUpload,
        // VueEditor
    },
    props: ['element', 'isTable']
}
</script>
<style lang="scss">
    .widget-element-item {
        .el-input--medium .el-input__inner {
            border-radius: 0px !important
        }
        .select-prefix{
            .el-button--medium {
                padding: 10px 10px;
                font-size: 14px;
                border-radius: 0px;
            }
            .el-input__prefix {
                right: 0px;
                text-align: right;
            }
            .el-input__suffix {
                right: 50px;
            }
            .el-input--prefix .el-input__inner {
                padding-left: 15px
            }
        }
    }
</style>
