<!-- 合并帮助分类 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item @click="$router.push({path: '/admin/control/helpType/list'});">全部分类</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(value, key) in state.navigation" @click="$router.push({path: '/admin/control/helpType/list',query:{parentId:key}});">{{value}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/helpType/list',query:{parentId:($route.query.sourceParentId != undefined ? $route.query.sourceParentId:''),page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="主分类" >
                    {{state.helpType.name}}
                </el-form-item>
                <el-form-item label="选择分类合并到主分类" :required="true" :error="error.typeId">
                    <el-select ref="type_ref" v-model="state.typeIdGroup" size="large" @focus="loadType" @remove-tag="removeType" multiple placeholder="请选择">
                        <el-option v-for="item in state.typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <div class="form-help" >需要选择其它分类合并到主分类，不能选择主分类的父类或子类进行合并</div>
                </el-form-item>


                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            <el-dialog title="选择分类" v-model="state.type_form">
                <div class="dialog-nav-breadcrumb">
                    <el-breadcrumb :separator-icon="ArrowRight">
                        <el-breadcrumb-item @click="queryTypePage(1,'')">全部标签</el-breadcrumb-item>
                        <el-breadcrumb-item v-for="(value, key) in state.dialogNavigation" @click="queryTypePage(1,String(key))">{{value}}</el-breadcrumb-item>
                        
                    </el-breadcrumb>
                </div>
                <div class="dialog-data-table" >
                    <el-table ref="multipleTable" :data="state.tableData" @cell-click="cellExpandRow" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                        <el-table-column label="选择" align="right" width="50">
                            <template #default="scope">
                                <el-radio v-model="state.mergerTypeId" v-if="scope.row.childNodeNumber ==0" :label="state.typeIdList[scope.$index]" >&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="分类名称">
                            <template #default="scope">
                                <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                                <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-wrapper" v-if="state.isShowPage">
                        <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElTable } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { ArrowRight } from '@element-plus/icons-vue'
    import { HelpType } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const type_ref = ref();


    const state = reactive({
        id:'',
        name:'',
        parentId:'',
        mergerTypeId :'',//选中待合并分类Id
        typeIdGroup:[] as any,
        typeOptions:[] as any,
        tableData: [],//表格内容
        
        
        typeIdList: [] as Array<string>,//可选择Id集合
        dialogParentId:'',//分类选择父Id
        type_form:false,//是否显示分类选择表单
        dialogNavigation :'',
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        
        helpType :{} as HelpType,
        navigation :'',

        
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        typeId :'',
    });

    //查询分类
    const queryType = () => {
        //清空内容
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/helpType/manage',
            method: 'get',
            params: {
                method : 'merger',
			    typeId: state.id,
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
			    			if(key == "helpType"){
			    				state.helpType = mapData[key];
			    				state.name = state.helpType.name;
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

    //加载分类
    const loadType = () => {
	    	
        state.type_form = true;
        type_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        
        if(state.typeIdGroup.length ==0){
            state.mergerTypeId = "";
            state.typeOptions.length = 0;//清空	 		
        }
        
        
        //清空数据
        state.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.currentpage = 1;
        state.totalpage = 1;//服务器返回的long类型已转为String类型
        state.maxresult = 12;
        state.isShowPage = false;//显示分页栏
        
        queryTypePage(1,'');
    }

    //删除分类回调
    const removeType = (val:any) => {
        state.mergerTypeId = "";
        state.typeOptions.length = 0;//清空	 
        state.typeIdGroup.length =0;
        state.typeIdList.length =0;
    }
		
    //分类分页
    const page = (page:number) => {
        
        queryTypePage(page, state.dialogParentId);
    }


    //查询分类分页
    const queryTypePage = (page:number,parentId:string) => {
        state.tableData = [];
        state.typeIdList = [];
        state.dialogNavigation = '';
        
        state.dialogParentId = parentId;

        proxy?.$axios({
            url: '/control/helpType/manage',
            method: 'get',
            params: {
                method : 'helpTypePageSelect',
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
			    				let tagView = mapData[key];
					    		let tagList = tagView.records;
					    		if(tagList != null && tagList.length >0){
					    			for(let i = 0; i<tagList.length; i++){
					    				let tag = tagList[i];
					    				state.typeIdList.push(tag.id);
					    			
					    			}
					    		
					    			state.tableData = tagList;
					 
					    			state.totalrecord = parseInt(tagView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = tagView.currentpage;
									state.totalpage = parseInt(tagView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = tagView.maxresult;
									state.isShowPage = true;//显示分页栏
					    		}
			    			}else if(key == "navigation"){
			    				state.dialogNavigation = mapData[key];
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

  

    //点击单元格选择
    const cellExpandRow = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            if(row.childNodeNumber ==0){
                state.typeIdGroup.push(row.id);
                
                state.mergerTypeId  = row.id;
                
                let obj:any =new Object();
                obj.value = row.id;
                obj.label = row.name;
                state.typeOptions.length = 0;//清空
                state.typeOptions.push(obj);
                
                
                //因为只允许选中一个，所以将已选择的清空
                if (Object.keys(state.typeIdGroup).length >1) {
                    state.typeIdGroup.shift();//从Array 头部移除元素
                }
                
                state.type_form = false;
            }
        }else if(column.label=="分类名称"){
            if(row.childNodeNumber >0){
                state.dialogParentId = row.id;
                queryTypePage(1,row.id);
            }
        }
    }

     //提交表单
     const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.id != null){
            formData.append('typeId', state.id);
            
        }
        if(state.mergerTypeId != null && state.mergerTypeId != ''){
            formData.append('mergerTypeId', state.mergerTypeId);
            
        }

        proxy?.$axios({
            url: '/control/helpType/manage?method=merger',
            method: 'post',
            data: formData,
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
			    if(result){
                    let returnValue = JSON.parse(result);
			    	if(returnValue.code === 200){//成功
                        ElMessage({
                            showClose: true,
                            message: '提交成功',
                            type: 'success',
                            onClose: ()=>{
                                
                            }
                        })
			    		//删除缓存
                        store.setCacheNumber();
			    		router.push({
							path : '/admin/control/helpType/list',
							query:{
								parentId: state.parentId,
								page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')
							}
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
                state.submitForm_disabled = false;//提交按钮disabled状态
            }
        })
        .catch((error: any) =>{
            console.log(error);
            state.submitForm_disabled = false;//提交按钮disabled状态
        });
    }
    

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))


        if(router.currentRoute.value.query.typeId != undefined && router.currentRoute.value.query.typeId != ''){
			state.id = router.currentRoute.value.query.typeId as string;
		}
		if(router.currentRoute.value.query.parentId != undefined && router.currentRoute.value.query.parentId != ''){
			state.parentId = router.currentRoute.value.query.parentId as string;
		}
		
		queryType();
    }) 

</script>