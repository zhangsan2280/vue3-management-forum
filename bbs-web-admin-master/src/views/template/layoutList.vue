<!-- 布局列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>布局列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/layout/manage?method=add*','get')" @click="$router.push({path: '/admin/control/layout/manage/add',query:{ dirName : $route.query.dirName}});">添加布局</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="布局名称" align="center" ></el-table-column>
                <el-table-column prop="layoutFile" label="布局文件" align="center" ></el-table-column>
                <el-table-column label="最后修改时间" align="center" width="220">
                    <template #default="scope">
                        <div v-if="scope.row.layoutFile != null && scope.row.layoutFile != ''">
                            <div v-if="state.pc_lastModified.get(scope.row.layoutFile)">电脑版：{{state.pc_lastModified.get(scope.row.layoutFile)}}</div>
                            <div v-if="state.wap_lastModified.get(scope.row.layoutFile)">移动版：{{state.wap_lastModified.get(scope.row.layoutFile)}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" width="200">
                    <template #default="scope">
                        <el-tag effect="dark" v-if="scope.row.type==1" type="info" class="tag-wrapper">默认页</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==3" class="tag-wrapper tag-color-pink" >更多</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==4" class="tag-wrapper tag-color-blue" >空白页</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==5" class="tag-wrapper tag-color-cyan" >公共页(生成新引用页)</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==6" class="tag-wrapper tag-color-lightBlue" >公共页(引用版块值)</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==7" class="tag-wrapper tag-color-yellow" >站点栏目详细页</el-tag>
                        
                        <el-tag effect="dark" v-if="scope.row.type==4 && scope.row.returnData == 0" class="tag-wrapper tag-color-orange" style="margin-left: 4px;">html</el-tag>
                        <el-tag effect="dark" v-if="scope.row.type==4 && scope.row.returnData == 1" class="tag-wrapper tag-color-purple" style="margin-left: 4px;">json</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="访问需要登录" align="center" width="110">
                    <template #default="scope">
                        <el-tag effect="dark" type="success" v-if="scope.row.type != 5 && scope.row.type != 6 && scope.row.accessRequireLogin==true" class="tag-wrapper" >需要</el-tag>
                        <el-tag effect="dark" type="success" v-if="scope.row.type != 5 && scope.row.type != 6 && state.accessRequireLoginLayoutList.get(scope.row.id)" class="tag-wrapper" >默认需要</el-tag>
                        
                        
                        
                    </template>
                </el-table-column>
                <el-table-column label="引用代码/URL" align="center" width="140">
                    <template #header>
                        <el-popover effect="light" trigger="hover" placement="top" width="400">
                            <template #default>
                                <el-switch v-model="state.button" inactive-text="按钮" active-text="本列单元格显示复制按钮"></el-switch><div><br></div>
                                <el-switch v-model="state.text" inactive-text="文本" active-text="本列单元格显示'引用代码'或'URL'的文本内容"></el-switch>
                            </template>
                            <template #reference>
                                <div class="header-arrow">引用代码/URL<el-icon class="header-arrow-icon"><ArrowDown /></el-icon></div>
                            </template>
                        </el-popover>
                        
                    </template>
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top" :disabled="state.text== true">
                            <template #default>
                                <span v-if="state.referenceCodeList.get(scope.row.id)">{{state.referenceCodeList.get(scope.row.id)}}</span>
                            </template>
                            <template #reference>
                                <div>
                                    <div v-if="state.button == true">
                                        <!-- 1.默认页 4.空白页 -->
                                        <span class="button-blue" v-if="scope.row.type == 1 || scope.row.type == 4" @click="copyText($event,scope.row)">复制URL</span>
                                        <!-- 5.公共页(生成新引用页)  6.公共页(引用版块值)  -->
                                        <span class="button-blue" v-if="scope.row.type == 5 || scope.row.type == 6" @click="copyText($event,scope.row)">复制代码</span>
                                    
                                    </div>
                                    <div v-if="state.text == true">
                                        {{state.referenceCodeList.get(scope.row.id)}}
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                
                
                
                
                
                <el-table-column label="操作" align="center" width="330">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/forum/list*','get')" @click="$router.push({path: '/admin/control/forum/list', query:{ layoutId : scope.row.id,dirName : $route.query.dirName,sourcePage:($route.query.page != undefined ? $route.query.page:'')}})">版块</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/layout/manage?method=editLayoutCode&*','get')" v-if="scope.row.type !=6 && scope.row.returnData != 1" @click="$router.push({path: '/admin/control/layout/manage/editLayoutCode', query:{ layoutId : scope.row.id,dirName : $route.query.dirName,page : ($route.query.page != undefined ? $route.query.page:'')}})">布局代码编辑</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/layout/manage?method=editLayout&*','get')" @click="$router.push({path: '/admin/control/layout/manage/editLayout', query:{ layoutId : scope.row.id,dirName : $route.query.dirName,page : ($route.query.page != undefined ? $route.query.page:'')}})">修改</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/layout/manage?method=deleteLayout&*','post')" @click="deleteLayout($event,scope.row)">删除</el-button>
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
    import { Templates } from '@/types';


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const state = reactive({
        tableData: [],//表格内容
			
        dirName :'',
        pc_lastModified :new Map(),//电脑版式最后修改时间
        wap_lastModified :new Map(),//移动版式最后修改时间
        templates :{} as Templates,

        text :false,//文本
        button :true,//按钮
        
        referenceCodeList:new Map(),//引用代码集合
        
        accessRequireLoginLayoutList:new Map(),//默认访问需要登录布局集合
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
    });

    //查询布局列表
    const queryLayoutList = () => {
        //清空内容
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/layout/list',
            method: 'get',
            params: {
                dirName :state.dirName,
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
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "pageView"){
			    				let pageView = mapData[key];
					    		let list = pageView.records;
					    		if(list != null && list.length >0){
					    			state.tableData = list;
					 				
					    			for(let i=0; i<list.length; i++){
					    				let layout = list[i];
					    				
					    				if(layout.type == 1 || layout.type == 4){
					    					let referenceCode = layout.referenceCode;
					    					
					    					state.referenceCodeList.set(layout.id,store.apiUrl+referenceCode);
					    					
					    					if(referenceCode.toLowerCase().startsWith("user/")){
												state.accessRequireLoginLayoutList.set(layout.id,true);
											}
					    				}
										if(layout.type == 5 || layout.type ==6){
										//	let referenceCode = "&lt;@include action=&quot;&#36;&#123;"+layout.referenceCode+"&#125;&quot;/&gt;";
											let referenceCode = '<@include action="${'+layout.referenceCode+'}"/>';
					    		
											state.referenceCodeList.set(layout.id,referenceCode);
					    				}
					    				
					    				
					    				
					    				
					    			}
					    			
					    			
					    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = pageView.currentpage;
									state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = pageView.maxresult;
									state.isShowPage = true;//显示分页栏
									
					    		}
			    			}else if(key == "pc_lastModified"){
			    				let pc_lastModified = mapData[key];
			    				for(let pc_key in pc_lastModified){
			    					state.pc_lastModified.set(pc_key,pc_lastModified[pc_key]);
			    				}
			    			}else if(key == "wap_lastModified"){
			    				let wap_lastModified = mapData[key];
			    				for(let wap_key in wap_lastModified){
			    					state.wap_lastModified.set(wap_key,wap_lastModified[wap_key]);
			    				}
			    			}else if(key == "templates"){
			    				state.templates = mapData[key];
			    				
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
            path: '/admin/control/layout/list', 
            query:{ 
                dirName : state.dirName,
                page : page
            }
        });
    }

    //复制文本
    const copyText = (event:any,row:any) => {
        let value = state.referenceCodeList.get(row.id);
        if(value){
            var tempInput:any = document.createElement("input");
            tempInput.style = "position: absolute; left: -1000px; top: -1000px";
            tempInput.value = value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            ElMessage({
                showClose: true,
                message: "复制 "+value+" 到剪贴板成功",
                type: 'success',
                onClose: ()=>{
                    
                }
            })
        }
    }

    //删除布局
    const deleteLayout = (event:any,row:any) => {
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
		    formData.append('layoutId', row.id);
		    formData.append('dirName', state.dirName);

            proxy?.$axios({
                url: '/control/layout/manage?method=deleteLayout&a=a',//a=a参数的作用是仅增加连接符&
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
				    		queryLayoutList();
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

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}
		
		//初始化
		queryLayoutList();
    }) 

</script>