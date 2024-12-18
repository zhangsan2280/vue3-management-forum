<!-- 提醒列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/user/manage/show', query:{ id : $route.query.id,beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">返回</el-button>
        </div>
        <div class="nav-user">
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
                        <i class="tag">提醒</i>
                </div>
            </div>
        </div>
        <div class="data-table remindModule" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="发送用户" align="center" width="250">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.senderNickname != null && scope.row.senderNickname != ''">呢称: {{scope.row.senderNickname}}</p>
                                <p>账号: {{scope.row.senderAccount}}</p>
                            </template>
                            <template #reference>
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.senderAvatarName == null || scope.row.senderAvatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.senderAvatarName != null && scope.row.senderAvatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.senderAvatarPath+'100x100/'+scope.row.senderAvatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.senderAccount}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="提醒" align="center" >
                    <template #default="scope">
                        
                        <span v-if="scope.row.typeCode == 10">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId}})">{{scope.row.topicTitle}}</el-link> 评论了我的话题
                        </span>
                        <span v-if="scope.row.typeCode == 20">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId, replyId:scope.row.friendTopicReplyId}})">{{scope.row.topicTitle}}</el-link> 回复了我的话题
                        </span>
                        <span v-if="scope.row.typeCode == 30">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId}})">{{scope.row.topicTitle}}</el-link> 引用了我的评论
                        </span>
                        <span v-if="scope.row.typeCode == 40">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.topicCommentId, replyId:scope.row.friendTopicReplyId}})">{{scope.row.topicTitle}}</el-link> 回复了我的评论
                        </span>
                        <span v-if="scope.row.typeCode == 50">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId, replyId:scope.row.friendTopicReplyId}})">{{scope.row.topicTitle}}</el-link> 回复了我回复过的评论
                        </span>
                        <span v-if="scope.row.typeCode == 55">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId, replyId:scope.row.friendTopicReplyId}})">{{scope.row.topicTitle}}</el-link> 回复了我的评论回复
                        </span>
                        <span v-if="scope.row.typeCode == 60">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId}})">{{scope.row.topicTitle}}</el-link> 解锁了我的话题
                        </span>
                        <span v-if="scope.row.typeCode == 70">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId}})">{{scope.row.topicTitle}}</el-link> 赞了我的话题
                        </span>
                        <span v-if="scope.row.typeCode == 80">
                            关注了我
                        </span>
                        <span v-if="scope.row.typeCode == 90">
                            我关注的 {{scope.row.senderAccount}} 发表了话题 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId}})">{{scope.row.topicTitle}}</el-link>
                        </span>
                        <span v-if="scope.row.typeCode == 100">
                            我关注的 {{scope.row.senderAccount}} 在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId}})">{{scope.row.topicTitle}}</el-link> 发表了评论
                        </span>
                        <span v-if="scope.row.typeCode == 110">
                            我关注的 {{scope.row.senderAccount}} 在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId, replyId:scope.row.friendTopicReplyId}})">{{scope.row.topicTitle}}</el-link> 发表了评论回复
                        </span>
                        
                        <span v-if="scope.row.typeCode == 120">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.friendQuestionAnswerId}})">{{scope.row.questionTitle}}</el-link> 回答了我的问题
                        </span>
                        <span v-if="scope.row.typeCode == 130">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.friendQuestionAnswerId, replyId:scope.row.friendQuestionReplyId}})">{{scope.row.questionTitle}}</el-link> 回复了我的问题
                        </span>
                        <span v-if="scope.row.typeCode == 140">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.questionAnswerId, replyId:scope.row.friendQuestionReplyId}})">{{scope.row.questionTitle}}</el-link> 回复了我的答案
                        </span>
                        <span v-if="scope.row.typeCode == 150">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.questionAnswerId, replyId:scope.row.friendQuestionReplyId}})">{{scope.row.questionTitle}}</el-link> 回复了我回复过的答案
                        </span>
                        <span v-if="scope.row.typeCode == 160">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.questionAnswerId, replyId:scope.row.friendQuestionReplyId}})">{{scope.row.questionTitle}}</el-link> 回复了我的答案回复
                        </span>
                        <span v-if="scope.row.typeCode == 170">
                            我关注的 {{scope.row.senderAccount}} 提了问题 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId}})">{{scope.row.questionTitle}}</el-link>
                        </span>
                        <span v-if="scope.row.typeCode == 180">
                            我关注的 {{scope.row.senderAccount}} 在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.friendQuestionAnswerId}})">{{scope.row.questionTitle}}</el-link> 回答了问题
                        </span>
                        <span v-if="scope.row.typeCode == 190">
                            我关注的 {{scope.row.senderAccount}} 在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.friendQuestionAnswerId, replyId:scope.row.friendQuestionReplyId}})">{{scope.row.questionTitle}}</el-link> 发表了答案回复
                        </span>
                        <span v-if="scope.row.typeCode == 200">
                            在话题 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId}})">{{scope.row.topicTitle}}</el-link> 提到我
                        </span>
                        <span v-if="scope.row.typeCode == 210">
                            在评论 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.friendTopicCommentId}})">{{scope.row.topicTitle}}</el-link> 提到我
                        </span>
                        <span v-if="scope.row.typeCode == 230">
                            在问题 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId}})">{{scope.row.questionTitle}}</el-link> 提到我
                        </span>
                        <span v-if="scope.row.typeCode == 240">
                            在答案 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.friendQuestionAnswerId}})">{{scope.row.questionTitle}}</el-link> 提到我
                        </span>

                        <span v-if="scope.row.typeCode == 260">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.topicCommentId}})">{{scope.row.topicTitle}}</el-link> 赞了我的评论
                        </span>
                        <span v-if="scope.row.typeCode == 270">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.topicCommentId,replyId:scope.row.topicReplyId}})">{{scope.row.topicTitle}}</el-link> 赞了我的评论回复
                        </span>
                        <span v-if="scope.row.typeCode == 280">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId}})">{{scope.row.questionTitle}}</el-link> 赞了我的问题
                        </span>
                        <span v-if="scope.row.typeCode == 290">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.questionAnswerId}})">{{scope.row.questionTitle}}</el-link> 赞了我的答案
                        </span>
                        <span v-if="scope.row.typeCode == 300">
                            在 <el-link class="sourceTitle" href="javascript:void(0);" @click="store.setCacheNumber(); $router.push({path: '/admin/control/question/manage/view', query:{ questionId : scope.row.questionId,answerId:scope.row.questionAnswerId,replyId:scope.row.questionReplyId}})">{{scope.row.questionTitle}}</el-link> 赞了我的答案回复
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="sendTime" label="发送时间" align="center" width="160"></el-table-column>
                <el-table-column prop="readTime" label="阅读时间" align="center" width="160"></el-table-column>
                <el-table-column label="操作" align="center" width="130">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/remind/manage?method=reductionRemind&*','post')" v-if="scope.row.status >100" @click="reductionRemind($event,scope.row)">还原</el-button>
                        </el-button-group>
                    </template>
                
                </el-table-column>
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
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { UserFilled } from '@element-plus/icons-vue'
    import { User } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        currentUser:{} as User,//当前用户
        
        id :'',
        userName :'',//用户名称
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询提醒列表
    const queryRemindList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/remind/manage',
            method: 'get',
            params: {
                method : 'remindList',
			    id :state.id,
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


    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/remind/manage/remindList', 
            query:{ 
                id:state.id,
                userName :encodeURIComponent(state.userName),
                beforeUrl:(router.currentRoute.value.query.beforeUrl != undefined ? router.currentRoute.value.query.beforeUrl:''),
                page : page
            }
        });
    }



   //还原提醒
   const reductionRemind = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();

        ElMessageBox.confirm('此操作将还原该提醒, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            formData.append('userId', row.receiverUserId);
	    	formData.append('remindId', row.id);

            proxy?.$axios({
                url: '/control/remind/manage?method=reductionRemind&a=a',//a=a参数的作用是仅增加连接符&
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
                            ElMessage({
                                showClose: true,
                                message: '还原成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryRemindList();
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

        })
        .catch(() => {
            //取消
        })
    }


    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))


        if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
			
		}
		if(router.currentRoute.value.query.userName != undefined && router.currentRoute.value.query.userName != ''){
			state.userName = decodeURIComponent(router.currentRoute.value.query.userName as string);
			
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}


		queryRemindList();

    }) 
</script>
<style scoped lang="scss">
.remindModule{
	.sourceTitle{
        color: #409EFF;
    }
}
</style>