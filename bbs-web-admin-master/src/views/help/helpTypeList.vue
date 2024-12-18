<!-- 帮助分类列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item @click="$router.push({path: '/admin/control/helpType/list'});">全部分类</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(value, key) in state.navigation" @click="$router.push({path: '/admin/control/helpType/list',query:{parentId:key}});">{{value}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/helpType/manage?method=add*','get')" @click="$router.push({path: '/admin/control/helpType/manage/add',query:{sourceParentId:($route.query.parentId != undefined ? $route.query.parentId:''),parentId : state.parentId, page:($route.query.page != undefined ? $route.query.page:'')}});">添加分类</el-button>
        </div>
        <div class="data-table" >
            <el-table :data="state.tableData" tooltip-effect="dark" style="width: 100%" @cell-click="cellExpandRow"  stripe empty-text="没有内容">
                <el-table-column label="分类名称">
                    <template #default="scope">
                        <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                        <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                    </template>

                </el-table-column>
                <el-table-column label="图片" align="center" width="200">
                    <template #default="scope">
                        <el-image v-if="scope.row.image != null && scope.row.image != ''" preview-teleported style="width: 120px; height: 120px" fit="contain" :src="scope.row.image+'?time='+new Date().getTime()" :preview-src-list="[scope.row.image+'?time='+new Date().getTime()]" hide-on-click-modal ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="分类帮助数量" align="center" width="120">
                    <template #default="scope">
                        <span v-if="scope.row.childNodeNumber ==0">{{scope.row.totalHelp}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="childNodeNumber" label="下级子类数量" align="center" width="120"></el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="100"></el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/helpType/manage?method=add*','get')" @click="$router.push({path: '/admin/control/helpType/manage/add',query:{sourceParentId:($route.query.parentId != undefined ? $route.query.parentId:''), parentId: scope.row.id,page:($route.query.page != undefined ? $route.query.page:'')}});">添加子类</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/helpType/manage?method=merger*','get')" v-if="scope.row.childNodeNumber == 0" @click="$router.push({path: '/admin/control/helpType/manage/merger',query:{ sourceParentId:($route.query.parentId != undefined ? $route.query.parentId:''),typeId: scope.row.id,parentId: scope.row.parentId,page:($route.query.page != undefined ? $route.query.page:'')}});">合并</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/helpType/manage?method=edit*','get')" @click="$router.push({path: '/admin/control/helpType/manage/edit',query:{ sourceParentId:($route.query.parentId != undefined ? $route.query.parentId:''),typeId: scope.row.id,parentId: scope.row.parentId,page:($route.query.page != undefined ? $route.query.page:'')}});">修改</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/helpType/manage?method=delete*','post')" @click="deleteType($event,scope.row)">删除</el-button>
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
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { ArrowRight } from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
        navigation : '',//导航
        
        parentId : '',//父Id
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    //点击单元格选择
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="分类名称"){
            if(row.childNodeNumber >0){
                //删除缓存
                store.setCacheNumber();
                router.push({
                    path: '/admin/control/helpType/list', 
                    query:{ parentId : row.id,page : 1}
                });
            }
        }
    }

    //查询分类列表
    const queryTypeList = (parentId:string,page:number) => {
        //清空内容
        state.tableData = []; 
        state.navigation = '';
			
		state.parentId = parentId;

        proxy?.$axios({
            url: '/control/helpType/list',
            method: 'get',
            params: {
                parentId : parentId,
			    page : page
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
			    			if(key == "pageView"){
			    				let typeView = mapData[key];
					    		let typeList = typeView.records;
					    		if(typeList != null && typeList.length >0){
					    			state.tableData = typeList;
					 
					    			state.totalrecord = parseInt(typeView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = typeView.currentpage;
									state.totalpage = parseInt(typeView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = typeView.maxresult;
									state.isShowPage = true;//显示分页栏
					    		}
			    			}else if(key == "navigation"){
			    				state.navigation = mapData[key];
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
    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/helpType/list', 
            query:{ parentId : state.parentId,page : page}
        });
    }
  
    //删除分类
    const deleteType = (event:any,row:any) => {
        //强制失去焦点
        let target = event.target;
        // 根据button组件内容 里面包括一个span标签，如果设置icon，则还包括一个i标签，其他情况请自行观察。
        // 所以，在我们点击到button组件上的文字也就是span标签上时，直接执行e.target.blur()不会生效，所以要加一层判断。
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = event.target.parentNode;
        }
        target.blur();


        ElMessageBox.confirm('此操作将删除该项, 是否继续?',{
            // type: 'warning',
            cancelButtonText: "取消",
            confirmButtonText: '确定'
        })
        .then(() => {

            let formData = new FormData();
		    formData.append('typeId', row.id);
        

            proxy?.$axios({
                url: '/control/helpType/manage?method=delete',
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
                                message: '删除成功',
                                type: 'success',
                                onClose: ()=>{
                                    
                                }
                            })
				    		queryTypeList(state.parentId,state.currentpage);
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

        if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage =  parseInt(router.currentRoute.value.query.page as string);
		}
		if(router.currentRoute.value.query.parentId != undefined && router.currentRoute.value.query.parentId != ''){
			state.parentId = router.currentRoute.value.query.parentId as string;
		}

		//初始化
		queryTypeList(state.parentId,state.currentpage);
    }) 

</script>