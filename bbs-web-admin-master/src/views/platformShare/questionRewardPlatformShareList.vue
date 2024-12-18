<!-- 问答悬赏平台分成列表 -->
<template>
<div class="main">
        <div class="search">
            <el-form :inline="true" label-width="auto" @keyup.enter.native="submitForm">
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.start_times" >
                        <el-date-picker v-model="state.start_times_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="起始日期" ></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-tooltip content="不限制请留空" placement="top">
                    <el-form-item :error="error.end_times" >
                        <el-date-picker v-model="state.end_times_format" type="datetime" format="YYYY-MM-DD HH:mm" placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-tooltip>
                <el-form-item >
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" >筛选</el-button>
                    <el-button type="primary" size="large" class="submitButton" @click="nowSubmit" >今天</el-button>
                    <el-button type="primary" size="large" class="submitButton" @click="yesterdaySubmit" >昨天</el-button>
                </el-form-item>
                
            </el-form>
        </div> 
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="问题标题" align="center" >
                    <template #default="scope">
                        <el-link href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:''}})">{{scope.row.questionTitle}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="提问题的用户" align="center" min-width="150">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.staff == false">呢称: {{scope.row.postNickname}}</p>
                                <p>账号: {{scope.row.postAccount}}</p>
                            </template>
                            <template #reference v-if="scope.row.staff == false">
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.postAvatarName == null || scope.row.postAvatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.postAvatarName != null && scope.row.postAvatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.postAvatarPath+'100x100/'+scope.row.postAvatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.postAccount}}</div>
                                </div>
                            </template>
                            
                            <template #reference v-if="scope.row.staff == true">
                                <div class="avatar-wrapper">
                                    <el-badge value="员工" type="warning" class="avatar-badge">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </el-badge>
                                    <div class="avatar-text">{{scope.row.postAccount}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="回答问题的用户" align="center" min-width="150">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.staff == false">呢称: {{scope.row.answerNickname}}</p>
                                <p>账号: {{scope.row.answerAccount}}</p>
                            </template>
                            <template #reference v-if="scope.row.staff == false">
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.answerAvatarName == null || scope.row.answerAvatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.answerAvatarName != null && scope.row.answerAvatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.answerAvatarPath+'100x100/'+scope.row.answerAvatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.answerAccount}}</div>
                                </div>
                            </template>
                            
                            <template #reference v-if="scope.row.staff == true">
                                <div class="avatar-wrapper">
                                    <el-badge value="员工" type="warning" class="avatar-badge">
                                        <el-avatar :size="48" icon="el-icon-user-solid"></el-avatar>
                                    </el-badge>
                                    <div class="avatar-text">{{scope.row.answerAccount}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="answerUserShareRunningNumber" label="回答问题的用户分成流水号" align="center" width="260"></el-table-column>
                <el-table-column label="平台分成比例" align="center"  width="120">
                    <template #default="scope">
                        {{scope.row.platformShareProportion}}%
                    </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="总金额" align="center" width="100"></el-table-column>
                <el-table-column prop="shareAmount" label="平台分成金额" align="center" width="120"></el-table-column>
                <el-table-column prop="adoptionTime" label="采纳时间" align="center" width="170"></el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="state.isShowPage">
                <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElTable } from 'element-plus';
    import { UserFilled } from '@element-plus/icons-vue'
    import dayjs from "dayjs"

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        start_times :'',//日期 起始
        end_times :'',//日期 结束
        
        start_times_format :'',//日期 起始 格式化为适合el-date-picker标签的值
        end_times_format :'',//日期 结束  格式化为适合el-date-picker标签的值

        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    const error = reactive({
        start_times :'',
        end_times :'',
    });

    //查询问答悬赏平台分成列表
    const queryQuestionRewardPlatformShareList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/questionRewardPlatformShare/list',
            method: 'get',
            params: {
                start_times :state.start_times,
                end_times :state.end_times,
                page :  state.currentpage
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
			    		let pageView = returnValue.data;
			    		let list = pageView.records;
			    		if(list != null && list.length >0){
			    			state.tableData = list;
			 
			    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.currentpage = pageView.currentpage;
							state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.maxresult = pageView.maxresult;
							state.isShowPage = true;//显示分页栏
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

    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/questionRewardPlatformShare/list', 
            query:{
                start_times :encodeURIComponent(state.start_times),
                end_times :encodeURIComponent(state.end_times),
                page : page
            }
        });
    }

    //提交表单
    const submitForm  = () => {
        //删除缓存
        store.setCacheNumber();

        if(state.start_times_format != null && state.start_times_format != ''){
            state.start_times = dayjs(state.start_times_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.start_times = '';
        }
        if(state.end_times_format != null && state.end_times_format != ''){
            state.end_times = dayjs(state.end_times_format).format('YYYY-MM-DD HH:mm');
        }else{
            state.end_times = '';
        }
        
        
        router.push({
            path: '/admin/control/questionRewardPlatformShare/list', 
            query:{ 
                start_times :encodeURIComponent(state.start_times),
                end_times :encodeURIComponent(state.end_times),
                page : 1,
                time: new Date().getTime()
            }
        });
    }
    //今天筛选提交
    const nowSubmit  = () => {
        //删除缓存
        store.setCacheNumber();
        
        
        state.start_times =  dayjs(getDay(0)+" 00:00").format('YYYY-MM-DD HH:mm');
        
        state.end_times =  dayjs(getDay(0)+" 23:59").format('YYYY-MM-DD HH:mm');
        
        
        
        router.push({
            path: '/admin/control/questionRewardPlatformShare/list', 
            query:{ 
                start_times :encodeURIComponent(state.start_times),
                end_times :encodeURIComponent(state.end_times),
                page : 1,
                time: new Date().getTime()
            }
        });
    }
    //昨天筛选提交
    const yesterdaySubmit  = () => {
        //删除缓存
        store.setCacheNumber();
        
        
        state.start_times =  dayjs(getDay(-1)+" 00:00").format('YYYY-MM-DD HH:mm');
        
        state.end_times =  dayjs(getDay(-1)+" 23:59").format('YYYY-MM-DD HH:mm');
        
        
        
        router.push({
            path: '/admin/control/questionRewardPlatformShare/list', 
            query:{ 
                start_times :encodeURIComponent(state.start_times),
                end_times :encodeURIComponent(state.end_times),
                page : 1,
                time: new Date().getTime()
            }
        });
    }
    
    //计算今天的前后日期  参数day: 天 如2为后天 0为今天 -1为昨天
    const getDay  = (day:number) => {
        let today = new Date();  
                
        let targetday_milliseconds=today.getTime() + 1000*60*60*24*day;          
        
        today.setTime(targetday_milliseconds); //注意，这行是关键代码    
                
        let tYear = today.getFullYear();  
        let tMonth = today.getMonth();  
        let tDate = today.getDate();  
        let _tMonth = doHandleMonth(tMonth + 1);  
        let _tDate = doHandleMonth(tDate);  
        return tYear+"-"+_tMonth+"-"+_tDate;  
    }
    //补零
    const doHandleMonth = (month:number) => {
        let m = String(month);  
        if(month.toString().length == 1){  
            m = "0" + month;  
        }  
        return m;  
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))


		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}
		
		if(router.currentRoute.value.query.start_times != undefined && router.currentRoute.value.query.start_times != ''){
			state.start_times_format = decodeURIComponent(router.currentRoute.value.query.start_times as string);
			state.start_times = state.start_times_format;
		}
		if(router.currentRoute.value.query.end_times != undefined && router.currentRoute.value.query.end_times != ''){
			state.end_times_format = decodeURIComponent(router.currentRoute.value.query.end_times as string);
			state.end_times = state.end_times_format;
		}
		
		//初始化
		queryQuestionRewardPlatformShareList();
		
    }) 

</script>