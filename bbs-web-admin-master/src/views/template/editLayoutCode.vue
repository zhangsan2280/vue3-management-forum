<!-- 布局代码编辑 -->
<template>
    <div class="main">
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/control/layout/list',query:{ dirName : $route.query.dirName} }">布局列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}]</el-breadcrumb-item>
                <el-breadcrumb-item>布局代码编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>	
        <div class="editLayoutCodeModule">
            <div class="forumSource-container">
                <el-row >
                    <el-col :span="24"><div class="layoutFile">{{state.layoutFile}}</div></el-col>
                </el-row>
                
                
                <el-tabs v-model="state.activeName" @tab-click="handleEditForumSourceFormClick">
                    <el-tab-pane label="电脑版" name="pc">
                        <div class="code" >
                            <textarea ref="pc_code_ref" v-if="state.isPCHtmlExist">{{state.pc_html}}</textarea>
                            <div class="notExistPrompt" v-if="!state.isPCHtmlExist">电脑版 {{state.layoutFile}}.html 文件不存在</div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="移动版" name="wap">
                        <div class="code">
                            <textarea ref="wap_code_ref" v-if="state.isWapHtmlExist">{{state.wap_html}}</textarea>
                            <div class="notExistPrompt" v-if="!state.isWapHtmlExist">移动版 {{state.layoutFile}}.html 文件不存在</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                
                
                <el-row>
                    <el-col :span="24">
                            <el-button class="submitButton" size="large" type="primary" @click="editLayoutCode_submitForm" :disabled="state.submitForm_disabled">提交</el-button>
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
        
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, markRaw, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { Templates } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'
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

    const example_doc_ref = ref()
    const common_doc_ref = ref()
    const pc_code_ref = ref()
    const wap_code_ref = ref()


    const state = reactive({
        id: '',
        dirName: '',
        templates: {} as Templates,//模板
        
        layoutFile: '',
        editLayoutCode:false,//是否显示布局代码编辑表单
        submitForm_disabled:false,//提交按钮是否禁用
        
        
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
        common_editor:[] as any
    });

    const error = reactive({
        name: '',
        displayType: '',
        remark: '',
    });

    //查询布局代码
    const queryLayoutCodeUI = () => {

        proxy?.$axios({
            url: '/control/layout/manage',
            method: 'get',
            params: {
                method:'editLayoutCode',
                dirName:state.dirName,
                layoutId:state.id,
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
			    			}else if(key == "layout"){
			    				let layout = mapData[key];
			    				state.layoutFile = layout.layoutFile;
			    				
			    			}else if(key == "templates"){
			    				state.templates = mapData[key];
			    			}
			    		}
			    		
			    		nextTick(() =>{
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
									
									state.example_editor.push(editor);
								}
	    					}
	    				});
			    		nextTick(() => {
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
									
									state.common_editor.push(editor);
								}
	    					}
	    				});
			    		if(state.activeName == "pc" && state.isPCHtmlExist){
			    			nextTick(() =>{
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
		    				
		    				});
					    }
			    		if(state.activeName == "wap" && state.isWapHtmlExist){
	    					nextTick(() => {
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
		    				});
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

    //提交布局代码编辑
    const editLayoutCode_submitForm = () => {
        state.submitForm_disabled = true;
			
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
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
            formData.append('layoutId', state.id);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }

        proxy?.$axios({
            url: '/control/layout/manage?method=editLayoutCode&a=a',//a=a参数的作用是仅增加连接符&
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
							path : '/admin/control/layout/list',
							query:{ 
								dirName : state.dirName,
								page :(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')
							}
						});
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

    onMounted(() => {
        //设置缓存
        store.setCacheComponents(String(router.currentRoute.value.name))

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		
		if(router.currentRoute.value.query.layoutId != undefined && router.currentRoute.value.query.layoutId != ''){
			state.id = router.currentRoute.value.query.layoutId as string;
		}
		CodeMirror.commands.autocomplete = function(cm:any) {
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint); 
		};
		
		
		//初始化
		queryLayoutCodeUI();
    }) 

</script>