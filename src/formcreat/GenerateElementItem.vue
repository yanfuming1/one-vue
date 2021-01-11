<template>
    <div class="generate-element-item">
        <template v-if="widget.type == 'blank'">
            <div :style="{width: isTable ? '100%' : widget.options.width}">
                <slot :name="widget.model" :model="dataModels"></slot>
            </div>
        </template>
        <template v-if="widget.type == 'input'" >
            <el-input
                v-if="widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
                :type="widget.options.dataType"
                v-model.number="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :placeholder="widget.options.placeholder"
                :class="{isShowDetails: transform.isShowDetails}"
                :style="{width: isTable ? '100%' : widget.options.width}"
                @blur="inputBlur"
            ></el-input>
            <el-input
                v-else-if="widget.options.dataType == 'number'"
                :type="widget.options.dataType"
                v-model.number="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :placeholder="widget.options.placeholder"
                :class="{isShowDetails: transform.isShowDetails}"
                :style="{width: isTable ? '100%' : widget.options.width}"
                @blur="inputBlur"
            >
                <template slot="prepend" v-if="widget.options.frontSlot">{{widget.options.frontText}}</template>
                <template slot="append" v-if="widget.options.laterSlot">{{widget.options.laterText}}</template>
            </el-input>
            <el-input
                v-else-if="widget.options.dataType == 'money'"
                v-model="money"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :placeholder="widget.options.placeholder"
                :class="{isShowDetails: transform.isShowDetails}"
                :style="{width: isTable ? '100%' : widget.options.width}"
                @blur="blur(money)"
            >
                <template slot="prepend" v-if="widget.options.frontSlot">{{widget.options.frontText}}</template>
                <template slot="append" v-if="widget.options.laterSlot">{{widget.options.laterText}}</template>
            </el-input>
            <el-input
                v-else
                class="input-add-prefix"
                :type="widget.options.dataType"
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :placeholder="widget.options.placeholder"
                :class="{isShowDetails: transform.isShowDetails}"
                :style="{width: isTable ? '100%' : widget.options.width}"
                @blur="inputBlur"
            >
                <template slot="prepend" v-if="widget.options.frontSlot">{{widget.options.frontText}}</template>
                <template slot="append" v-if="widget.options.laterSlot && widget.options.laterText === '收藏'">
                    <el-button @click.stop="btnClick(dataModel)">{{widget.options.laterText}}</el-button>
                </template>
                <template slot="append" v-if="widget.options.laterSlot && widget.options.laterText !== '收藏'">{{widget.options.laterText}}</template>
                <div slot="prefix" v-if="widget.options.btnIcon">
                    <el-button v-if="widget.options.btnIcon" :disabled="transform.isShowDetails" :icon="widget.options.btnIcon" @click.stop="btnClick(dataModel)"></el-button>
                </div>
            </el-input>
        </template>

        <template v-if="widget.type == 'textarea'">
            <el-input type="textarea" :rows="2"
                v-model="dataModel"
                :disabled="!widget.options.isEnableDisabled ? !edit || widget.options.disabled || transform.isShowDetails : widget.options.disabled"
                :placeholder="widget.options.placeholder"
                :class="{isShowDetails: !widget.options.isEnableDisabled ? transform.isShowDetails : false}"
                :style="{width: isTable ? '100%' : widget.options.width}"
            ></el-input>
        </template>

        <template v-if="widget.type == 'number'">
            <el-input-number
                v-model="dataModel"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :step="widget.options.step"
                :disabled="!edit || widget.options.disabled"
                controls-position="right"
                :min="widget.options.min"
                :max="widget.options.max"
            ></el-input-number>
        </template>

        <template v-if="widget.type == 'radio'">
            <el-radio-group v-model="dataModel"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :class="{isShowDetails: transform.isShowDetails}"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
            >
                <el-radio
                    :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value" v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)" :key="index"
                >
                    <template v-if="widget.options.remote">{{item.label}}</template>
                    <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
                </el-radio>
            </el-radio-group>
        </template>

        <template v-if="widget.type == 'checkbox'">
            <el-checkbox-group v-model="dataModel"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :class="{isShowDetails: transform.isShowDetails}"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
            >
                <el-checkbox
                    :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value" v-for="(item, index) in (widget.options.remote ? remoteOptions : widget.options.options)" :key="index"
                >
                    <template v-if="widget.options.remote">{{item.label}}</template>
                    <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
                </el-checkbox>
            </el-checkbox-group>
        </template>

        <template v-if="widget.type == 'time'">
            <el-time-picker
                v-model="dataModel"
                :is-range="widget.options.isRange"
                :placeholder="widget.options.placeholder"
                :start-placeholder="widget.options.startPlaceholder"
                :end-placeholder="widget.options.endPlaceholder"
                :readonly="widget.options.readonly"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :editable="widget.options.editable"
                :clearable="widget.options.clearable"
                :arrowControl="widget.options.arrowControl"
                :value-format="widget.options.format"
                :class="{isShowDetails: transform.isShowDetails}"
                :style="{width: isTable ? '100%' : widget.options.width}"
            >
            </el-time-picker>
        </template>

        <template v-if="widget.type=='date'">
            <el-date-picker
                v-model="dataModel"
                :type="widget.options.type"
                :placeholder="widget.options.placeholder"
                :start-placeholder="widget.options.startPlaceholder"
                :end-placeholder="widget.options.endPlaceholder"
                :readonly="widget.options.readonly"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :editable="widget.options.editable"
                :clearable="widget.options.clearable"
                :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format"
                :format="widget.options.format"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :class="{isShowDetails: transform.isShowDetails}"
                :picker-options="pickerOptions"
            >
            </el-date-picker>
        </template>

        <template v-if="widget.type =='rate'">
            <el-rate v-model="dataModel"
                :max="widget.options.max"
                :disabled="widget.options.disabled"
                :allow-half="widget.options.allowHalf"
                :colors="['#d1d1d1', '#3ba5ff', '#3ba5ff']"
                text-color="#3ba5ff"
            ></el-rate>
        </template>

        <template v-if="widget.type == 'color'">
            <el-color-picker
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled"
                :show-alpha="widget.options.showAlpha"
            ></el-color-picker>
        </template>

        <template v-if="widget.type == 'select'" class="widgetSelect">
            <el-select
                v-if="widget.options.btnIcon == null || widget.options.btnIcon === ''"
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :multiple="widget.options.multiple"
                :clearable="widget.options.clearable"
                :placeholder="widget.options.placeholder"
                :allow-create="widget.options.allowCreate"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :class="{isShowDetails: transform.isShowDetails}"
                :filterable="widget.options.filterable"
            >
                <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
            </el-select>

            <el-select
                v-else
                class="select-prefix"
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :multiple="widget.options.multiple"
                :clearable="widget.options.clearable"
                :placeholder="widget.options.placeholder"
                :allow-create="widget.options.allowCreate"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :class="{isShowDetails: transform.isShowDetails}"
                :filterable="widget.options.filterable"
            >
                <span slot="prefix" v-if="!transform.isShowDetails">
                    <el-button v-if="widget.options.btnIcon" :icon="widget.options.btnIcon" @click.stop="btnClick(dataModel)"></el-button>
                </span>
                <el-option v-for="item in (widget.options.remote ? remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
            </el-select>

        </template>

        <template v-if="widget.type=='switch'">
            <el-switch
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
            >
            </el-switch>
        </template>

        <template v-if="widget.type=='slider'">
            <el-slider
                v-model="dataModel"
                :min="widget.options.min"
                :max="widget.options.max"
                :disabled="!edit || widget.options.disabled"
                :step="widget.options.step"
                :show-input="widget.options.showInput"
                :range="widget.options.range"
                :style="{width: isTable ? '100%' : widget.options.width}"
            ></el-slider>
        </template>

        <template v-if="widget.type=='imgupload'">
            <fm-upload
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled"
                :style="{'width': isTable ? '100%' : widget.options.width}"
                :width="widget.options.size.width"
                :height="widget.options.size.height"
                :token="widget.options.token"
                :domain="widget.options.domain"
                :multiple="widget.options.multiple"
                :limit="widget.options.limit"
                :is-qiniu="widget.options.isQiniu"
                :is-delete="widget.options.isDelete"
                :min="widget.options.min"
                :is-edit="widget.options.isEdit"
                :action="widget.options.action"
            >
            </fm-upload>
        </template>

