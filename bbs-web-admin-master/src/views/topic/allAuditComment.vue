<!-- 全部待审核评论 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/comment/manage?method=deleteComment*','post')" @click="deleteComment($event,undefined)">批量删除</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" stripe empty-text="没有内容">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column prop="topicTitle" label="话题标题" width="170">
                    <template #default="scope">
                        {{scope.row.topicTitle}}
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
                <el-table-column label="状态" align="center" width="110">
                    <template #default="scope">
                        <el-tag effect="dark"  v-if="scope.row.status==10" class="tag-wrapper">待审核</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==20" type="success" class="tag-wrapper" >已发布</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==110" type="info" class="tag-wrapper" >待审核用户删除</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==120" type="warning" class="tag-wrapper" >已发布用户删除</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==100010" type="info" class="tag-wrapper" >待审核员工删除</el-tag>
                        <el-tag effect="dark"  v-if="scope.row.status==100020" type="warning" class="tag-wrapper" >已发布员工删除</el-tag>
                    </template>
                    
                    
                
                </el-table-column>
                <el-table-column label="会员/员工" align="center" width="120">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <p v-if="scope.row.avatarName == null || scope.row.avatarName == ''">呢称: {{scope.row.nickname}}</p>
                                <p>账号: {{scope.row.account}}</p>
                            </template>
                            <template #reference v-if="scope.row.isStaff == false">
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
                            
                            <template #reference v-if="scope.row.isStaff == true">
                                <div class="avatar-wrapper">
                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="scope.row.avatarName == null || scope.row.avatarName == ''">
                                        <el-avatar :size="48" :icon="UserFilled"></el-avatar>
                                    </el-badge>
                                    <el-badge value="员工" type="warning" class="avatar-badge" v-if="scope.row.avatarName != null && scope.row.avatarName != ''">
                                        <el-avatar :size="48" :src="scope.row.avatarPath+'100x100/'+scope.row.avatarName"></el-avatar>
                                    </el-badge>
                                    <div class="avatar-text">{{scope.row.account}}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="postTime" label="评论时间" align="center" width="160"></el-table-column>
                <el-table-column label="操作" align="center" width="150">
                    <template #default="scope">
                        <div class="button-group-wrapper">
                            <el-button-group>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/topic/manage?method=view*','get')" @click="store.setCacheNumber();$router.push({path: '/admin/control/topic/manage/view', query:{ topicId : scope.row.topicId,commentId:scope.row.id}})">查看</el-button>
                                <el-button type="primary" v-if="verifyPermissionMenu('/control/comment/manage?method=deleteComment*','post')" @click="deleteComment($event,scope.row)">删除</el-button>
                            </el-button-group>
                        </div>
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
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { UserFilled } from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        multipleSelection: [],
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    //查询评论列表
    const queryCommentList = () => {
        //清空内容
        state.tableData = []; 


        proxy?.$axios({
            url: '/control/topic/allAuditComment',
            method: 'get',
            params: {
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
			    		let commentList = pageView.records;
			    		if(commentList != null && commentList.length >0){
			    			state.tableData = commentList;
			 
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
            path: '/admin/control/topic/allAuditComment', 
            query:{ page : page}
        });
    }

    //处理多选
    const handleSelectionChange = (val:any) => {
        state.multipleSelection = val;
    }
    //删除评论
    const deleteComment = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        if (row) {//选中行
            multipleTable.value!.toggleRowSelection(row,true);
        }
        
        if(state.multipleSelection.length <1){
            ElMessage({
                //duration :0,
                showClose: true,
                message: '至少要选择一行数据',
                type: 'error',
            })
            return;
        }


        ElMessageBox.confirm('此操作将删除该评论, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    	
            for(let i=0; i<state.multipleSelection.length; i++){
                let rowData:any = state.multipleSelection[i];
                formData.append('commentId', rowData.id);
            }

        

            proxy?.$axios({
                url: '/control/comment/manage?method=deleteComment',
                method: 'post',
                data: formData
            })
            .then((response: AxiosResponse) => {
                if(response){

                    const result: any = response.data;
                
                    if(result){
				    	
				    	let returnValue = JSON.parse(result);
				    	if(returnValue.code === 200){//成功
				    		//删除缓存
                            store.setCacheNumber();
                            ElMessage({
                                showClose: true,
                                message: '删除成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryCommentList();
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
            //取消选中行
	        multipleTable.value!.toggleRowSelection(row,false);
        })
    }

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

          
        state.currentpage = (router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != '') ? parseInt(router.currentRoute.value.query.page as string) :1;
        
        queryCommentList();
    }) 

</script>