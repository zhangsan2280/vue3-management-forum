<!-- 会员卡赠送项列表(获赠用户) -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: state.sourceUrlObject.path, query:state.sourceUrlObject.query})">返回</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column label="用户" align="center" min-width="120">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p>呢称: {{scope.row.nickname}}</p>
                                <p>账号: {{scope.row.account}}</p>
                            </template>
                            <template #reference >
                                <div class="avatar-wrapper" >
                                    <div class="avatar-badge" v-if="scope.row.avatarName == null || scope.row.avatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </div>
                                    <div class="avatar-badge" v-if="scope.row.avatarName != null && scope.row.avatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName"></el-avatar>
                                    </div>
                                    
                                    <div class="avatar-text">{{scope.row.account}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="任务类型" align="center" width="100">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.type == 10" class="tag-wrapper tag-color-orange">长期</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.type == 20" class="tag-wrapper tag-color-cyan">一次性</el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="限制条件" align="center">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.restrictionGroup.registrationTime_start != null || scope.row.restrictionGroup.registrationTime_end != null" class="tag-wrapper tag-color-purple">用户注册时间范围</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.restrictionGroup.totalPoint != null" class="tag-wrapper tag-color-yellow">积分达到数量</el-tag>
                    
                        <span v-if="scope.row.restrictionGroup.registrationTime_start == null && scope.row.restrictionGroup.registrationTime_end == null && scope.row.restrictionGroup.totalPoint == null">无限制</span>
                    
                    </template>
                </el-table-column>
                <el-table-column prop="postTime" label="赠送时间" align="center" width="170"></el-table-column>
                <el-table-column label="时长" align="center" >
                    <template #default="scope">
                        {{scope.row.duration}}
                        <span v-if="scope.row.unit ==10">小时</span>
                        <span v-if="scope.row.unit ==20">日</span>
                        <span v-if="scope.row.unit ==30">月</span>
                        <span v-if="scope.row.unit ==40">年</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="state.isShowPage">
                <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
export default {
    name: 'membershipCardGiftItemList',
    beforeRouteEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        //上级路由编码
        if(to.query.beforeUrl == undefined || to.query.beforeUrl==''){//前一个URL
			let parameterObj:any = new Object;
			parameterObj.path = from.path;
			let query = from.query;
			for(let q in query){
				query[q] = encodeURIComponent(query[q]  as string);
			}
			
			parameterObj.query = query;
			//将请求参数转为base62
			let wordArray = enc.Utf8.parse(JSON.stringify(parameterObj));
            let encrypt = enc.Base64url.stringify(wordArray);
			
			
			let newFullPath = updateURLParameter(to.fullPath,'beforeUrl',encrypt);
			
			to.fullPath = newFullPath;
			
			let paramGroup = to.query;
			paramGroup.beforeUrl = encrypt;
			to.query = paramGroup;
		}
        next()
    }
}
</script>

<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { NavigationGuardNext, RouteLocationNormalized, useRouter } from 'vue-router';
    import { ElTable } from 'element-plus';
    import { updateURLParameter } from '@/utils/tool';
    import { enc} from 'crypto-js';
    import { SourceUrl } from '@/types';
    import { UserFilled } from '@element-plus/icons-vue'
    
    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        membershipCardGiftTaskId:'',
        tableData: [],//表格内容
        multipleSelection: [],
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误

        sourceUrlObject:{} as SourceUrl,//来源URL对象
    });


    //查询会员卡赠送项列表(获赠用户)
    const queryMembershipCardOrderList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/membershipCardGiftTask/manage',
            method: 'get',
            params: {
                method :'membershipCardGiftItemList',
			   	membershipCardGiftTaskId :state.membershipCardGiftTaskId,
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
            path: '/admin/control/membershipCardGiftTask/manage/membershipCardGiftItemList', 
            query:{ 
                membershipCardGiftTaskId : state.membershipCardGiftTaskId,
                beforeUrl:(router.currentRoute.value.query.beforeUrl != undefined ? router.currentRoute.value.query.beforeUrl:''),
                page : page
            }
        });
    }

    

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.membershipCardGiftTaskId != undefined && router.currentRoute.value.query.membershipCardGiftTaskId != ''){
			state.membershipCardGiftTaskId = router.currentRoute.value.query.membershipCardGiftTaskId as string;
		}

		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}

		//上级路由解码
		if(router.currentRoute.value.query.beforeUrl != undefined && router.currentRoute.value.query.beforeUrl != ''){
            let parsedWordArray = enc.Base64url.parse(router.currentRoute.value.query.beforeUrl as string);
            let decrypt = parsedWordArray.toString(enc.Utf8);
			
			let decryptObject = JSON.parse(decrypt);
			
			let query = decryptObject.query;
			for(let q in query){
				query[q] = decodeURIComponent(query[q]);
			}
			state.sourceUrlObject = {
				path : decryptObject.path,
				query :query
			}
		}
		queryMembershipCardOrderList();

    }) 
</script>