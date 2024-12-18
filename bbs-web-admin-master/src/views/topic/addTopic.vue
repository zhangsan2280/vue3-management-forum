<!-- 添加话题 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/topic/list', query:{ visible : ($route.query.visible != undefined ? $route.query.visible:''),page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form" >
            <el-form label-width="120"  @submit.native.prevent>
                <el-form-item label="标题" :required="true" :error="error.title" >
                    <el-input v-model.trim="state.title" maxlength="150" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="标签" :required="true" :error="error.tagId">
                    <el-select v-model="state.tagIdGroup" @focus="queryTagList" @change="selectedTag" no-match-text="还没有标签" placeholder="选择标签">
                        <el-option v-for="item in state.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" :required="true" :error="error.sort">
                    <el-input-number v-model="state.sort" controls-position="right" :min="0" :max="999999999"></el-input-number>
                    <div class="form-help" >数字越大越在前</div>
                </el-form-item>
                <el-form-item label="允许评论" :required="true">
                    <el-switch v-model="state.allow" ></el-switch>
                </el-form-item>
                <el-form-item label="精华" :error="error.essence">
                    <el-switch v-model="state.essence" ></el-switch>
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

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
    const route = useRouter();
    const {fileStorageSystem:store_fileStorageSystem} = storeToRefs(store)
 

    const contentRef = ref()

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
			essence: false,
			status :20,
			content :'',
			
			isAllowLoadTagGroup:true,//是否允许加载标签组
			tagIdGroup :[],//标签Id组
			loading :false,//是否正在从远程获取数据
            options: [] as Array<OptionsItem>,//Select 选择器标签数据
			
			userName :'',//用户名称
			userGradeList :[],//会员等级

            addTopicEditor :{} as any,//添加话题编辑器
		    addTopicEditorCreateParameObject :{} as any,//添加话题编辑器的创建参数
			
			submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        title :'',
        tagId :'',
        sort :'',
        essence :'',
        content :'',
    });


    //加载添加话题页
    const loadAddTopic = () => {
        proxy?.$axios({
            url: '/control/topic/manage',
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
		    				}else if(key == "userGradeList"){
		    					state.userGradeList = returnValueMap[key];
		    				}
		    			}
		    			
		    			let availableTag = ['source', '|', 'preview', 'code',
				        '|', 'justifyleft', 'justifycenter', 'justifyright',
				        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
				        'superscript', 'clearhtml', 'quickformat', 'selectall', '|',
				        'formatblock', 'fontname',  'fontsize','fullscreen',  '/', 'forecolor', 'hilitecolor', 'bold',
				        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
				         'media','embedVideo','uploadVideo', 'insertfile','emoticons','baidumap', 'table', 'hr',   'pagebreak',
				         'link', 'unlink','hide','hidePassword','hideComment','hideGrade','hidePoint'];
		    			let uploadPath = "control/topic/manage?method=upload&userName="+state.userName+"&isStaff=true";
                        if (Object.keys(state.addTopicEditorCreateParameObject).length === 0) {//等于空
                            //创建富文本编辑器
                            state.addTopicEditor = createEditor(contentRef.value, availableTag, uploadPath, state.userGradeList,store_fileStorageSystem.value);
                            state.addTopicEditorCreateParameObject = {
                                ref:contentRef.value,
                                availableTag:availableTag,
                                uploadPath:uploadPath,
                                userGradeList:state.userGradeList
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


    //查询标签
    const queryTagList = () => {
        if(!state.isAllowLoadTagGroup){
            return;
        }

        proxy?.$axios({
            url: '/control/tag/manage',
            method: 'get',
            params: {
                method : 'allTag'
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.isAllowLoadTagGroup = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		state.options = [];
			    		let tagList = returnValue.data;
			    		if(tagList != null && tagList.length >0){
			    			for(let i=0; i<tagList.length; i++){
			    				let tag = tagList[i];
				    			let obj:any =new Object();
				    	    	obj.value = tag.id;
				    	    	obj.label = tag.name;
				    	    	state.options.push(obj);
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

    //选中标签
    const selectedTag = (val:any) => {
        state.tagId = val;
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
        
        if(state.tagId != null && state.tagId != ''){
            formData.append('tagId', state.tagId); 
        }
        if(state.sort != null && state.sort >=0){
            
            formData.append('sort', String(state.sort));

        }


        formData.append('allow', state.allow.toString());
        formData.append('status', String(state.status));
        formData.append('essence', state.essence.toString());
        if(contentRef.value.value != null && contentRef.value.value !=''){
            formData.append('content', contentRef.value.value);
        }

        
        proxy?.$axios({
            url: '/control/topic/manage?method=add',
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
							path : '/admin/control/topic/list',
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

        loadAddTopic();

        
    }) 


    //keep-alive 进入时
    onActivated (()=>{
        if (Object.keys(state.addTopicEditorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.addTopicEditor = createEditor(
				state.addTopicEditorCreateParameObject.ref, 
				state.addTopicEditorCreateParameObject.availableTag, 
				state.addTopicEditorCreateParameObject.uploadPath, 
				state.addTopicEditorCreateParameObject.userGradeList,
                store_fileStorageSystem.value
			);
		}
    })

    // keep-alive 离开时
    onDeactivated (()=>{
        if (Object.keys(state.addTopicEditor).length != 0) {//不等于空
            state.addTopicEditor.remove();
            state.addTopicEditor = {};
        }
    })



</script>