<!--      <template v-if="widget.type == 'editor'">-->
<!--        <vue-editor-->
<!--          v-model="dataModel"-->
<!--          :style="{width: isTable ? '100%' : widget.options.width}"-->
<!--        >-->
<!--        </vue-editor>-->
<!--      </template>-->

        <template v-if="widget.type == 'cascader'">
            <el-cascader
                v-model="dataModel"
                :disabled="!edit || widget.options.disabled || transform.isShowDetails"
                :clearable="widget.options.clearable"
                :placeholder="widget.options.placeholder"
                :collapse-tags="widget.options.collapseTags"
                :style="{width: isTable ? '100%' : widget.options.width}"
                :options="remoteOptions"
                :class="{isShowDetails: transform.isShowDetails}"
                :props="{ multiple: widget.options.multiple, checkStrictly: widget.options.checkStrictly }"
            >
            </el-cascader>
        </template>

        <template v-if="widget.type == 'text'">
            <span>{{dataModel}}</span>
        </template>

        <template v-if="widget.type == 'fileupload'">
            <fm-file-upload
                v-model="dataModel"
                :action="widget.options.action"
                :width="isTable ? '100%' : widget.options.width"
                :disabled="!edit || widget.options.disabled"
                :limit="widget.options.limit"
                :tip="widget.options.tip"
            ></fm-file-upload>
        </template>

        <template v-if="widget.type == 'table'">
            <div class="fm-form-table-color">
                <fm-form-table
                    v-model="dataModel"
                    :columns="widget.tableColumns"
                    :models="dataModels"
                    :remote="remote"
                    :blanks="blanks"
                    :transform="transform"
                    :disabled="!edit || widget.options.disabled"
                    :rules="rules"
                    :name="widget.model"
                    :isShowSummary="widget.options.isShowSummary"
                    :remote-option="remoteOption"
                    @btnTableClick="btnTableClick"
                    @inputTableChange="inputTableChange"
                >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                        <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                </fm-form-table>
            </div>
        </template>
        <i v-if="transform.isShowElementIcon && transform.prop[`${widget.model}${models.id}`] && transform.prop[`${widget.model}${models.id}`] == models.id"
            :class="{'fm-from-table-icon': isTable}"
            class="el-icon-paperclip fm-form-icon"
            @click="btnClick"
        ></i>
    </div>
