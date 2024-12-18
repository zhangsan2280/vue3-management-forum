<!-- 修改会员卡赠送任务 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/membershipCardGiftTask/list', query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank membershipCardGiftTaskModule" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-input v-model.trim="state.name" maxlength="100" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="用户角色" :required="true" :error="error.userRoleId">
                    <el-radio-group v-model="state.userRoleId">
                        <el-radio :label="roles.id" v-for="roles in state.rolesList">{{roles.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="任务类型" >
                    <span v-if="state.type == 10" class="type-text">长期</span>
                    <span v-if="state.type == 20">一次性</span>
                    <div class="form-help" >长期任务类型在任务有效期内，会员活跃时会自动触发领取会员卡的任务；一次性任务类型由管理后台提交任务时就开始发放会员卡</div>
                </el-form-item>
                
                <div class="restriction">
                    <div class="title">限制条件</div>
                    <el-form-item label="用户注册时间范围" >
                        <el-form label-width="auto" inline="true" @submit.native.prevent style="position: relative; top:-12px;">
                            <el-form-item :error="error.restrictionGroup.registrationTime_start">
                                <el-col :span="24">
                                    <el-date-picker v-model="state.restrictionGroup.registrationTime_start" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="起始日期" ></el-date-picker>
                                    <div class="form-help" >不限制请留空</div>
                                </el-col>
                            </el-form-item>
                            <el-form-item class="form-item-text"> 至 </el-form-item>
                            <el-form-item :error="error.restrictionGroup.registrationTime_end" class="form-item">
                                <el-date-picker v-model="state.restrictionGroup.registrationTime_end" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="结束日期" ></el-date-picker>
                            </el-form-item>
                        </el-form>
                    </el-form-item>
                    <el-form-item label="活动期间积分达到数量" :error="error.restrictionGroup.totalPoint">
                        <el-col :span="4"><el-input v-model.trim="state.restrictionGroup.totalPoint" maxlength="9" :clearable="true" ></el-input></el-col>
                    </el-form-item>
                </div>
                <el-form-item label="任务有效期范围" v-if="state.type ==10">
                    <el-form label-width="auto" inline="true" @submit.native.prevent style="position: relative; top:-12px;">
                        <el-form-item :error="error.expirationDate_start">
                            <el-col :span="24">
                                <el-date-picker v-model="state.expirationDate_start" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="起始日期" ></el-date-picker>
                                <div class="form-help" >不限制请留空</div>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="form-item-text"> 至 </el-form-item>
                        
                        <el-form-item :error="error.expirationDate_end" class="form-item">
                            <el-date-picker v-model="state.expirationDate_end" type="datetime" format="YYYY-MM-DD HH:mm:ss" placeholder="结束日期" ></el-date-picker>
                        </el-form-item>
                    </el-form>
                    <div class="form-help" >建议起始至结束时间至少间隔三个小时以上</div>
                </el-form-item>
                
                
                <el-form-item label="时长" :required="true">
                    <el-col :span="12">
                        <el-form label-width="auto" inline="true" @submit.native.prevent style="position: relative; top:-12px;">
                            <el-form-item :error="error.duration">
                                <el-input v-model.trim="state.duration" maxlength="8" :clearable="true" show-word-limit></el-input>
                            </el-form-item>
                            <el-form-item :error="error.unit">
                                <el-select v-model="state.unit"  no-match-text="还没有单位" placeholder="选择单位" style="margin-left: 2px;">
                                    <el-option v-for="item in state.unitOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-form-item>
                
                <el-form-item label="是否启用" :error="error.enable">
                    <el-switch v-model="state.enable" ></el-switch>
                </el-form-item>
                
                <el-form-item>
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
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage} from 'element-plus';
    import { processErrorInfo, processErrorInfo_object } from '@/utils/tool';
    import { UserRole } from '@/types';
    import dayjs from "dayjs"
    
    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        membershipCardGiftTaskId:'',
        rolesList:[] as Array<UserRole>,
    
        name :'',
        type :10,
        userRoleId:'',
        expirationDate_start : '',
        expirationDate_end : '',
        enable:true,
        duration : '',
        unit: '',
            
        unitOptions: [{
            value: 10,
            label: '小时'
        }, {
            value: 20,
            label: '日'
        }, {
            value: 30,
            label: '月'
        }, {
            value: 40,
            label: '年'
        }],
        
        restrictionGroup:{
            registrationTime_start : '',
            registrationTime_end : '',
            totalPoint : ''
        },
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name :'',
        userRoleId:'',
        expirationDate_start : '',
        expirationDate_end : '',
        enable : '',
        duration : '',
        unit: '',
        restrictionGroup:{
            registrationTime_start : '',
            registrationTime_end : '',
            totalPoint : ''
        }
    });

    //查询修改会员卡赠送任务
    const queryEditMembershipCardGiftTask = () => {
        proxy?.$axios({
            url: '/control/membershipCardGiftTask/manage',
            method: 'get',
            params: {
                method : 'edit',
			    membershipCardGiftTaskId :state.membershipCardGiftTaskId,
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
			    			if(key == "membershipCardGiftTask"){
			    				let membershipCardGiftTask = mapData[key];
			    				state.name = membershipCardGiftTask.name;
			    				state.userRoleId = membershipCardGiftTask.userRoleId;
			    				state.type = membershipCardGiftTask.type;
			    				
			    				state.expirationDate_start = membershipCardGiftTask.expirationDate_start;
								state.expirationDate_end = membershipCardGiftTask.expirationDate_end;
								state.enable = membershipCardGiftTask.enable;
								state.duration = membershipCardGiftTask.duration;
								state.unit = membershipCardGiftTask.unit;
			    				state.restrictionGroup.registrationTime_start = membershipCardGiftTask.restrictionGroup.registrationTime_start;
			    				state.restrictionGroup.registrationTime_end = membershipCardGiftTask.restrictionGroup.registrationTime_end;
			    				state.restrictionGroup.totalPoint = membershipCardGiftTask.restrictionGroup.totalPoint;
			    				
			    				
			    			}else if(key == "userRoleList"){
			    				let rolesList = mapData[key];
			    				if(rolesList != null && rolesList.length >0){
			    					for(let i=0; i<rolesList.length; i++){
			    						let roles = rolesList[i];
			    						if(roles.selected){
			    							state.userRoleId = roles.id;
			    						}
			    					}
			    				}
			    				state.rolesList = rolesList;
			    			}
			    		}
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }


    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        for (const [key, value] of Object.entries(error) as any){
            if(value instanceof Object){
                Object.keys(value).forEach(key => (value[key] = ''));
            }else{
                Object.assign(error, {[key] : ''});
            }
        }
        let formData = new FormData();
        formData.append('membershipCardGiftTaskId', state.membershipCardGiftTaskId);
			
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.type != null){
            formData.append('type', String(state.type));
        }
        if(state.userRoleId != null){
            formData.append('userRoleId', state.userRoleId);
        }
        if(state.expirationDate_start != null && state.expirationDate_start != ''){
            formData.append('_expirationDate_start', dayjs(state.expirationDate_start).format('YYYY-MM-DD HH:mm:ss'));
        }else{
            formData.append('_expirationDate_start', '');
        }
        if(state.expirationDate_end != null && state.expirationDate_end != ''){
            formData.append('_expirationDate_end', dayjs(state.expirationDate_end).format('YYYY-MM-DD HH:mm:ss'));
        }else{
            formData.append('_expirationDate_end', '');
        }
        if(state.enable != null){
            formData.append('enable', state.enable.toString());
        }
        if(state.duration != null){
            formData.append('duration', state.duration);
        }
        if(state.unit != null){
            formData.append('unit', state.unit);
        }
        
        if(state.restrictionGroup.registrationTime_start != null && state.restrictionGroup.registrationTime_start != ''){
            formData.append('_registrationTime_start', dayjs(state.restrictionGroup.registrationTime_start).format('YYYY-MM-DD HH:mm:ss'));
        }else{
            formData.append('_registrationTime_start', '');
        }
        if(state.restrictionGroup.registrationTime_end != null && state.restrictionGroup.registrationTime_end != ''){
            formData.append('_registrationTime_end', dayjs(state.restrictionGroup.registrationTime_end).format('YYYY-MM-DD HH:mm:ss'));
        }else{
            formData.append('_registrationTime_end', '');
        }
        if(state.restrictionGroup.totalPoint != null){
            formData.append('restrictionGroup.totalPoint', state.restrictionGroup.totalPoint);
        }

        proxy?.$axios({
            url: '/control/membershipCardGiftTask/manage?method=edit',
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
							path : '/admin/control/membershipCardGiftTask/list',
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo_object(returnValue.data as Map<string,string> , error,()=>{});

			    		
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

        if(router.currentRoute.value.query.membershipCardGiftTaskId != undefined && router.currentRoute.value.query.membershipCardGiftTaskId != ''){
			state.membershipCardGiftTaskId = router.currentRoute.value.query.membershipCardGiftTaskId as string;
		}
		
		
		queryEditMembershipCardGiftTask();
    }) 

</script>