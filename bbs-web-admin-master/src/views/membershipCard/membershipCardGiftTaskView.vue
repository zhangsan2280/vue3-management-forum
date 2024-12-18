<!-- 会员卡赠送任务 -->
<template>
   
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/membershipCardGiftTask/list', query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-view" v-if="state.membershipCardGiftTask != undefined && state.membershipCardGiftTask != null && Object.keys(state.membershipCardGiftTask).length>0">
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">名称：</div></el-col>
                <el-col :span="20"><div class="content">{{state.membershipCardGiftTask.name}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">角色：</div></el-col>
                <el-col :span="20"><div class="content">{{state.membershipCardGiftTask.userRoleName}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">任务类型：</div></el-col>
                <el-col :span="20"><div class="content">
                    <span v-if="state.membershipCardGiftTask.type ==10">长期</span>
                    <span v-if="state.membershipCardGiftTask.type ==20">一次性</span>
                </div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">任务创建时间：</div></el-col>
                <el-col :span="20"><div class="content">{{state.membershipCardGiftTask.createDate}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">用户注册时间范围：</div></el-col>
                <el-col :span="20"><div class="content">
                    <span v-if="state.membershipCardGiftTask.restrictionGroup.registrationTime_start != null || state.membershipCardGiftTask.restrictionGroup.registrationTime_end != null">
                        {{state.membershipCardGiftTask.restrictionGroup.registrationTime_start}} 至 {{state.membershipCardGiftTask.restrictionGroup.registrationTime_end}}
                    </span>
                    <span v-if="state.membershipCardGiftTask.restrictionGroup.registrationTime_start == null && state.membershipCardGiftTask.restrictionGroup.registrationTime_end == null">
                        无限制
                    </span>
                </div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">活动期间积分达到数量：</div></el-col>
                <el-col :span="20"><div class="content">
                    <span v-if="state.membershipCardGiftTask.restrictionGroup.totalPoint != null">
                        {{state.membershipCardGiftTask.restrictionGroup.totalPoint}}
                    </span>
                    <span v-if="state.membershipCardGiftTask.restrictionGroup.totalPoint == null">
                        无限制
                    </span>
                </div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">赠送时长：</div></el-col>
                <el-col :span="20"><div class="content">
                    {{state.membershipCardGiftTask.duration}}
                    <span v-if="state.membershipCardGiftTask.unit ==10">小时</span>
                    <span v-if="state.membershipCardGiftTask.unit ==20">日</span>
                    <span v-if="state.membershipCardGiftTask.unit ==30">月</span>
                    <span v-if="state.membershipCardGiftTask.unit ==40">年</span>
                </div></el-col>
            </el-row>
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
    import { MembershipCardGiftTask } from '@/types';
    import { processErrorInfo } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        membershipCardGiftTask :{} as MembershipCardGiftTask,
		    
        membershipCardGiftTaskId :'',
    });


    //查询会员卡赠送任务
    const queryMembershipCardGiftTask = () => {

        proxy?.$axios({
            url: '/control/membershipCardGiftTask/manage',
            method: 'get',
            params: {
                method :"view",
				membershipCardGiftTaskId : state.membershipCardGiftTaskId
            },
           // showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
                        state.membershipCardGiftTask = returnValue.data;
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



    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

       
        if(router.currentRoute.value.query.membershipCardGiftTaskId != undefined && router.currentRoute.value.query.membershipCardGiftTaskId != ''){
			state.membershipCardGiftTaskId = router.currentRoute.value.query.membershipCardGiftTaskId as string;
			
		}

		queryMembershipCardGiftTask();

    }) 
</script>