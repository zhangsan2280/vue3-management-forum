<!-- 添加用户自定义注册功能项 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/userCustom/list'})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="注册项名称" :required="true" :error="error.name">
                    <el-col :span="12"><el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="是否必填" :required="true" :error="error.required">
                    <el-switch v-model="state.required" ></el-switch>
                </el-form-item>
                <el-form-item label="后台是否可搜索" :required="true" :error="error.search">
                    <el-switch v-model="state.search" ></el-switch>
                    <div class="form-help" >只对'单选按钮''多选按钮''下拉列表'有效</div>
                </el-form-item>
                <el-form-item label="是否显示" :required="true" :error="error.visible">
                    <el-switch v-model="state.visible" ></el-switch>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right"  :min="1" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="提示" :error="error.tip" >
                    <el-input type="textarea" v-model="state.tip" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
                </el-form-item>
                
                
                <el-form-item label="选择类型" :required="true" :error="error.chooseType">
                    <el-select v-model="state.chooseType"  no-match-text="还没有类型" placeholder="选择类型">
                        <el-option v-for="item in state.chooseTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="输入框的宽度" :error="error.size" v-if="state.chooseType==1">
                    <el-col :span="4"><el-input v-model.trim="state.size" maxlength="10"></el-input></el-col>
                </el-form-item>
                <el-form-item label="输入框字符的最大长度" :error="error.maxlength" v-if="state.chooseType==1">
                    <el-col :span="4"><el-input v-model.trim="state.maxlength" maxlength="10"></el-input></el-col>
                </el-form-item>
                <el-form-item label="字段值过滤" :error="error.fieldFilter" v-if="state.chooseType==1">
                    <el-select v-model="state.fieldFilter" no-match-text="还没有内容" placeholder="选择字段值过滤">
                        <el-option v-for="item in state.fieldFilterOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="正则表达式" :required="true" :error="error.regular"  v-if="state.chooseType==1 && state.fieldFilter==5">
                    <el-input type="textarea" v-model="state.regular" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
                </el-form-item>
                
                
                
                <el-form-item v-for="(formOption, index) in state.formOptions" label="选项"  :prop="'formOptions.' + index + '.value'" v-if="state.chooseType==2 || state.chooseType==3 || state.chooseType==4" >
                  
                    <el-col :span="14">
                        <el-input v-model.trim="formOption.value" maxlength="40"></el-input>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-button size="large" :icon="Top" circle @click.prevent="moveUp(formOption)" title="上移"></el-button>
                        <el-button size="large" :icon="Bottom" circle @click.prevent="moveDown(formOption)" title="下移"></el-button>
                        <el-button size="large" :icon="Delete" circle @click.prevent="removeItem(formOption)" title="删除"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item v-if="state.chooseType==2 || state.chooseType==3 || state.chooseType==4" label=" ">
                    <div class="form-error" v-text="error.itemValue"></div>
                    <div class="item-button"><el-button size="large" :icon="Plus" @click="addItem">添加项</el-button></div>
                </el-form-item>
                
                <el-form-item label="可选择多个选项" :required="true" :error="error.multiple" v-if="state.chooseType==4">
                    <el-switch v-model="state.multiple" ></el-switch>
                </el-form-item>
                <el-form-item label="下拉列表中可见选项的数目" :error="error.selete_size" v-if="state.chooseType==4">
                    <el-col :span="4"><el-input v-model.trim="state.selete_size" maxlength="9" :clearable="true" ></el-input></el-col>
                </el-form-item>
                <el-form-item label="文本域内的可见行数" :error="error.rows" v-if="state.chooseType==5">
                    <el-col :span="4"><el-input v-model.trim="state.rows" maxlength="9" :clearable="true" ></el-input></el-col>
                </el-form-item>
                <el-form-item label="文本域内的可见宽度" :error="error.cols" v-if="state.chooseType==5">
                    <el-col :span="4"><el-input v-model.trim="state.cols" maxlength="9" :clearable="true" ></el-input></el-col>
                </el-form-item>
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage} from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { Top, Bottom,Delete,Plus} from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        name :'',
        required :false,
        search :false,
        visible :true,
        sort : 1,
        tip :'',
        chooseType :1,
        size :'',
        maxlength :'',
        fieldFilter :0,
        regular :'',
        multiple :false,
        selete_size :'',
        rows :'',
        cols :'',
        
        //选择类型
        chooseTypeOptions: [{
            value: 1,
            label: '输入框'
        }, {
            value: 2,
            label: '单选按钮'
        }, {
            value: 3,
            label: '多选按钮'
        }, {
            value: 4,
            label: '下拉列表'
        }, {
                value: 5,
                label: '文本域'
        }],
        fieldFilterOptions: [{
            value: 0,
            label: '无'
        }, {
            value: 1,
            label: '只允许输入数字'
        }, {
            value: 2,
            label: '只允许输入字母'
        }, {
            value: 3,
            label: '只允许输入数字和字母'
        }, {
            value: 4,
            label: '只允许输入汉字'
        }, {
            value: 5,
            label: '正则表达式过滤'
        }],
        //2.单选按钮  3.多选按钮 4.下拉列表 选择项
        formOptions: [{
            key: '',
            value: ''
        }],
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        required :'',
        search:'',
        visible :'',
        sort :'',
        tip :'',
        chooseType :'',
        size :'',
        maxlength :'',
        fieldFilter :'',
        regular :'',
        multiple :'',
        selete_size :'',
        rows :'',
        cols :'',
        itemValue:'',
    });

    //添加项
    const addItem = () => {
        state.formOptions.push({
            key: '',
            value: ''
        });
    }
    //删除项
    const removeItem = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if (index !== -1) {
            state.formOptions.splice(index, 1);
        }
    }
    //上移
    const moveUp = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if (index >0) {
            let upData = state.formOptions[index - 1];
            state.formOptions.splice(index - 1, 1);
            state.formOptions.splice(index, 0, upData);
        }
    }
    //下移
    const moveDown = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if ((index + 1) < state.formOptions.length) {
            let downData = state.formOptions[index + 1];
            state.formOptions.splice(index + 1, 1);
            state.formOptions.splice(index, 0, downData);
        }
    }
	   

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('name', state.name);
        formData.append('required', state.required.toString());
        formData.append('search', state.search.toString());
        formData.append('visible', state.visible.toString());
        formData.append('_sort', String(state.sort));
        formData.append('tip', state.tip);
        formData.append('chooseType', String(state.chooseType));
        
        if(state.chooseType != null){
            formData.append('_size', state.size);
            formData.append('_maxlength', state.maxlength);
            formData.append('fieldFilter', String(state.fieldFilter));
            
            if(state.regular != null && state.regular != ''){
                formData.append('regular', state.regular);
            }
            
        }
        
        if(state.formOptions != null && state.formOptions.length >0){
            for(let i=0; i<state.formOptions.length; i++){
                let formOption = state.formOptions[i];
                formData.append('itemKey', formOption.key);
                formData.append('_itemValue', formOption.value);
                
            }
        }
        
        
        
        formData.append('multiple', state.multiple.toString());
        formData.append('_selete_size', state.selete_size);
        formData.append('_rows', state.rows);
        formData.append('_cols', state.cols);

        proxy?.$axios({
            url: '/control/userCustom/manage?method=add',
            method: 'post',
            data: formData,
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
			    if(result){
                    let returnValue = JSON.parse(result);
			    	if(returnValue.code === 200){//成功
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
			    		router.push({
							path : '/admin/control/userCustom/list',
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.submitForm_disabled = false;//提交按钮disabled状态
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;//提交按钮disabled状态
        });
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

    }) 
</script>