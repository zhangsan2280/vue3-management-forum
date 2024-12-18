<!-- 私信对话列表 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/privateMessage/manage/privateMessageList', query:{ page:$route.query.privateMessagePage, id : $route.query.id,userName : encodeURIComponent(state.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">返回</el-button>					
        </div>
        
        
        <div class="privateMessageChatModule">
            <div class="headInfo">
                <div class="title">与 {{state.chatUser.account}} <span v-if="state.chatUser.nickname != null && state.chatUser.nickname != ''">({{state.chatUser.nickname}})</span> 的对话</div>
            </div>
        
            <div v-for="privateMessage in state.privateMessageChatList" >
                <div class="friend" v-if="privateMessage.friendUserId == privateMessage.senderUserId">
                    <el-popover effect="light" trigger="hover" placement="top">
                        <template #default>
                            <p v-if="privateMessage.senderNickname != null && privateMessage.senderNickname != ''">呢称: {{privateMessage.senderNickname}}</p>
                            <p>账号: {{privateMessage.senderAccount}}</p>
                        </template>
                        <template #reference>
                            <div class="avatar-wrapper" >
                                <div class="avatar-badge" v-if="privateMessage.senderAvatarName == null || privateMessage.senderAvatarName == ''">
                                    <el-avatar :size="64" :icon="UserFilled"></el-avatar>
                                </div>
                                <div class="avatar-badge" v-if="privateMessage.senderAvatarName != null && privateMessage.senderAvatarName != ''">
                                    <el-avatar :size="64" :src="privateMessage.senderAvatarPath+'100x100/'+privateMessage.senderAvatarName"></el-avatar>
                                </div>
                            </div>
                        </template>
                    </el-popover>
                    <div class="chat-container">
                        <span class="chat-item">
                            <div class="topInfo">
                                <span class="time">{{privateMessage.sendTime}}</span>
                                
                                <span class="tag-color-gray" v-if="privateMessage.status == 10">未读</span>
                                <span class="tag-color-green" v-if="privateMessage.status == 20">已读</span>
                                <span class="tag-color-pink" v-if="privateMessage.status == 110">未读删除</span>
                                <span class="tag-color-pink" v-if="privateMessage.status == 120">已读删除</span>
                                <el-link class="reduction" :disabled="!verifyPermissionMenu('/control/privateMessage/manage?method=reductionPrivateMessage&*','post')" href="javascript:void(0);" v-if="privateMessage.status >100" @click="reductionPrivateMessage(privateMessage)" title="还原用户已删除的私信">还原</el-link>
                            </div>
                            <i></i>
                            <em v-html="privateMessage.messageContent"></em>
                            <!-- <div class="msg-del" title="删除"></div> -->
                        </span>
                    </div>
                </div>
                <div class="self" v-if="privateMessage.friendUserId != privateMessage.senderUserId">
                    <el-popover effect="light" trigger="hover" placement="top">
                        <template #default>
                            <p v-if="privateMessage.senderNickname != null && privateMessage.senderNickname != ''">呢称: {{privateMessage.senderNickname}}</p>
                            <p>账号: {{privateMessage.senderAccount}}</p>
                        </template>
                        <template #reference>
                            <div class="avatar-wrapper" >
                                <div class="avatar-badge" v-if="privateMessage.senderAvatarName == null || privateMessage.senderAvatarName == ''">
                                    <el-avatar :size="64" :icon="UserFilled"></el-avatar>
                                </div>
                                <div class="avatar-badge" v-if="privateMessage.senderAvatarName != null && privateMessage.senderAvatarName != ''">
                                    <el-avatar :size="64" :src="privateMessage.senderAvatarPath+'100x100/'+privateMessage.senderAvatarName"></el-avatar>
                                </div>
                            </div>
                        </template>
                    </el-popover>
                    <div class="chat-container">
                        <span class="chat-item">
                            <div class="topInfo">
                                <el-link class="reduction" href="javascript:void(0);" :disabled="!verifyPermissionMenu('/control/privateMessage/manage?method=reductionPrivateMessage&*','post')" v-if="privateMessage.status >100" @click="reductionPrivateMessage(privateMessage)" title="还原用户已删除的私信">还原</el-link>
                                
                                <span class="tag-color-pink" v-if="privateMessage.status > 110">删除</span>
                                <span class="time">{{privateMessage.sendTime}}</span>
                            </div>
                            <i></i>
                            <em v-html="privateMessage.messageContent"></em>
                            <!-- 
                            <div class="msg-del" title="删除"></div> -->
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="data-table" >
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
    import { PrivateMessage, User } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        privateMessageChatList:[] as Array<PrivateMessage>,
		    
        friendUserId :'',
        id :'',
        userName :'',//用户名称
        chatUser :{} as User,//对话用户
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询私信对话列表
    const queryPrivateMessageChatList = () => {
        //清空内容
        state.privateMessageChatList = []; 


        proxy?.$axios({
            url: '/control/privateMessage/manage',
            method: 'get',
            params: {
                method : 'privateMessageChatList',
                id :state.id,
                friendUserId : state.friendUserId,
                page : (router.currentRoute.value.query.page == undefined || router.currentRoute.value.query.page == ''? '':state.currentpage),
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
			    			if(key == "chatUser"){
			    				state.chatUser = mapData[key];
			    				
			    			}else if(key == "pageView"){
			    				let pageView = mapData[key];
			    				let list = pageView.records;
					    		if(list != null && list.length >0){
					    			state.privateMessageChatList = list;
					 
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
            path: '/admin/control/privateMessage/manage/privateMessageChatList', 
            query:{ 
                friendUserId : state.friendUserId,
                privateMessagePage:router.currentRoute.value.query.privateMessagePage,
                id:state.id,
                userName :encodeURIComponent(state.userName),
                beforeUrl:(router.currentRoute.value.query.beforeUrl != undefined ? router.currentRoute.value.query.beforeUrl:''),
                page : page
            }
        });
    }

    //还原用户已删除的私信
    const  reductionPrivateMessage = (privateMessage:PrivateMessage) => {
        ElMessageBox.confirm('此操作将还原该私信, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('userId', privateMessage.userId);
	        formData.append('privateMessageId', privateMessage.id);


            proxy?.$axios({
                url: '/control/privateMessage/manage?method=reductionPrivateMessage&a=a',//a=a参数的作用是仅增加连接符&
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
				    		queryPrivateMessageChatList();
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

        if(router.currentRoute.value.query.friendUserId != undefined && router.currentRoute.value.query.friendUserId != ''){
			state.friendUserId = router.currentRoute.value.query.friendUserId as string;
			
		}
		if(router.currentRoute.value.query.id != undefined && router.currentRoute.value.query.id != ''){
			state.id = router.currentRoute.value.query.id as string;
			
		}
		if(router.currentRoute.value.query.userName != undefined && router.currentRoute.value.query.userName != ''){
			state.userName = decodeURIComponent(router.currentRoute.value.query.userName as string);
			
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		
		}

		queryPrivateMessageChatList();
    }) 
</script>
<style scoped lang="scss">

/** 私信对话 **/
.privateMessageChatModule{
	padding-bottom: 70px;
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
            color:#2192f8;
            padding:6px 0;
        }
    }
    .friend{
        margin: 26px 52px 0 10px;
        position: relative;
        &:after{
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }
        .avatar-wrapper{
            position: absolute;
            width: 64px;
            height: 64x;
            left: 0;
            top: 0;
            .avatar-text{
                overflow:hidden; 
                text-overflow:ellipsis; 
                white-space:nowrap; 
            }
        }
        .chat-container{
            position: relative;
            margin-left: 60px;
            margin-right: 10px;
            
            text-align: initial;
            i{
                position: absolute;
                width: 24px;
                height: 24px;
                left: -24px;
                top: 10px;
                &:after{
                    content: "";
                    position: absolute;
                    border-style: solid;
                    border-color:  transparent #fafafa transparent transparent;
                    border-width: 10px;
                    left:4px;
                }
            }
            .chat-item{
                float: left;
                min-height: 40px;
                min-width: 96px;
                margin-left: 24px;
                margin-top:22px;
                font-size: 15px;
                border: 1px #fff solid;
                background: #fafafa;
                border-radius: 10px;
                position: relative;
                max-width: 94%;
            }
        }
        .topInfo{
            position:absolute;
            width:280px;
            display: inline-block;
            color: #a5a5a5;
            font-size: 14px;
            top: -32px;
            left: 0px;
            .reduction{
                margin-right: 12px;
                position:relative;
                top:-2px;
            }
            .el-link--default.is-disabled{
                color: #dedfe0 !important;
            }
            .tag-color-gray{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #909399;
                background: #f4f4f5;
                border-color: #f4f4f5;
            }
            .tag-color-green{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #67C23A;
                background: #f0f9eb;
                border-color: #f0f9eb;
            }
            .tag-color-pink{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #fff;
                background: #ff6b81;
                border-color: #ff6b81;
            }
            .time{
                margin-right: 12px;
                line-height: 36px;
            }
        }
        .msg-del{
            background: #ececec;
            color: #919191;
            border-radius: 12px;
            line-height: 18px;
            text-align: center;
            height: 18px;
            width: 18px;
            font-size: 14px;
            padding: 1px;
            top: -8px;
            right: -8px;
            position: absolute;
            &::before {
                content: "\2716";
            }
            &:hover {
                color: #1e9fff;
            }
        }
    }
    .self{
        margin: 26px 10px 0 46px;
        position: relative;
        &:after{
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;

        }
        .avatar-wrapper{
            position: absolute;
            width: 64px;
            height: 64x;
            left: 0;
            top: 0;
            left: auto;
            right: 0;
            .avatar-text{
                overflow:hidden; 
                text-overflow:ellipsis; 
                white-space:nowrap; 
            }
        }
        .chat-container{
            position: relative;
            text-align: initial;
            margin-left: 20px;
            margin-right: 60px;
            i{
                position: absolute;
                width: 24px;
                height: 24px;
                top: 10px;
                left: auto;
                right: -20px;
                &:after{
                    content: "";
                    position: absolute;
                    border-style: solid;
                    border-color:  transparent transparent transparent #e5f3ff;
                    border-width: 10px;
                    left:4px;
                }
            }
            .chat-item{
                min-height: 40px;
                min-width: 96px;
                font-size: 15px;
                border: 1px #fff solid;
                border-radius: 10px;
                position: relative;
                max-width: 94%;
                background: #e5f3ff;
                border-color: #e5f3ff;
                color: #2196F3;
                float: right;
                margin-top:22px;
                margin-right: 24px;
                
            }
        }
        .topInfo{
            position:absolute;
            width:280px;
            display: inline-block;
            color: #a5a5a5;
            font-size: 14px;
            top: -33px;
            right: 0px;
            text-align: right;
            .reduction{
                margin-right: 12px;
                position:relative;
                top:-2px;
            }
            .el-link--default.is-disabled{
                color: #dedfe0 !important;
            }
            .tag-color-gray{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #909399;
                background: #f4f4f5;
                border-color: #f4f4f5;
            }
            .tag-color-green{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #67C23A;
                background: #f0f9eb;
                border-color: #f0f9eb;
            }
            .tag-color-pink{
                margin-right: 12px;
                position:relative;
                top:-1px;
                
                border-radius: 3px;
                display: inline-block;
                font-size: 12px;
                height: 18px;
                line-height: 18px;
                padding: 0 6px;
                text-align: center;
                white-space: nowrap;
                color: #fff;
                background: #ff6b81;
                border-color: #ff6b81;
            }
        }
        .msg-del{
            background: #d7edff;
            color: #66b1ff;
            border-radius: 12px;
            line-height: 18px;
            text-align: center;
            height: 18px;
            width: 18px;
            font-size: 14px;
            padding: 1px;
            top: -8px;
            left: -8px;
            position: absolute;
            &::before {
                content: "\2716";
            }
            &:hover {
                color: #1e9fff;
            }
        }
    }
    .friend .chat-container .chat-item em,
    .self .chat-container .chat-item em {
        font-style: normal;
        padding: 10px;
        display: block;
        white-space:normal; word-break:break-all;
    }
    .friend .chat-container .chat-item em a,
    .self .chat-container .chat-item em a{
        font-size: 15px;
    }
}





</style>