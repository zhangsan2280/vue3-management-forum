<!-- 积分日志列表 -->
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
                        <i class="tag">积分日志</i>
                </div>
            </div>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="模块" align="center" width="180">
                    <template #default="scope">
                        <span v-if="scope.row.module == 100">发表话题</span>
                        <span v-if="scope.row.module == 200">发表评论</span>
                        <span v-if="scope.row.module == 300">发表回复</span>
                        <span v-if="scope.row.module == 400">积分解锁话题隐藏内容</span>
                        <span v-if="scope.row.module == 500">会员卡订单支付</span>
                        <span v-if="scope.row.module == 600">充值</span>
                        <span v-if="scope.row.module == 700">提交问题</span>
                        <span v-if="scope.row.module == 800">提交答案</span>
                        <span v-if="scope.row.module == 900">提交答案回复</span>
                        <span v-if="scope.row.module == 1000">悬赏积分</span>
                        <span v-if="scope.row.module == 1100">采纳答案</span>
                        <span v-if="scope.row.module == 1200">调整赏金</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作用户账号" align="center" >
                    <template #default="scope">
                        {{scope.row.operationAccount}}
                        <el-tag effect="dark"  v-if="scope.row.operationUserType==0" class="tag-wrapper">系统</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.operationUserType==1" type="success" class="tag-wrapper" >员工</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.operationUserType==2" type="info" class="tag-wrapper" >会员</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="积分" align="center" width="100">
                    <template #default="scope">
                        <span v-if="scope.row.pointState == 1">+</span>
                        <span v-if="scope.row.pointState == 2">-</span>
                        {{scope.row.point}}
                    </template>
                </el-table-column>
                <el-table-column prop="times" label="时间" align="center" width="170"></el-table-column>
                <el-table-column label="操作" align="center" width="100">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/pointLog/manage?method=show&*','get')" @click="$router.push({path: '/admin/control/pointLog/manage/show', query:{ pointLogId : scope.row.id, pointLogPage:state.currentpage, id : $route.query.id,userName : encodeURIComponent(state.userName),beforeUrl:($route.query.beforeUrl != undefined ? $route.query.beforeUrl:'')}})">查看</el-button>
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
    import { ElTable } from 'element-plus';
    import { UserFilled } from '@element-plus/icons-vue'
    import { User } from '@/types';
    import { verifyPermissionMenu } from '@/utils/tool';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        currentUser :{} as User,//当前用户
        
        id :'',
        userName :'',//用户名称
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });


    //查询积分日志列表
    const queryPointLogList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/pointLog/list',
            method: 'get',
            params: {
                id :state.id,
				userName :state.userName,
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
            path: '/admin/control/pointLog/list', 
            query:{ 
                id:state.id,
                userName :encodeURIComponent(state.userName),
                beforeUrl:(router.currentRoute.value.query.beforeUrl != undefined ? router.currentRoute.value.query.beforeUrl:''),
                page : page
            }
        });
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


		queryPointLogList();

    }) 
</script>