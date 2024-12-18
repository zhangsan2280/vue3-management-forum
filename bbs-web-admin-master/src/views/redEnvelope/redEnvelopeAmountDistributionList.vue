<!-- 发红包金额分配列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="$route.query.id != undefined && $route.query.id !=''" @click="$router.push({path: '/admin/control/redEnvelope/giveRedEnvelope/list', query:{ page:$route.query.giveRedEnvelopePage, id : $route.query.id,userName : encodeURIComponent(state.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">返回</el-button>					
            <el-button type="primary" plain v-if="$route.query.topicId != undefined && $route.query.topicId !=''" @click="$router.push({path: '/admin/control/topic/manage/view', query:{ visible:($route.query.visible != undefined ? $route.query.visible:''),topicView_beforeUrl:($route.query.topicView_beforeUrl != undefined ? $route.query.topicView_beforeUrl:''),topicId :$route.query.topicId, commentId:($route.query.commentId != undefined ? $route.query.commentId:''), page:($route.query.topicPage != undefined ? $route.query.topicPage:'')}})">返回</el-button>
        </div>
        <div class="nav-user clearfix" v-if="$route.query.id != undefined && $route.query.id !=''">
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
                        <i class="tag">发红包分配金额</i>
                </div>
            </div>
        </div>
        <div class="data-view" >
            <el-row :gutter="10" type="flex" v-if="$route.query.topicId != undefined && $route.query.topicId !=''">
                <el-col :span="4"><div class="name">话题：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        {{state.currentTopic.title}}
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">类型：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                        <span v-if="state.giveRedEnvelope.type == 10">个人定向红包</span>
                        <span v-if="state.giveRedEnvelope.type == 20">公共随机红包</span>
                        <span v-if="state.giveRedEnvelope.type == 30">公共定额红包</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">总金额：</div></el-col>
                <el-col :span="20">
                    <div class="content">
                    {{state.giveRedEnvelope.totalAmount}}
                        <span v-if="parseFloat(state.giveRedEnvelope.refundAmount) >0" style="color: red;">中止领取红包后返还金额￥{{state.giveRedEnvelope.refundAmount}}</span>
                    
                
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">发放数量：</div></el-col>
                <el-col :span="20"><div class="content">{{state.giveRedEnvelope.giveQuantity}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">已领取数量：</div></el-col>
                <el-col :span="20"><div class="content">{{state.giveRedEnvelope.giveQuantity - state.giveRedEnvelope.remainingQuantity}}</div></el-col>
            </el-row>
            <el-row :gutter="10" type="flex">
                <el-col :span="4"><div class="name">时间：</div></el-col>
                <el-col :span="20"><div class="content">{{state.giveRedEnvelope.giveTime}}</div></el-col>
            </el-row>
        </div>
        <div class="data-table" >
            
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="收红包用户" align="center" >
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.receiveNickname != null && scope.row.receiveNickname != ''">呢称: {{scope.row.receiveNickname}}</p>
                                <p v-if="scope.row.receiveUserName != null && scope.row.receiveUserName != ''">账号: {{scope.row.receiveAccount}}</p>
                            </template>
                            <template #reference>
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.receiveAvatarName == null || scope.row.receiveAvatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.receiveAvatarName != null && scope.row.receiveAvatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.receiveAvatarPath+'100x100/'+scope.row.receiveAvatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.receiveAccount}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" align="center" width="150"></el-table-column>
                <el-table-column label="收取时间" align="center" width="200">
                    <template #default="scope">
                        {{scope.row.receiveTime}}
                        <span v-if="scope.row.receiveUserId == null">本红包未被领取</span>
                    </template>
                </el-table-column>
            </el-table>
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
    import { GiveRedEnvelope, Topic, User } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],

    
        currentUser :{} as User,//当前用户
        currentTopic :{} as Topic,
        giveRedEnvelope :{} as GiveRedEnvelope,//发红包

        giveRedEnvelopeId :'',
        id :'',
        userName :'',//用户名称
        topicId:'',

        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    //查询发红包金额分配列表
    const queryRedEnvelopeAmountDistributionList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/redEnvelope/redEnvelopeAmountDistribution/list',
            method: 'get',
            params: {
                giveRedEnvelopeId :state.giveRedEnvelopeId,
					id :state.id,
                    userName :state.userName,
					topicId :state.topicId,
				  	page :state.currentpage
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
			    				
			    			}if(key == "currentTopic"){
			    				state.currentTopic = mapData[key];
			    				
			    			}if(key == "giveRedEnvelope"){
			    				state.giveRedEnvelope = mapData[key];
			    				
			    			}else if(key == "pageView"){
			    				let pageView = mapData[key];
			    				let list = pageView.records;
					    		if(list != null && list.length >0){
					    			state.tableData = list;
					 
					    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = pageView.currentpage;
									state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = pageView.maxresult;
									state.isShowPage = true;//显示分页栏
					    		}
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

          
        state.currentpage = (router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != '') ? parseInt(router.currentRoute.value.query.page as string) :1;
        

		if(router.currentRoute.value.query.topicId != undefined && router.currentRoute.value.query.topicId != ''){
			state.topicId = router.currentRoute.value.query.topicId as string;
			
		}

		if(router.currentRoute.value.query.giveRedEnvelopeId != undefined && router.currentRoute.value.query.giveRedEnvelopeId != ''){
			state.giveRedEnvelopeId = router.currentRoute.value.query.giveRedEnvelopeId as string;
			
		}
		if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
			
		}
		if(router.currentRoute.value.query.userName != undefined && router.currentRoute.value.query.userName != ''){
			state.userName = decodeURIComponent(router.currentRoute.value.query.userName as string);
			
		}

		queryRedEnvelopeAmountDistributionList();

    }) 

</script>
<style scoped lang="scss">
.topicUnhideModule{
    .headInfo{
        margin-top: 6px; 
        margin-left:8px; 
        margin-right:8px; 
        border-bottom:1px solid #eee;
        padding-bottom:4px; 
        margin-bottom:5px;
        text-align: center; 
        .title{
            margin-left:4px;
            font-size: 16px;
            line-height:26px;
            color:#909399;
            padding:6px 0;
        }
    }
}
</style>