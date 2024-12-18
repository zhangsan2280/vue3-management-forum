<!-- 修改员工 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/staff/list', query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank userModule" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="账号" :error="error.userAccount">
                    {{state.userAccount}}
                </el-form-item>
                <el-form-item label="姓名" :error="error.fullName">
                    <el-col :span="12"><el-input v-model.trim="state.fullName" maxlength="20" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="呢称" :error="error.nickname">
                    <el-col :span="12"><el-input v-model.trim="state.nickname" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="密码" :error="error.userPassword">
                    <el-col :span="12"><el-input v-model.trim="state.userPassword" type="password" maxlength="20" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >不修改请留空</div>
                </el-form-item>
                <el-form-item label="重复密码" :error="error.repeatPassword">
                    <el-col :span="12"><el-input v-model.trim="state.repeatPassword" type="password" maxlength="20" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="超级管理员" :required="true" :error="error.issys" v-if="state.isSysAdmin == true">
                    <el-radio-group v-model="state.issys">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="头像" :error="error.avatarName">
                    <el-col :span="4">
                        <el-image class="avatar" v-if="state.avatarName != null && state.avatarName != ''" style="width: 120px; height: 120px;" fit="contain" :src="state.avatarPath + state.avatarName" :preview-src-list="[state.avatarPath+state.avatarName]" hide-on-click-modal ></el-image>
                    
                        <span v-else>
                            <div ref="confirmAvatarRef"  class="confirmAvatar-preview" v-show="state.confirmAvatar_file != undefined && Object.keys(state.confirmAvatar_file).length > 0" ></div> 
                            <el-avatar class="defaultAvatar" v-show="state.confirmAvatar_file == undefined || Object.keys(state.confirmAvatar_file).length == 0" :size="120" shape="square" :icon="UserFilled" /> 
                        </span>
                    </el-col>
                    <el-col :span="20">
                        <el-button type="primary" plain @click="settingAvatarUI()" style="margin-left: 15px;">设置</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item label="备注"  :error="error.userDesc"  >
                    <el-input v-model.trim="state.userDesc" maxlength="150" :clearable="true" show-word-limit></el-input>					
                </el-form-item>
                <el-form-item label="职位" :error="error.userDuty">
                    <el-col :span="12"><el-input v-model.trim="state.userDuty" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="是否使用" :required="true" :error="error.enabled">
                    <el-radio-group v-model="state.enabled">
                        <el-radio :label="true">启用</el-radio>
                        <el-radio :label="false">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户角色" >
                    <el-checkbox-group v-model="state.sysRolesId">
                        <el-checkbox :label="roles.id" :disabled="roles.logonUserPermission == false" :checked="roles.selected" v-for="roles in state.rolesList">{{roles.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                
                
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            <div class="settingAvatarModule">
                <el-dialog title="设置头像" width="630px" v-model="state.popup_settingAvatar" @close="closeSettingAvatarWindow">
                    <div class="original-box">
                        <img ref="originalImageRef" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="原图"/>
                    </div>
                    <div class="preview-pane-square">
                        <div ref="previewSquareRef" class="preview-square"></div> 
                    </div>
                    <div class="preview-pane-round">
                        <div ref="previewRoundRef"  class="preview-round"></div> 
                    </div>
                    <div class="bottomInfo">
                        <div class="button-box">
                            <div class="container">
                                <div>
                                    <el-upload ref="selectImageRef" v-model:file-list="fileList" action="#" :auto-upload="false" :show-file-list="false" :on-change="handleChange" :accept="'image/*'">
                                        <el-button type="primary" size="large" class="selectImage" plain >选择图片</el-button>
                                    </el-upload>
                                </div>
                                <div>
                                    <el-button type="primary" size="large" class="settingImage" @click="confirmAvatar" :disabled="state.submitForm_disabled">确定</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-dialog>
            
            </div>
        </div>
        
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onMounted, reactive, ref } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, UploadInstance, UploadRawFile, UploadUserFile } from 'element-plus';
    import { processErrorInfo } from '@/utils/tool';
    import { SysRoles } from '@/types';
    import { UserFilled } from '@element-plus/icons-vue'
    import Cropper from "cropperjs";
    import "cropperjs/dist/cropper.css";

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const originalImageRef = ref<HTMLImageElement>()//原图
    const previewSquareRef = ref<HTMLElement>()//预览方框
    const previewRoundRef = ref<HTMLElement>()//预览圆框
    const selectImageRef = ref<UploadInstance>()//选择图片
    const fileList = ref<UploadUserFile[]>()//图片列表
    const confirmAvatarRef = ref<HTMLElement>()//确定头像


    const state = reactive({
        isSysAdmin:false,//是否是超级管理员
        rolesList:[] as Array<SysRoles>,
        
        userId :'',
        userAccount :'',
        fullName :'',
        nickname :'',
        avatarPath :'',
        avatarName :'',
        userPassword :'',
        repeatPassword :'',
        issys :false,
        userDesc :'',
        userDuty :'',
        enabled :true,
        sysRolesId:[],

        popup_settingAvatar:false,//是否弹出更换头像窗口
        avatarCropper:null as any,//头像Cropper


        confirmAvatar_file : {} as UploadRawFile | undefined,
        confirmAvatar_width : 0,
        confirmAvatar_height : 0,
        confirmAvatar_x : 0,
        confirmAvatar_y : 0,
        confirmAvatar_cropBoxData:{} as any,//裁剪框数据

        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        userAccount :'',
        fullName :'',
        nickname :'',
        avatarName :'',
        userPassword :'',
        repeatPassword :'',
        issys :'',
        userDesc :'',
        userDuty :'',
        enabled :'',
    });


    //查询修改员工
    const queryEditStaff = () => {

        proxy?.$axios({
            url: '/control/staff/manage',
            method: 'get',
            params: {
                method : 'editStaff',
			    userId : state.userId,
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
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "isSysAdmin"){
			    				state.isSysAdmin = mapData[key];
			    			}else if(key == "sysUsers"){
			    				let sysUsers = mapData[key];
			    				state.userAccount= sysUsers.userAccount;
			    				state.fullName = sysUsers.fullName;
			    				state.issys = sysUsers.issys;
			    				state.userDesc = sysUsers.userDesc;
			    				state.userDuty = sysUsers.userDuty;
			    				state.enabled = sysUsers.enabled;
			    				state.nickname = sysUsers.nickname;
                                state.avatarPath = sysUsers.avatarPath;
                                state.avatarName = sysUsers.avatarName;
			    			}else if(key == "sysRolesList"){
			    				state.rolesList = mapData[key];
			    			}
			    			
			    		}
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo(returnValue.data as Map<string,string> , error,()=>{});

			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }


 //设置头像UI
 const settingAvatarUI = () => {
        state.popup_settingAvatar=true;
    
        if(state.avatarCropper != null){
            state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            state.avatarCropper = null;
        }
        nextTick(() => {

            createCropper();
        });
    }
    //创建Cropper
    const createCropper = () => {
        if(originalImageRef.value && previewSquareRef.value && previewRoundRef.value){
            state.avatarCropper = new Cropper(originalImageRef.value, {	
                viewMode: 1,//视图模式
                dragMode: 'crop',//拖拽模式
                initialAspectRatio: 1,//定义裁切框的初始宽高比。默认情况下，它与画布（图像包装器）的纵横比相同。这个值只有在aspectRatio值不进行设置的时候生效
                aspectRatio: 1,//裁剪框的宽高比
                preview:[ previewSquareRef.value, previewRoundRef.value],//添加额外的元素(容器)以供预览
                background: true,//显示容器的网格背景
                autoCropArea: 0.6,//定义自动裁剪面积大小(百分比)和图片进行对比。 就是裁剪框显示的大小
                zoomOnWheel: false,//是否可以通过移动鼠标来放大图像
                minContainerWidth:400,
                minContainerHeight:400,
                ready: ()=> {
                    if(Object.keys(state.confirmAvatar_cropBoxData).length != 0){
                        state.avatarCropper.setCropBoxData(state.confirmAvatar_cropBoxData);//设置裁剪框
                    }
                }
            });
        }
        
    }

    //关闭更换头像弹出框
    const closeSettingAvatarWindow = () => {
        state.popup_settingAvatar=false;
        
        if(state.avatarCropper != null){
            state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
            state.avatarCropper = null;
        }
    }

    //处理上传图片
    const handleChange = (file:any, fileList:any) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }
        
        var reader = new FileReader();
        //readAsDataURL方法可以将File对象转化为data:URL格式的字符串（base64编码）
        reader.readAsDataURL(file.raw);
        reader.onload = (e)=>{
            let dataURL:any = reader.result;
            if(dataURL){
                //将img的src改为刚上传的文件的转换格式
                originalImageRef.value?.setAttribute("src",dataURL);
            }
            // form.avatarCropper.reset();

            
            if(state.avatarCropper != null){
                state.avatarCropper.destroy();//销毁裁剪器并从图像中删除实例。
                state.avatarCropper = null;
            }
            
            nextTick(()=>{
                createCropper();
            })
        }
        
	}

    //确定头像
    const confirmAvatar = () => {
        if(state.avatarCropper == null || originalImageRef.value?.getAttribute("src") == "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
           ElMessage({
                showClose: true,
                message: '请选择图片',
                type: 'error',
                onClose: ()=>{}
            })
            return;
        }

        if(fileList.value != null && fileList.value.length >0){
            state.confirmAvatar_file = fileList.value[0].raw;
        }
        state.avatarName = '';
        // - x裁切框距离左边的距离 
        // - y裁切框距离顶部的距离 
        // - width裁切框的宽度 
        // - height裁切框的高度 
        // - rotate裁切框的旋转的角度 
        // - scaleX缩放图像的横坐标 
        // - scaleY缩放图像的纵坐标 
        let dataObject = state.avatarCropper.getData(true);//返回裁剪区域基于原图片!原尺寸!的位置和尺寸 rounded默认为false 表示是否显示四舍五入后的数据
        
        state.confirmAvatar_width = dataObject.width;
        state.confirmAvatar_height = dataObject.height;
        state.confirmAvatar_x = dataObject.x;
        state.confirmAvatar_y = dataObject.y;

        let firstChild = (previewRoundRef.value as any).children[0];

        nextTick(()=>{
            (confirmAvatarRef.value as any).innerHTML = firstChild.outerHTML

            state.confirmAvatar_cropBoxData = state.avatarCropper.getCropBoxData();

        
            state.popup_settingAvatar=false;
        })

        
    }


    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })

        let formData = new FormData();
        formData.append('userId', state.userId);
        formData.append('fullName', state.fullName);
        if(state.nickname != null){
			formData.append('nickname', state.nickname);
		}
        formData.append('userPassword', state.userPassword);
        formData.append('repeatPassword', state.repeatPassword);
        formData.append('issys', state.issys.toString());
        formData.append('userDesc', state.userDesc);
        formData.append('userDuty', state.userDuty);
        formData.append('enabled', state.enabled.toString());
    

        
        for(let i=0; i<state.sysRolesId.length; i++){
            let rolesId = state.sysRolesId[i];
            formData.append('sysRolesId', rolesId);
        }

        if(state.confirmAvatar_file != undefined && Object.keys(state.confirmAvatar_file).length > 0){
            formData.append('file', state.confirmAvatar_file);
            formData.append('width', String(state.confirmAvatar_width));
            formData.append('height', String(state.confirmAvatar_height));
            formData.append('x', String(state.confirmAvatar_x)); 
            formData.append('y', String(state.confirmAvatar_y));
        }

        proxy?.$axios({
            url: '/control/staff/manage?method=editStaff',
            method: 'post',
            data: formData,
            timeout: 0,// 定义请求超时时间
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
							path : '/admin/control/staff/list',
							query:{ page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')}
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

        if(router.currentRoute.value.query.userId != undefined && router.currentRoute.value.query.userId != ''){
			state.userId = router.currentRoute.value.query.userId as string;
		}
		
		
		
		queryEditStaff();
    }) 

</script>
<style scoped lang="scss">
.confirmAvatar-preview{
    width: 120px;
    height: 120px;
    border-radius:3px;
    overflow: hidden;
}

/* 设置头像 */
.settingAvatarModule {
	padding-left: 8px;padding-right: 8px;
	padding-top: 8px;
	padding-bottom: 12px;
    .original-box{
        width: 400px;
        height: 400px;
        background-color: #f6f6f6;
        img{
            display: block;
            max-width: 100%;
        }
    }
    /* 截图预览 -- 正方型 */
    .preview-pane-square {
        display: block;
        position: absolute;
        left:450px;
        top: 84px;
        z-index: 2100;	
        .preview-square {
            width: 120px;
            height: 120px;
            overflow: hidden;
        }
    }
    /* 截图预览 -- 圆型 */
    .preview-pane-round {
        display: block;
        position: absolute;
        left:450px;
        top: 250px;
        z-index: 2100;	
        .preview-round {
            width: 120px;
            height: 120px;
            border-radius:100%;
            overflow: hidden;
        }
    }
    .bottomInfo{
        margin-top: 8px;
        border-top: 1px solid #E4E7ED; 
        line-height:34px; 
        position: relative;
        padding-top: 6px;
        .button-box{
            margin-top:15px;
            width:100%;
            text-align:right;
            .container {
                display: flex;
                justify-content: flex-end;
                .selectImage{
                    font-size: 15px;
                    padding: 8px 20px;
                    margin-left: 12px;
                }
                .settingImage{
                    font-size: 15px;
                    padding: 8px 20px;
                    margin-left: 12px;
                }
            }
        }
    }
}
</style>