</template>

<script>
import FmUpload from './Upload'
import FmFormTable from './FormTable'
import FmFileUpload from './Upload/file'

export default {

    name: 'generate-element-item',
    
    components: {
        FmUpload,
        FmFormTable,
        FmFileUpload,
    },

    props: ['widget', 'value', 'models', 'remote', 'isTable', 'blanks', 'disabled', 'edit', 'remoteOption', 'rules', 'transform'],
    
    data () {
        return {
            dataModel: this.value,
            dataModels: {...this.models},
            money: '',
            pickerOptions: this.getIsDisabledDate (),
            remoteOptions: []
        }
    },

    created () {
        if (this.remote) this.remoteNeaten ()
        if (this.widget.options.dataType === 'money' && this.value != null) {
            this.blur (this.value)
        }
    },

    methods: {
        processRemoteProps (children, props) {
            if (children && children.length) {
                return children.map(item => {
                    if (this.processRemoteProps(item[props.children], props).length) {
                        return {
                            value: item[props.value],
                            label: item[props.label],
                            children: this.processRemoteProps(item[props.children], props)
                        }
                    } else{
                        return {
                            value: item[props.value],
                            label: item[props.label],
                        }
                    }
                })
            } else {
                return []
            }
        },

        remoteNeaten () {
            this.remoteOptions = []
            if (this.widget.options.remote 
                && (Object.keys(this.widget.options).indexOf('remoteType') >= 0 ? this.widget.options.remoteType == 'func' : true)
                && this.remote[this.widget.options.remoteFunc]) {

                this.remote[this.widget.options.remoteFunc]((data) => {
                    this.loadOptions(data)
                })
            }

            if (this.widget.options.remote 
                && this.widget.options.remoteType == 'option' 
                && this.remoteOption[this.widget.options.remoteOption]) {
            
                this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
            }

            if (this.widget.type === 'imgupload' && this.widget.options.isQiniu) {
            
                this.remote[this.widget.options.tokenFunc]((data) => {
                    this.widget.options.token = data
                })
            }
        },

        loadOptions (data) {
            if (!data) return
            this.remoteOptions = data.map(item => {
                if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
                    return {
                        value: item[this.widget.options.props.value],
                        label: item[this.widget.options.props.label],
                        children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
                    }
                } else {
                    return {
                        value: item[this.widget.options.props.value],
                        label: item[this.widget.options.props.label],
                        parentId: item && item.parentId ? item.parentId : '0',
                    }
                }
                
            })
        },

        btnClick () {
            if(this.widget.type == 'select'){
                let list = this.widget.options.remote ? this.remoteOptions : this.widget.options.options
                this.$emit ('btnClick', list[0] ? list[0]['parentId'] || 0 : this.widget.model)
            }else{
                this.$emit ('btnClick', this.widget.model)
            }
        },

        btnTableClick (name, index, tableData, field, model, label) {
            this.$emit ('btnTableClick', name, index, tableData, model, label)
        },

        inputTableChange (field, value, index) {
            this.$emit ('inputTableChange', field, value, index)
        },

        blur (value) {
            value = value ? parseFloat(value.toString().replace(/[^0-9._-]/g, '')) || 0 : '';
            this.dataModel = JSON.parse (JSON.stringify (value)).toString ()
            let formattedValue = '';
            if (value !== 0 && value !== '')
                formattedValue = Number(value)
                        .toFixed(2)
                        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g,'$&,');
            else
                formattedValue = value;
            
            this.money = formattedValue
        },

        inputBlur () {
            this.$emit ('inputBlur', this.dataModel)
        },

        getIsDisabledDate () {
            let item = {}
            if (this.widget.type == 'date') {
                switch (this.widget.options.isDisabledDate) {
                    case '1':
                        item = {
                            disabledDate(time) {
                                return time.getTime() > Date.now();
                            }
                        }
                        break;
                    case '2':
                        item = {
                            disabledDate(time) {
                                return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                            }
                        }
                        break;
                }
            }
            return item
        },
    },

    watch: {

        value: {
            deep: true,
            handler (val) {
                this.widget.options.dataType == 'money' ? this.blur(this.value) : ''
                this.dataModel = val
            }
        },

        dataModel (val) {
            this.$emit('input', val)
        },

        transform: {
            deep: true,
            handler (val) {
                this.transform = val
            }
        },

        'remoteOption': {
            deep: 'true',
            handler: function (val) {
                if (Object.keys(this.remoteOption).indexOf(this.widget.options.remoteOption) >= 0
                    && this.widget.options.remote 
                    && this.widget.options.remoteType == 'option' 
                ) {
                    this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
                }
            }
        },

        remote: {
            deep: 'true',
            handler: function (val) {
                this.remoteNeaten ()
            }
        }
    }
}
</script>
<style lang="scss">
    .generate-element-item {
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
        .input-add-prefix{
            .el-input__inner{
                padding-left: 15px;
            }
            .el-input__prefix{
                right: 0px;
                width: 50px;
                left: calc(100% - 50px);
                .el-button{
                    border-radius: 0px;
                    width: 100%;
                }
            }
        }
        .el-input-group__append, .el-input-group__prepend {
            border-radius: 0px !important
        }
        .fm-form-table-color {
            background: #7db5d61f;
            padding: 10px;
        }
        .fm-form-icon {
            position: absolute;
            height: 36px;
            line-height: 36px;
            margin-left: 2px;
            font-size: 20px;
            color: $color-primary;
        }
        .fm-from-table-icon {
            line-height: 100px;
            margin-left: -10px;
        }
    }
</style>
