<!-- 版块列表 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/control/layout/list', query:{ dirName : $route.query.dirName,page: ($route.query.sourcePage != undefined ? $route.query.sourcePage:'')}}">布局列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>版块列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="navbar">
            <el-button type="primary" plain v-if="verifyPermissionMenu('/control/forum/manage?method=add*','get')" :disabled="state.publicForum ==true" @click="$router.push({path: '/admin/control/forum/manage/add',query:{layoutId:$route.query.layoutId, dirName : $route.query.dirName,sourcePage:($route.query.sourcePage != undefined ? $route.query.sourcePage:''),page:($route.query.page != undefined ? $route.query.page:'')}});">添加版块</el-button>
        </div>
        <div class="data-table" >
            <el-table ref="multipleTable" :data="state.tableData" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                <el-table-column prop="name" label="版块名称" align="center" ></el-table-column>
                <el-table-column prop="module" label="选择模块" align="center" ></el-table-column>
                <el-table-column label="调用方式" align="center" width="120">
                    <template #default="scope">
                        <span v-if="scope.row.invokeMethod == 1">引用代码</span>
                        <span v-if="scope.row.invokeMethod == 2">调用对象</span>
                    </template>
                </el-table-column>
                <el-table-column label="调用代码" align="center" width="120">
                    <template #default="scope">
                        <el-popover effect="light" trigger="hover" placement="top">
                            <template #default>
                                <span v-if="state.referenceCodeList.get(scope.row.id)">{{state.referenceCodeList.get(scope.row.id)}}</span>
                            </template>
                            <template #reference>
                                <div>
                                    <!-- 引用代码 -->
                                    <span class="button-blue" v-if="state.layout.returnData == 0 && state.layout.type != 6 && scope.row.invokeMethod == 1" @click="copyText($event,scope.row)">复制</span>
                                    <!-- 调用对象  -->
                                    <span class="button-blue" v-if="scope.row.invokeMethod == 2" @click="copyText($event,scope.row)">复制</span>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="250">
                    <template #default="scope">
                        <el-button-group>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=source&*','get')" v-if="state.layout.returnData == 0" @click="editForumSourceUI($event,scope.row)">源码编辑</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/forumCode/manage?method=source&*','get')" v-if="state.layout.returnData == 1" @click="editForumSourceUI($event,scope.row)">示例程序</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/forum/manage?method=edit&*','get')" @click="$router.push({path: '/admin/control/forum/manage/edit', query:{ layoutId : $route.query.layoutId,forumId : scope.row.id,dirName : $route.query.dirName,sourcePage:($route.query.sourcePage != undefined ? $route.query.sourcePage:''),page:($route.query.page != undefined ? $route.query.page:'')}})">修改</el-button>
                            <el-button type="primary" :disabled="!verifyPermissionMenu('/control/forum/manage?method=delete&*','post')" @click="deleteForum($event,scope.row)">删除</el-button>
                        </el-button-group>	
                    </template>
                
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper" v-if="state.isShowPage" >
                <el-pagination background  @current-change="page" :current-page="state.currentpage"  :page-size="state.maxresult" layout="total, prev, pager, next,jumper" :total="state.totalrecord"></el-pagination>
            </div>
        </div>
        <el-dialog title="源码编辑" v-model="state.editForumSourceForm" :before-close="handleEditForumSourceFormClose" width="100%" :fullscreen="true" :close-on-click-modal="false" :close-on-press-escape="false" :destroy-on-close="true">
            <div class="editForumSourceModule">
                <div class="forumSource-container">
                    <el-row >
                        <el-col :span="24"><div class="nodeName">{{state.nodeName}}.html</div></el-col>
                    </el-row>
                    
                    
                    <el-tabs v-model="state.activeName" @tab-click="handleEditForumSourceFormClick">
                        <el-tab-pane label="电脑版" name="pc">
                            <div class="code" >
                                <textarea ref="pc_code_ref" v-if="state.isPCHtmlExist">{{state.pc_html}}</textarea>
                                <div class="notExistPrompt" v-if="!state.isPCHtmlExist">电脑版 {{state.nodeName}}.html 文件不存在</div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="移动版" name="wap">
                            <div class="code">
                                <textarea ref="wap_code_ref" v-if="state.isWapHtmlExist">{{state.wap_html}}</textarea>
                                <div class="notExistPrompt" v-if="!state.isWapHtmlExist">移动版 {{state.nodeName}}.html 文件不存在</div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                    
                    
                    <el-row>
                        <el-col :span="24">
                                <el-button class="submitButton" size="large" type="primary" @click="editForumCode_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-row >
                    <el-col :span="24">
                        <div class="doc">
                            <el-tabs v-model="state.activeDoc" type="card"  @tab-click="handleDocClick">
                                <el-tab-pane label="文档参数" name="example">
                                    <div ref="example_doc_ref" v-html="state.example"></div>
                                </el-tab-pane>
                                <el-tab-pane label="公共API" name="common">
                                    <div ref="common_doc_ref" v-html="state.common"></div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, markRaw, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
    import { processErrorInfo,verifyPermissionMenu } from '@/utils/tool';
    import { ArrowRight } from '@element-plus/icons-vue'
    import { Layout, Templates } from '@/types';
    import CodeMirror from "codemirror";
    import "codemirror/lib/codemirror.css";
    import "codemirror/mode/xml/xml";
    import "codemirror/mode/javascript/javascript";
    import "codemirror/mode/css/css";
    import "codemirror/mode/htmlmixed/htmlmixed";
    import "codemirror/mode/vue/vue";

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const multipleTable = ref<InstanceType<typeof ElTable>>()

    const example_doc_ref = ref()
    const common_doc_ref = ref()
    const pc_code_ref = ref()
    const wap_code_ref = ref()

    const state = reactive({
        tableData: [],//表格内容
			
        layoutId :'',
        dirName :'',
        layout  :{} as Layout,
        templates :{} as Templates,
        publicForum:false,//公共版块 true:已有一个以上版块   false:还未有版块

        referenceCodeList:new Map(),//引用代码集合
        
        totalrecord : 0, //总记录数
        currentpage : 1, //当前页码
        totalpage : 1, //总页数
        maxresult: 12, //每页显示记录数
        isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误

        id :'',
        nodeName: '',
        activeName : 'pc',//源码表单标签选择
        activeDoc : 'example',//文档选择common
        example: '',
        common: '',
        pc_html: '',
        wap_html: '',
        editor_pc:'' as any,
        editor_wap:'' as any,
        isPCHtmlExist:false,//是否存在电脑版html文件
        isWapHtmlExist:false,//是否存在手机版html文件
        example_editor:[] as any,
        common_editor:[] as any,
        editForumSourceForm:false,//是否显示源码编辑表单
        
        submitForm_disabled:false,//提交按钮是否禁用
    });

    //查询版块列表
    const queryForumList = () => {
        //清空内容
        state.tableData = []; 

        proxy?.$axios({
            url: '/control/forum/list',
            method: 'get',
            params: {
                layoutId:state.layoutId,
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
					    				let forum = list[i];
					    				
					    				
										if(state.layout.returnData == 0 && state.layout.type != 6 && forum.invokeMethod == 1){
										//	let referenceCode = "&lt;@include action=&quot;&#36;&#123;"+layout.referenceCode+"&#125;&quot;/&gt;";
											let referenceCode = '<@include action="${'+ forum.referenceCode +'}"/>';
					
											state.referenceCodeList.set(forum.id,referenceCode);
					    				}
										if(forum.invokeMethod == 2){
					    					let pos=forum.module.lastIndexOf("_");
	   										let moduleCode = forum.module.substr(0,pos);
					    					let referenceCode = '<@object action="${'+forum.referenceCode+'}"><#assign value = '+moduleCode+'></@object>';
					    					state.referenceCodeList.set(forum.id,referenceCode);
					    				}
					    			}

					    			
					    			state.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.currentpage = pageView.currentpage;
									state.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
									state.maxresult = pageView.maxresult;
									state.isShowPage = true;//显示分页栏
									
					    		}
			    			}else if(key == "publicForum"){
			    				state.publicForum = mapData[key];
			    			}else if(key == "layout"){
			    				state.layout = mapData[key];
			    			}else if(key == "templates"){
			    				state.templates = mapData[key];
			    				
			    			}
			    		}
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
    }

    //分页
    const page = (page:number) => {
        //删除缓存
        store.setCacheNumber();
        router.push({
            path: '/admin/control/forum/list', 
            query:{ 
                layoutId:state.layoutId,
                dirName :state.dirName,
                sourcePage:(router.currentRoute.value.query.sourcePage != undefined ? router.currentRoute.value.query.sourcePage:''),
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


    //源码编辑UI
    const editForumSourceUI = (event:any,row:any) => {
        state.editForumSourceForm = true;
    	state.id = row.id;
    	state.nodeName= row.module


        proxy?.$axios({
            url: '/control/forumCode/manage',
            method: 'get',
            params: {
                method:'source',
                dirName:state.dirName,
                layoutId:row.layoutId,
                forumId:row.id,
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
			    			if(key == "example"){
			    				state.example = mapData[key];   				
			    			}else if(key == "common"){
			    				state.common = mapData[key];
			    			}else if(key == "pc_html"){
			    				state.pc_html = mapData[key];
			    			}else if(key == "wap_html"){
			    				state.wap_html = mapData[key];
			    			}else if(key == "isPCHtmlExist"){
			    				state.isPCHtmlExist = mapData[key];
			    			}else if(key == "isWapHtmlExist"){
			    				state.isWapHtmlExist = mapData[key];
			    			}
			    		}
			    		
			    		nextTick(()=> {
	    					if(state.activeDoc == "example"){
	    						//markRaw 方法可以将原始数据标记为非响应式的
	    						let exampleCodeList = example_doc_ref.value.querySelectorAll("[name*='exampleCode']");
		    					for(let i = 0; i < exampleCodeList.length; ++i) {
									let exampleCode = exampleCodeList[i];
									let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
								      	lineNumbers: true,
								        mode: 'text/html',
								        indentUnit: 4,
								        extraKeys: {"Alt-/": "autocomplete"},
								        indentWithTabs: true,
								        autoCloseTags: true,
								 	}));
								    editor.setSize("100%","100%");//设置自适应高度 
									nextTick(()=> {
                                        editor.refresh();//解决初始状态不渲染数据
                                    });
									state.example_editor.push(editor);
								}
	    					}
	    				});
			    		nextTick(()=> {
	    					if(state.activeDoc == "common"){
	    						//markRaw 方法可以将原始数据标记为非响应式的
	    						let exampleCodeList = common_doc_ref.value.querySelectorAll("[name*='exampleCode']");
		    					for(let i = 0; i < exampleCodeList.length; ++i) {
									let exampleCode = exampleCodeList[i];
									let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
								      	lineNumbers: true,
								        mode: 'text/html',
								        indentUnit: 4,
								        extraKeys: {"Alt-/": "autocomplete"},
								        indentWithTabs: true,
								        autoCloseTags: true,
								 	}));
								    editor.setSize("100%","100%");//设置自适应高度 
									nextTick(()=> {
                                        editor.refresh();//解决初始状态不渲染数据
                                    });
									state.common_editor.push(editor);
								}
	    					}
	    				});
			    		if(state.activeName == "pc" && state.isPCHtmlExist){
			    			nextTick(()=> {
			    				//markRaw 方法可以将原始数据标记为非响应式的
			    				state.editor_pc = markRaw(CodeMirror.fromTextArea(pc_code_ref.value, {
							      	lineNumbers: true,
							        mode: 'text/html',
							        indentUnit: 4,
							        extraKeys: {"Alt-/": "autocomplete"},
							        indentWithTabs: true,
							        autoCloseTags: true,
							 	}));
							 //	_self.editor_pc.setValue(_self.pc_html);
                                state.editor_pc.setSize("100%","100%");//设置自适应高度 
                                nextTick(()=> {
                                    state.editor_pc.refresh();//解决初始状态不渲染数据
                                });
		    				});
					    }
			    		if(state.activeName == "wap" && state.isWapHtmlExist){
	    					nextTick(() =>{
			    				//markRaw 方法可以将原始数据标记为非响应式的
			    				state.editor_wap = markRaw(CodeMirror.fromTextArea(wap_code_ref.value, {
							      	lineNumbers: true,//是否在编辑器左侧显示行号
							        mode: 'text/html',
							        indentUnit: 4,//缩进单位，值为空格数，默认为2 
							        extraKeys: {"Alt-/": "autocomplete"},//给编辑器绑定快捷键
							        indentWithTabs: true,//在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
							        autoCloseTags: true,
							    }));
							    state.editor_wap.setSize("100%","100%");//设置自适应高度 
                                nextTick(()=> {
                                    state.editor_wap.refresh();//解决初始状态不渲染数据
                                });
		    				});
	    				}
			    		
			    	}else if(returnValue.code === 500){
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    //提交源码编辑
    const editForumCode_submitForm = () => {
        state.submitForm_disabled = true;
		
        let formData = new FormData();
        if(state.editor_pc != null && state.editor_pc != ''){
            formData.append('pc_code', state.editor_pc.getValue());	
        }else{
            formData.append('pc_code', state.pc_html);	
        }
        if(state.editor_wap != null && state.editor_wap != ''){
            formData.append('wap_code', state.editor_wap.getValue());
        }else{
            formData.append('wap_code', state.wap_html);
        }
        if(state.id != null){
            formData.append('forumId', state.id);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/forumCode/manage?method=source&a=a',//a=a参数的作用是仅增加连接符&
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
			    		state.editForumSourceForm = false;
			    		
			    		queryForumList();
						
						handleEditForumSourceFormClose(function(){});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , reactive({}),()=>{});

			    		
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

    //处理源码编辑表单选择
    const handleEditForumSourceFormClick = (tab:any, event:any) => {
        if(tab.props.name == "pc" && state.isPCHtmlExist){
            nextTick(()=> {
                if(state.editor_pc == ""){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    state.editor_pc = markRaw(CodeMirror.fromTextArea(pc_code_ref.value, {
                        lineNumbers: true,
                        mode: 'text/html',
                        indentUnit: 4,
                        extraKeys: {"Alt-/": "autocomplete"},
                        indentWithTabs: true,
                        autoCloseTags: true,
                    }));
                    state.editor_pc.setSize("100%","100%");//设置自适应高度 
                    nextTick(()=> {
                        state.editor_pc.refresh();//解决初始状态不渲染数据
                    });
                }
            });
        
        }
        if(tab.props.name == "wap" && state.isWapHtmlExist){
            nextTick(()=> {
                if(state.editor_wap == ""){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    state.editor_wap = markRaw(CodeMirror.fromTextArea(wap_code_ref.value, {
                        lineNumbers: true,//是否在编辑器左侧显示行号
                        mode: 'text/html',
                        indentUnit: 4,//缩进单位，值为空格数，默认为2 
                        extraKeys: {"Alt-/": "autocomplete"},//给编辑器绑定快捷键
                        indentWithTabs: true,//在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符，默认为false
                        autoCloseTags: true,
                    }));
                    state.editor_wap.setSize("100%","100%");//设置自适应高度 
                    nextTick(()=> {
                        state.editor_wap.refresh();//解决初始状态不渲染数据
                    });
                }
            });
        }
    }

    //处理文档表单选择
    const handleDocClick = (tab:any, event:any) => {
        if(tab.props.name == "example"){
            nextTick(()=> {
                if(state.example_editor.length ==0){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    let exampleCodeList =example_doc_ref.value.querySelectorAll("[name*='exampleCode']");
                    for(let i = 0; i < exampleCodeList.length; ++i) {
                        let exampleCode = exampleCodeList[i];
                        let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
                            lineNumbers: true,
                            mode: 'text/html',
                            indentUnit: 4,
                            extraKeys: {"Alt-/": "autocomplete"},
                            indentWithTabs: true,
                            autoCloseTags: true,
                        }));
                        editor.setSize("100%","100%");//设置自适应高度 
                        nextTick(()=> {
                            editor.refresh();//解决初始状态不渲染数据
                        });
                        state.example_editor.push(editor);
                    }
                }
            });
        
        }
        if(tab.props.name == "common"){
            nextTick(()=> {
                if(state.common_editor.length ==0){
                    //markRaw 方法可以将原始数据标记为非响应式的
                    let exampleCodeList = common_doc_ref.value.querySelectorAll("[name*='exampleCode']");
                    for(let i = 0; i < exampleCodeList.length; ++i) {
                        let exampleCode = exampleCodeList[i];
                        let editor = markRaw(CodeMirror.fromTextArea(exampleCode, {
                            lineNumbers: true,
                            mode: 'text/html',
                            indentUnit: 4,
                            extraKeys: {"Alt-/": "autocomplete"},
                            indentWithTabs: true,
                            autoCloseTags: true,
                        }));
                        editor.setSize("100%","100%");//设置自适应高度 
                        nextTick(()=> {
                            editor.refresh();//解决初始状态不渲染数据
                        });
                        state.common_editor.push(editor);
                    }
                }
            });
        }
    }

    //处理源码编辑表单关闭
    const handleEditForumSourceFormClose  = (done:any) => {
        if(state.editor_pc != ""){
            state.editor_pc.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            state.editor_pc = "";
        }
        if(state.editor_wap != ""){
            state.editor_wap.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            state.editor_wap = "";
        }
        state.activeName = "pc";
        state.activeDoc='example';
        
        if(state.example_editor != null && state.example_editor.length >0){
            for(let i =0; i <state.example_editor.length; i++ ){
                let editor = state.example_editor[i];
                editor.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            }
            state.example_editor = [];
        }
        if(state.common_editor != null && state.common_editor.length >0){
            for(let i =0; i <state.common_editor.length; i++ ){
                let editor = state.common_editor[i];
                editor.toTextArea();//删除编辑器，并恢复原始文本区（内容与编辑器的当前内容保持一致）
            }
            state.common_editor = [];
        }
        
        done();
    }

    //删除版块
    const deleteForum = (event:any,row:any) => {
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
		    formData.append('forumId', row.id);

            proxy?.$axios({
                url: '/control/forum/manage?method=delete&a=a',//a=a参数的作用是仅增加连接符&
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
				    		queryForumList();
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

        
		if(router.currentRoute.value.query.layoutId != undefined && router.currentRoute.value.query.layoutId != ''){
			state.layoutId = router.currentRoute.value.query.layoutId as string;
		}
		if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		if(router.currentRoute.value.query.page != undefined && router.currentRoute.value.query.page != ''){
			state.currentpage = parseInt(router.currentRoute.value.query.page as string);
		}
		
		CodeMirror.commands.autocomplete = function(cm:any) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint); 
		};
		
		//初始化
		queryForumList();
    }) 

</script>