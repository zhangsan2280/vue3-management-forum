<!-- 添加问题 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/question/list', query:{ visible : ($route.query.visible != undefined ? $route.query.visible:''),page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form" >
            <el-form label-width="120"  @submit.native.prevent>
                <el-form-item label="标题" :required="true" :error="error.title" >
                    <el-input v-model.trim="state.title" maxlength="150" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="标签" :required="true" :error="error.tagId">
                    <el-select ref="question_tag_ref"  v-model="state.tagIdGroup" size="large" @remove-tag="processRemoveTag" @focus="loadQuestionTag"  style="width: 100%;" multiple :placeholder="state.select_placeholder" >
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="允许回答" :required="true">
                    <el-switch v-model="state.allow" ></el-switch>
                </el-form-item>
                <el-form-item label="状态" :required="true">
                    <el-radio-group v-model="state.status">
                        <el-radio :label="10">待审核</el-radio>
                        <el-radio :label="20">已发布</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容" :required="true" :error="error.content">
                    <textarea ref="contentRef" style="width:99%;height:400px;visibility:hidden;"></textarea>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @mousedown.native="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
        
        <div class="selectQuestionTagModule">
            <el-dialog title="选择标签" v-model="state.popup_allTag" @close="closeQuestionTag">
                <div class="questionTagNavigation">
                    <ul class="nav">
                        <li class="nav-item" v-for="questionTag in state.allTagList" >
                            <span :class="selectedTagClass(questionTag.id)"  @click="selectChildTag(questionTag.id)" >{{questionTag.name}}</span>
                        </li>
                    </ul>
                    <!-- 二级标签 -->
                    <div class="tab-content">
                        <div class="tab-pane">
                            <span :class="selectedChildTagClass(childQuestionTag.id)" @click="selectedTag(childQuestionTag)"  v-for="childQuestionTag in state.childTagList" >{{childQuestionTag.name}}</span>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
        
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onActivated, onDeactivated, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import { QuestionTag } from '@/types';

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
    const route = useRouter();
    const {fileStorageSystem:store_fileStorageSystem} = storeToRefs(store)
 

    const contentRef = ref()
    const question_tag_ref = ref()

    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        title :'',
        tagId :'',//标签Id
        sort : 0,
        allow : true,
        status :20,
        content :'',
        
        tagIdGroup :[] as any,//标签Id组
        options: [] as Array<OptionsItem>,//Select 选择器标签数据
        
        
        popup_allTag :false,//是否弹出问题标签表单
        allTagList: [] as Array<QuestionTag>,//全部标签
        selectedFirstTagId: '',//选中的一级标签Id
        childTagList: [] as Array<QuestionTag>,//选中一级标签的子标签集合
        select_placeholder: '请选择',

        userName :'',//用户名称
        userGradeList :[],//会员等级
        
        addQuestionEditor :{} as any,//添加问题编辑器
        addQuestionEditorCreateParameObject :{} as any,//添加问题编辑器的创建参数
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        title :'',
        tagId :'',
        sort :'',
        content :'',
    });


    //加载添加话题页
    const loadAddQuestion = () => {
        proxy?.$axios({
            url: '/control/question/manage',
            method: 'get',
            params: {
                method : 'add'
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
                        let returnValueMap = returnValue.data;
		    			for(let key in returnValueMap){
		    				if(key == "userName"){
		    					state.userName = returnValueMap[key];
		    				}
		    			}
		    			
		    			let availableTag = ['source', '|', 'preview', 'code',
					   		 		        '|', 'justifyleft', 'justifycenter', 'justifyright',
					   				        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
					   				        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 
					   				        'formatblock', 'fontname', 'fontsize','fullscreen', '/', 'forecolor', 'hilitecolor', 'bold',
					   				        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
					   				         'media','embedVideo','uploadVideo', 'insertfile','emoticons','baidumap', 'table', 'hr',   'pagebreak',
					   				         'link', 'unlink'];
		    			let uploadPath = "control/question/manage?method=upload&userName="+state.userName+"&isStaff=true";
			    		if (Object.keys(state.addQuestionEditorCreateParameObject).length === 0) {//等于空
                            //创建富文本编辑器
                            state.addQuestionEditor = createEditor(contentRef.value, availableTag, uploadPath,null,store_fileStorageSystem.value);
                            state.addQuestionEditorCreateParameObject = {
                                ref:contentRef.value,
                                availableTag:availableTag,
                                uploadPath:uploadPath,
                                userGradeList:null
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


    //加载问题标签
    const loadQuestionTag = () => {
        state.popup_allTag = true;
        question_tag_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        if(state.tagIdGroup.length ==0){
            state.options.length = 0;//清空	
        }
        
        queryAllTag();
    }
    //关闭问题标签弹出框
    const closeQuestionTag = () => {
        state.popup_allTag = false;

    }
    //处理删除标签
    const processRemoveTag = (val:any) => {
        if(state.tagIdGroup.length ==0){
            
            state.select_placeholder = "请选择";
        }
    }

    //查询所有标签
    const queryAllTag = () => {
        proxy?.$axios({
            url: '/control/questionTag/manage',
            method: 'get',
            params: {
                method : 'allTag'
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let tagList = returnValue.data;
			    		if (tagList != null && tagList.length > 0) {
							state.allTagList = tagList;
							
							for (var i= 0; i < tagList.length; i++) {
								var questionTag = tagList[i];
								//第一次选中第一个标签
								if(state.selectedFirstTagId == ''){
									state.childTagList = questionTag.childTag;
									state.selectedFirstTagId = questionTag.id;
									break;
								}else{
									if(state.selectedFirstTagId == questionTag.id){
										state.childTagList = questionTag.childTag;
										break;
									}
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

    //选择子标签
    const selectChildTag = (questionTagId:string) => {
        state.selectedFirstTagId = questionTagId;
			
        if(state.allTagList != null && state.allTagList.length >0){
            for (var i= 0; i <state.allTagList.length; i++) {
                var questionTag = state.allTagList[i];
                
                if(questionTagId == questionTag.id){
                    state.childTagList = questionTag.childTag;
                    
                    //如果只有一个节点，则允许选择本标签
                    if(questionTag.childNodeNumber == 0){
                        selectedTag(questionTag);
                    }

                    break;
                }
                
            }
            
        }
    }
    //选中标签
    const selectedTag = (childQuestionTag : QuestionTag) => {
        //判断是否重复选择,如果重复则取消选择
        if(state.options != null && state.options.length >0){
            for(var i=0; i<state.options.length; i++){
                var selectedTag = state.options[i];
                if(selectedTag.value == childQuestionTag.id){
                    //删除标签
                    deleteTag(selectedTag.value);
                    return;
                }
            }
            
        }

        var o:any = new Object();
        o.value = childQuestionTag.id;
        o.label = childQuestionTag.name;

        state.options.push(o);
        
        
        state.tagIdGroup.push(childQuestionTag.id);
        
        state.select_placeholder = "";
    }

    //删除标签
    const deleteTag = (questionTagId:string) => {
		if(state.options != null && state.options.length >0){
            for(let i=0; i<state.options.length; i++){
                let selectedTag = state.options[i];
                if(selectedTag.value == questionTagId){
                    state.options.splice(i, 1);
                    
                    for(let j=0; j<state.tagIdGroup.length; j++){
                        if(state.tagIdGroup[j] == questionTagId){
                            state.tagIdGroup.splice(j, 1);
                            break;
                        }
                        
                    }
                    
                    if(state.tagIdGroup.length ==0){
                        state.select_placeholder = "请选择";
                    }
                    return;
                }
            }
            
        }

    }

    //选中一级标签样式
    const selectedTagClass = (questionTagId:string) => {
        var className = "nav-link";
        if(state.selectedFirstTagId == questionTagId){
            className += " active";
            
        }
        if(state.options != null && state.options.length >0){
            for(var i=0; i<state.options.length; i++){
                var selectedTag = state.options[i];
                if(selectedTag.value == questionTagId){
                    className += " selected";
                }
            }
            
        }
        return className;
    }
    
    //选中二级标签样式
    const selectedChildTagClass = (questionTagId:string) => {
        if(state.options != null && state.options.length >0){
            for(var i=0; i<state.options.length; i++){
                var selectedTag = state.options[i];
                if(selectedTag.value == questionTagId){
                    return "child-tag selected";
                }
            }
            
        }
        return "child-tag";
    }

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        if(state.title != null && state.title != ''){
            formData.append('title', state.title);
            
        }
        
        if(state.tagIdGroup != null && state.tagIdGroup.length >0){
            for(let i = 0; i <state.tagIdGroup.length; i++){
                let tagId = state.tagIdGroup[i];
                formData.append('tagId', tagId); 
            }
        }
        if(state.sort != null){
            formData.append('sort', String(state.sort));
        }
        formData.append('allow', state.allow.toString());
        formData.append('status', String(state.status));
       
        
        if(contentRef.value.value != null && contentRef.value.value !=''){
            formData.append('content', contentRef.value.value);
        }

        
        proxy?.$axios({
            url: '/control/question/manage?method=add',
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
							path : '/admin/control/question/list',
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

        loadAddQuestion();

        
    }) 


    //keep-alive 进入时
    onActivated (()=>{
        if (Object.keys(state.addQuestionEditorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.addQuestionEditor = createEditor(
				state.addQuestionEditorCreateParameObject.ref, 
				state.addQuestionEditorCreateParameObject.availableTag, 
				state.addQuestionEditorCreateParameObject.uploadPath, 
				state.addQuestionEditorCreateParameObject.userGradeList,
                store_fileStorageSystem.value
			);
		}
    })

    // keep-alive 离开时
    onDeactivated (()=>{
        if (Object.keys(state.addQuestionEditor).length != 0) {//不等于空
            state.addQuestionEditor.remove();
            state.addQuestionEditor = {};
        }
    })



</script>