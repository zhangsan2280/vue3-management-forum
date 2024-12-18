<template>
    <div class="homeModule">
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_1"><Icon name="topic" size="37px" class="icon color_1"/></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditTopicCount}}</div>
                    <div class="text">待审核话题总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_2"><Icon name="comment" size="37px" class="icon color_2"/></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditCommentCount}}</div>
                    <div class="text">待审核评论总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_3"><Icon name="reply" size="37px" class="icon color_3"/></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditCommentReplyCount}}</div>
                    <div class="text">待审核评论回复总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_4"><Icon name="help-alt" size="40px" class="icon color_4"/></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditQuestionCount}}</div>
                    <div class="text">待审核问题总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_5"><Icon name="info-alt" size="40px" class="icon color_5"/></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditAnswerCount}}</div>
                    <div class="text">待审核答案总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_6"><el-icon class="icon color_6"><ChatDotRound /></el-icon></div></div>
                <div class="info-container">
                    <div class="digital">{{state.auditAnswerReplyCount}}</div>
                    <div class="text">待审核答案回复总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_7"><el-icon class="icon color_7"><ChatRound /></el-icon></div></div>
                <div class="info-container">
                    <div class="digital">{{state.feedbackCount}}</div>
                    <div class="text">留言总数</div>
                </div>
            </div>
        </div>
        <div class="item">
            <div class="box">
                <div class="icon-container"><div class="round round_bg_8"><el-icon class="icon color_8"><Warning /></el-icon></div></div>
                <div class="info-container">
                    <div class="digital">{{state.reportCount}}</div>
                    <div class="text">待处理举报总数</div>
                </div>
            </div>
        </div>
    </div> 
    <div class="main">
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="ip" label="我的登录IP" align="center" min-width="200"></el-table-column>
                <el-table-column prop="ipAddress" label="IP归属地" align="center" ></el-table-column>
                <el-table-column prop="logonTime" label="登录时间" align="center" ></el-table-column>
            </el-table>
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
    
    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    
    const state = reactive({
        tableData: [],//表格内容
        auditTopicCount: 0,//待审核话题数量
        auditCommentCount: 0,//待审核评论数量
        auditCommentReplyCount: 0,//待审核评论回复数量	
        auditQuestionCount: 0,//待审核问题数量
        auditAnswerCount: 0,//待审核答案数量
        auditAnswerReplyCount: 0,//待审核答案回复数量	
        feedbackCount: 0,//留言数量
        reportCount: 0,//待处理举报数量
    });

    //查询首页
    const queryHome = () => {
        proxy?.$axios({
            url: '/control/manage/home',
            method: 'get',
            params:  { 
               
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
			    			if(key == "staffLoginLogList"){//最新登录日志
			    				state.tableData = mapData[key];	
			    			}else if(key == "auditTopicCount"){//待审核话题数量
			    				state.auditTopicCount = mapData[key];
			    			}else if(key == "auditCommentCount"){//待审核评论数量
			    				state.auditCommentCount = mapData[key];
			    			}else if(key == "auditCommentReplyCount"){//待审核评论回复数量
			    				state.auditCommentReplyCount = mapData[key];
			    			}else if(key == "auditQuestionCount"){//待审核问题数量
			    				state.auditQuestionCount = mapData[key];
			    			}else if(key == "auditAnswerCount"){//待审核答案数量
			    				state.auditAnswerCount = mapData[key];
			    			}else if(key == "auditAnswerReplyCount"){//待审核答案回复数量
			    				state.auditAnswerReplyCount = mapData[key];
			    			}else if(key == "feedbackCount"){//留言数量
			    				state.feedbackCount = mapData[key];
			    			}else if(key == "reportCount"){//待处理举报数量
			    				state.reportCount = mapData[key];
			    			}
			    			
			    			
			    		}
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

        queryHome();
    }) 
</script>
<style scoped lang="scss">
.homeModule{
	display: flex;
	flex-flow: row wrap;
	margin-left: -7px;
	margin-right: -7px;
    .item{
        flex: 0 0 25%;
        margin-bottom: 15px;
        .box{
            background: #fff;
            margin-left: 7px;
            margin-right: 7px;
            border-radius : 3px;
            height: 120px;
            display:flex;
            align-items:center;
            .icon-container{
                margin-left: 26px;	
                .icon{
                    font-size: 40px;
                    color: #fff;
                }
                .round{
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display:flex;
                    align-items:center;
                    justify-content: center; 
                }
                .round_bg_1{
                    background: #90e873;
                }
                .color_1{
                    position: relative;
                    top: 3px;
                }
                .round_bg_2{
                    background: #fe9d2d;
                }
                .color_2{
                    font-size: 35px;
                    position: relative;
                    top: 2px;
                }
                .round_bg_3{
                    background: #48dbfb;
                }
                .color_3{
                    font-size: 37px;
                    position: relative;
                    top: 2px;
                }
                .round_bg_4{
                    background: #21de70;
                }
                .round_bg_5{
                    background: #65c5f1;
                }
                .round_bg_6{
                    background: #eccc68;
                }
                .color_6{
                    font-size: 44px;
                }
                .round_bg_7{
                    background: #ff7f50;
                }
                .color_7{
                    font-size: 44px;
                }
                .round_bg_8{
                    background: #ff6b81;
                }
            }
            .info-container{
                flex-grow: 1;
                text-align: right;
                margin-right: 26px;
                width: 105px;
                .digital{
                    color: #606266;
                    font-size: 20px;
                    font-weight:bold;
                }
                .text{
                    margin-top: 15px;
                    font-size: 14px;
                    color: #909399;
                }
            }
        }
    }
}
</style>