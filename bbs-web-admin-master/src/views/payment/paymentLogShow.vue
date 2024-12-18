<!-- 支付日志详细 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/paymentLog/list', query:{ page:$route.query.paymentLogPage, id : $route.query.id,userName : encodeURIComponent(state.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">返回</el-button>					
        </div>
        <div class="nav-user clearfix">
            <div class="avatar">
                <el-popover effect="light" trigger="hover" placement="bottom">
                    <template #default>
                        <p >呢称: {{state.currentUser.nickname}}</p>
                        <p>账号: {{state.currentUser.account}}</p>
                    </template>
                    <template #reference>
                        <div class="avatar-wrapper" >
                            <div class="avatar-badge" v-if="state.currentUser.avatarName == null || state.currentUser.avatarName == ''">
                                <el-avatar shape="square" :size="64" :icon="UserFilled"></el-avatar>
                            </div>
                            <div class="avatar-badge" v-if="state.currentUser.avatarName != null && state.currentUser.avatarName != ''">
                                <el-avatar shape="square" :size="64" :src="state.currentUser.avatarPath+'100x100/'+state.currentUser.avatarName"></el-avatar>
                            </div>
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="userName" title="账号">
                {{state.currentUser.account}}
                <div class="nickname" title="呢称">
                    {{state.currentUser.nickname}}
                        <i class="tag">支付日志详细</i>
                </div>
            </div>
        </div>
        <div class="data-view" >
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">支付流水号：</div></el-col>
                <el-col :span="20"><div class="content">{{state.paymentLog.paymentRunningNumber}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">支付模块：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.paymentLog.paymentModule == 1">订单支付</span>
                        <span v-if="state.paymentLog.paymentModule == 5">用户充值</span>
                        <span v-if="state.paymentLog.paymentModule == 6">账户提现</span>
                        <span v-if="state.paymentLog.paymentModule == 70">余额购买话题隐藏内容</span>
                        <span v-if="state.paymentLog.paymentModule == 80">解锁话题隐藏内容分成</span>
                        <span v-if="state.paymentLog.paymentModule == 90">悬赏金额</span>
                        <span v-if="state.paymentLog.paymentModule == 100">采纳答案</span>
                        <span v-if="state.paymentLog.paymentModule == 110">调整赏金</span>
                        <span v-if="state.paymentLog.paymentModule == 120">话题发红包</span>
                        <span v-if="state.paymentLog.paymentModule == 130">话题收红包</span>
                        <span v-if="state.paymentLog.paymentModule == 140">话题返还红包</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">接口产品：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.paymentLog.interfaceProduct == -1">员工操作</span>
                        <span v-if="state.paymentLog.interfaceProduct == 0">预存款支付</span>
                        <span v-if="state.paymentLog.interfaceProduct == 1">支付宝即时到账</span>
                        <span v-if="state.paymentLog.interfaceProduct == 4">支付宝手机网站</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex" v-if="state.paymentLog.operationUserType ==1">
                <el-col :span="4"><div class="name">操作员工名称：</div></el-col>
                <el-col :span="20"><div class="content">{{state.paymentLog.operationUserName}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">交易号：</div></el-col>
                <el-col :span="20"><div class="content">{{state.paymentLog.tradeNo}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">参数Id：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.paymentLog.paymentModule == 1">订单Id </span>
                        <span v-if="state.paymentLog.paymentModule == 5">用户Id </span>
                        <span v-if="state.paymentLog.paymentModule == 70 || state.paymentLog.paymentModule == 80">话题Id </span>
                        <span v-if="state.paymentLog.paymentModule == 90">问题Id </span>
                        <span v-if="state.paymentLog.paymentModule == 100">答案Id </span>
                        <span v-if="state.paymentLog.paymentModule == 110">问题Id </span>
                        <span v-if="state.paymentLog.paymentModule == 120">发红包Id </span>
                        <span v-if="state.paymentLog.paymentModule == 130">收红包Id </span>
                        <span v-if="state.paymentLog.paymentModule == 140">发红包Id </span>
                        {{state.paymentLog.sourceParameterId}}
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">金额：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.paymentLog.amountState == 1">+</span>
                        <span v-if="state.paymentLog.amountState == 2">-</span>
                        {{state.paymentLog.amount}}
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">时间：</div></el-col>
                <el-col :span="20"><div class="content">{{state.paymentLog.times}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">备注：</div></el-col>
                <el-col :span="20"><div class="content">{{state.paymentLog.remark}}</div></el-col>
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
    import { UserFilled } from '@element-plus/icons-vue'
    import { PaymentLog,User } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const state = reactive({
        currentUser :{} as User,//当前用户
        paymentRunningNumber :'',
        paymentLog :{} as PaymentLog,//当前用户
        
        id :'',
        userName :'',//用户名称
    });


    //查询支付日志详细
    const queryPaymentLogShow = () => {
      
        proxy?.$axios({
            url: '/control/paymentLog/manage',
            method: 'get',
            params: {
                method :"show",
                paymentRunningNumber : state.paymentRunningNumber,
                id :state.id,
                userName :state.userName
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
                        let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "currentUser"){
			    				state.currentUser = mapData[key];
			    				
			    			}else if(key == "paymentLog"){
			    				state.paymentLog = mapData[key];
			    			}
			    		}
                    }else if(returnValue.code === 500){//错误
                        
                        
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


        if(router.currentRoute.value.query.paymentRunningNumber != undefined && router.currentRoute.value.query.paymentRunningNumber != ''){
			state.paymentRunningNumber = router.currentRoute.value.query.paymentRunningNumber as string;
			
		}

        if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
			
		}
		if(router.currentRoute.value.query.userName != undefined && router.currentRoute.value.query.userName != ''){
			state.userName = decodeURIComponent(router.currentRoute.value.query.userName as string);
			
		}

		queryPaymentLogShow();

    }) 
</script>