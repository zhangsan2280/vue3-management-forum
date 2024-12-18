<!-- 添加用户 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/user/list', query:{ visible : ($route.query.visible != undefined ? $route.query.visible:''),page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="用户类型" :required="true" :error="error.type">
                    <el-radio-group v-model="state.type">
                        <el-radio :label="10">本地账号密码用户</el-radio>
                        <el-radio :label="20">手机用户</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="账号" :required="true" :error="error.account" v-if="state.type == 10">
                    <el-col :span="12"><el-input v-model.trim="state.account" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >会员用户名只能输入由数字、26个英文字母或者下划线组成</div>
                </el-form-item>
                <el-form-item label="手机" :required="state.type == 10? false :true" :error="error.mobile" >
                    <el-col :span="12"><el-input v-model.trim="state.mobile" maxlength="15" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="呢称" :error="error.nickname" >
                    <el-col :span="12"><el-input v-model.trim="state.nickname" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="密码" :required="true" :error="error.password" >
                    <el-col :span="12"><el-input v-model.trim="state.password" type="password" maxlength="30" :clearable="true" ></el-input></el-col>
                </el-form-item>
                <el-form-item label="Email地址" :error="error.email" >
                    <el-col :span="12"><el-input v-model.trim="state.email" maxlength="50" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="密码提示问题" :required="true" :error="error.issue" v-if="state.type == 10">
                    <el-col :span="12"><el-input v-model.trim="state.issue" maxlength="40" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="密码提示答案" :required="true" :error="error.answer" v-if="state.type == 10">
                    <el-col :span="12"><el-input v-model.trim="state.answer" maxlength="40" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="实名认证" :required="true" :error="error.realNameAuthentication">
                    <el-switch v-model="state.realNameAuthentication" ></el-switch>
                </el-form-item>
                <el-form-item label="用户状态" :required="true" :error="error.state">
                    <el-radio-group v-model="state.state">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示用户动态" :required="true" :error="error.allowUserDynamic">
                    <el-switch v-model="state.allowUserDynamic" ></el-switch>
                </el-form-item>
                
                
                <div v-for="(userCustom,index) in state.userCustomList">
                    <el-form-item :label="userCustom.name" :required="userCustom.required" :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==1">
                        <el-input v-model.trim="state.userBoundField[index]"  :clearable="true" :maxlength="userCustom.maxlength"></el-input>
                        <div class="form-help" >{{userCustom.tip}}</div>
                    </el-form-item>
                    <el-form-item :label="userCustom.name" :required="userCustom.required" :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==2">
                        <el-radio-group v-model="state.userBoundField[index]">
                            <el-radio :label="key" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-radio>
                        </el-radio-group>
                        <div class="form-help" >{{userCustom.tip}}</div>
                    </el-form-item>
                    <el-form-item :label="userCustom.name" :required="userCustom.required" :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==3">
                        <el-checkbox-group v-model="state.userBoundField[index]">
                            <el-checkbox :label="key" v-for="(value, key) in userCustom.itemValue" :key="key">{{value}}</el-checkbox>
                        </el-checkbox-group>
                        <div class="form-help" >{{userCustom.tip}}</div>
                    </el-form-item>
                    <el-form-item :label="userCustom.name" :required="userCustom.required" :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==4">
                        <el-select v-model="state.userBoundField[index]" size="large" :multiple="userCustom.multiple" placeholder="请选择">
                            <el-option v-for="(value, key) in userCustom.itemValue" :key="key" :label="value" :value="key"></el-option>
                        </el-select>
                        <div class="form-help" >{{userCustom.tip}}</div>
                    </el-form-item>
                    <el-form-item :label="userCustom.name" :required="userCustom.required" :error="error.userCustom.get('userCustom_'+userCustom.id)" v-if="userCustom.chooseType ==5">
                        <el-input type="textarea" v-model="state.userBoundField[index]" :rows="userCustom.rows" :clearable="true" :maxlength="userCustom.maxlength"></el-input>
                        <div class="form-help" >{{userCustom.tip}}</div>
                    </el-form-item>
                </div>
                
                <el-form-item label="用户角色" class="userModule">
                    <el-table ref="tableRef" :data="state.userRoleList" @selection-change="handleSelectionChange" tooltip-effect="dark" :show-header="false" stripe style="width: 100%" empty-text="没有角色">
                        <el-table-column type="selection" :selectable="checkSelectable"></el-table-column>
                        <el-table-column label="角色名称" >
                            <template #default="scope">	
                                {{scope.row.name}}
                                <span class="form-help" style="margin-left: 6px" v-if="scope.row.defaultRole">(默认角色)</span>
                                
                            </template>
                        </el-table-column>
                        <el-table-column label="有效期" >
                            <template #default="scope">	
                                
                                <el-tooltip content="有效期" placement="top" v-if="!scope.row.defaultRole">
                                    <el-form-item :error="error.validPeriodEnd.get('validPeriodEnd_'+scope.row.id)">
                                        <el-date-picker v-model="state.validPeriodEnd_format[scope.$index]" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="有效期" ></el-date-picker>
                                    </el-form-item>
                                </el-tooltip>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                
                
                
                
                
                
                <el-form-item label="备注"  :error="error.remarks"  >
                    <el-input type="textarea" v-model="state.remarks" :autosize="{minRows: 3}" placeholder="请输入内容" ></el-input>						
                </el-form-item>
                
                
                
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElTable } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { UserCustom, UserRole } from '@/types';
    import dayjs from "dayjs"

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const tableRef = ref<InstanceType<typeof ElTable>>()
    

    const state = reactive({
        type : 10,
        account :'',
        mobile :'',
        nickname :'',
        password :'',
        email :'',
        issue :'',
        answer :'',
        realNameAuthentication : false,
        state :1,
        allowUserDynamic :true,
        remarks :'',
        validPeriodEnd_format:[] as Array<string>,
        userBoundField : [] as any, //用户自定义注册功能项绑定
        
        multipleSelection: [],
        userRoleList:[] as Array<UserRole>,
        userCustomList:[] as Array<UserCustom>,
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        type :'',
        account :'',
        mobile :'',
        nickname :'',
        password :'',
        email :'',
        issue :'',
        answer :'',
        realNameAuthentication :'',
        state :'',
        allowUserDynamic :'',
        remarks :'',
        validPeriodEnd:new Map(),
        userCustom:new Map(),
    });


    //查询用户
    const queryUser = () => {
        state.userRoleList.length = 0;

        proxy?.$axios({
            url: '/control/user/manage',
            method: 'get',
            params: {
                method : 'add'
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "userRoleList"){
			    				state.userRoleList = mapData[key];
			    				
			    				if(state.userRoleList != null && state.userRoleList.length >0){
			    					for(let i=0; i<state.userRoleList.length; i++){
			    						state.validPeriodEnd_format.push(state.userRoleList[i].validPeriodEnd);
			    						if(state.userRoleList[i].defaultRole|| state.userRoleList[i].selected){
			    							nextTick(()=> {
			    								tableRef.value!.toggleRowSelection(state.userRoleList[i],true);
			    							});	
			    						}
			    					}
			    				}
			    			}else if(key == "userCustomList"){
			    				state.userCustomList = mapData[key];
								if (state.userCustomList != null && state.userCustomList.length > 0) {
									for (let i = 0; i < state.userCustomList.length; i++) {
										let userCustom = state.userCustomList[i];
										boundField(userCustom);
									}
								}
			    			}
			    			
			    		}
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //默认角色不允许选择
    const checkSelectable = (row:any, index:any) => {
		return !row.defaultRole;
	}
    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
    }

    //绑定字段
    const boundField = (userCustom:UserCustom) => {
        if (userCustom.chooseType == 1) { //文本框
            let content = "";
            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                content = userCustom.userInputValueList[i].content;
            }
            state.userBoundField.push(content);
        }else if (userCustom.chooseType == 2) { //单选框
            let checked = "";

            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                let userInputValue = userCustom.userInputValueList[i];
                checked = userInputValue.options;

            }
            //默认选第一项 
            if (checked == "") {
                for (let itemValue in userCustom.itemValue) {
                    checked = itemValue;
                    break;
                }
            }
            state.userBoundField.push(checked);
        } else if (userCustom.chooseType == 3) { //多选框
            let checked = new Array();

            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                let userInputValue = userCustom.userInputValueList[i];
                checked.push(userInputValue.options);
            }
            state.userBoundField.push(checked);
        }else if (userCustom.chooseType == 4) { //下拉列表
            if (userCustom.multiple == true) { //允许多选
                let checked = new Array();

                A:for (let itemValue in userCustom.itemValue) {
                    for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                        let userInputValue = userCustom.userInputValueList[i];
                        if (itemValue == userInputValue.options) {
                            checked.push(itemValue);
                            continue A;
                        }
                    }
                }
                state.userBoundField.push(checked);

            } else {
                
                let checked = "";

                A:for (let itemValue in userCustom.itemValue) {
                    for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                        let userInputValue = userCustom.userInputValueList[i];
                        if (itemValue == userInputValue.options) {
                            checked = itemValue;
                            break A;
                        }
                    }
                }
                state.userBoundField.push(checked);
            }


        } else if (userCustom.chooseType == 5) { //文本域
            let content = "";
            for (let i = 0; i < userCustom.userInputValueList.length; i++) {
                content = userCustom.userInputValueList[i].content;
            }
            state.userBoundField.push(content);
        }
    }
   

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        for (const [key, value] of Object.entries(error) as [string, string|Map<string,string>][]){
            if(value instanceof Map){
                value.clear();
            }else{
                Object.assign(error, {[key] : ''});
            }
        }

        let formData = new FormData();
        formData.append('type', String(state.type));
        formData.append('account', state.account);
        formData.append('mobile', state.mobile);
        formData.append('nickname', state.nickname);
        formData.append('password', state.password);
        formData.append('email', state.email);
        formData.append('issue', state.issue);
        formData.append('answer', state.answer);
        formData.append('realNameAuthentication', state.realNameAuthentication.toString());
        formData.append('state', String(state.state));
        formData.append('allowUserDynamic', state.allowUserDynamic.toString());
        formData.append('remarks', state.remarks);
    
        
        if (state.userCustomList != null && state.userCustomList.length > 0) {
            for (let i = 0; i < state.userCustomList.length; i++) {
                let userCustom = state.userCustomList[i];
                
                let fieldValue = state.userBoundField[i];

                if (userCustom.chooseType == 1) { //文本框
                    formData.append('userCustom_'+ userCustom.id, fieldValue);
                } else if (userCustom.chooseType == 2) { //单选框
                    formData.append('userCustom_'+ userCustom.id, fieldValue);
                } else if (userCustom.chooseType == 3) { //多选框
                    for (var value in fieldValue) {
                        formData.append('userCustom_'+ userCustom.id, fieldValue[value]);
                    }
                } else if (userCustom.chooseType == 4) { //下拉列表
                    if (userCustom.multiple == true) { //允许多选
                        for (var value in fieldValue) {
                            formData.append('userCustom_'+ userCustom.id, fieldValue[value]);
                        }
                    }else{
                        formData.append('userCustom_'+ userCustom.id, fieldValue);
                        
                    }
                } else if (userCustom.chooseType == 5) { //文本域
                    formData.append('userCustom_'+ userCustom.id, fieldValue);
                }
                
                
            }
        }
        
        for(let i=0; i<state.multipleSelection.length; i++){
            let rowData:any = state.multipleSelection[i];
            formData.append('userRolesId', rowData.id);
            
            
            for(let j=0; j<state.userRoleList.length; j++){
                if(state.userRoleList[j].id == rowData.id){
                    formData.append('validPeriodEnd_'+rowData.id, dayjs(state.validPeriodEnd_format[j]).format('YYYY-MM-DD HH:mm'));
                    break;
                }
                
            }
        }

        
        proxy?.$axios({
            url: '/control/user/manage?method=add',
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
							path : '/admin/control/user/list',
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

        queryUser();
        
    }) 
</script>