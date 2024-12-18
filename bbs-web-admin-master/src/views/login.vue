<!-- 后台登录 -->
<template>
    <div>
    <div class="loginModule">
        <div class="login-container">
            <div class="title">
                <h2>后台登录</h2>
            </div>
            <div class="box">
                <div class="form">
                    <div class="form-field" >
                        <div class="form-field-container" @click="selectedField('username')">
                            <div class="form-field-text">
                                <div class="form-field-input-container">
                                    <input v-model.trim="state.username" @keyup.enter="onSubmit" v-custom-focus="state.username_focus" tabindex="1" @keyup.tab="selectedField('username')" @blur="fieldBlur('username')" maxLength="20" class="form-field-text-input" type="text">
                                    <label :class="state.username_field_label_class" >用户名</label>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div v-text="error.username" v-show="error.username != ''" class="form-field-prompt-error"></div>
                    
                    <div class="form-field" >
                        <div class="form-field-container" @click="selectedField('password')">
                            <div class="form-field-text">
                                <div class="form-field-input-container">
                                    <input v-model.trim="state.password" @keyup.enter="onSubmit" v-custom-focus="state.password_focus" tabindex="2" @keyup.tab="selectedField('password')" @blur="fieldBlur('password')" maxLength="20" class="form-field-text-input" type="password" >
                                    <label :class="state.password_field_label_class" >密码</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-text="error.password" v-show="error.password != ''" class="form-field-prompt-error"></div>
                    <div id="captchaValue_field" class="form-field" v-show="state.showCaptcha" >
                        <div class="form-field-container" @click="selectedField('captchaValue')">
                            <div class="form-field-text">
                                <div class="form-field-input-container">
                                    <input v-model.trim="state.captchaValue" @keyup.enter="onSubmit" v-custom-focus="state.captchaValue_focus" tabindex="3" @keyup.tab="selectedField('captchaValue')" @blur="fieldBlur('captchaValue')" @change.native="validation_captchaValue"  class="form-field-text-input" type="text" maxlength="4" >
                                    <label :class="state.captchaValue_field_label_class" >验证码</label>
                                </div>
                                <div class="form-field-image-container">
                                    <img :src="state.imgUrl" @click="replaceCaptcha" tabindex="-1" />
                                    
                                </div>
                                <div class="form-field-button-container" style="background: #fff;">
                                    <button type="button" class="btn btn-link" tabindex="-1" @click="replaceCaptcha">换一幅</button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div v-text="error.captchaValue" v-show="error.captchaValue != ''"  class="form-field-prompt-error"></div>
                </div>
                <div class="loginButton">
                    <span @mousedown="onSubmit" @keyup.enter="onSubmit" tabindex="4">登&nbsp;录</span>
                    <div v-text="error.userInfo" v-if="error.userInfo != ''" class="form-error"></div>
                    <div v-text="error.login" v-if="error.login != ''" class="form-error"></div>
                </div>  
            </div>
    
        </div>

    </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, Directive, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { SHA256} from 'crypto-js';
    import { useRouter } from 'vue-router';
    
    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    
    const state = reactive({
        //用户名称
        username: '',
        //用户名称表单字段焦点
        username_focus : false,
        //用户名称表单字段样式
        username_field_label_class: 'form-field-label',
        //密码
        password: '',
        //密码表单字段焦点
        password_focus : false,
        //密码表单字段样式
        password_field_label_class: 'form-field-label',
        showCaptcha : false, //是否显示验证码
        captchaKey: '',//验证码key
        captchaValue: '',//验证码值
        imgUrl: '',//验证码图片
        //验证码字段焦点
        captchaValue_focus : false,
        //验证码表单字段样式
        captchaValue_field_label_class: 'form-field-label',
        allowSubmit:false,//提交按钮disabled状态

    });

    //错误
    const error = reactive({
        username : '',
        password : '',
        captchaValue : '',
        userInfo : '',
        login : ''
    })


    // 注册一个局部的自定义指令，需要以小写v开头
    const vCustomFocus:Directive = (el:HTMLElement, binding:any) => {
        if (binding.value) {
            el.focus();
        }
    }

    //加载登录页
    const loadLogin = () => {
         //用户名
        let username = state.username;
        if (username != "") {
            username = encodeURIComponent(username);
        }
        proxy?.$axios({
            url: '/admin/login',
            method: 'get',
            params:  { 
                username:username
            },
            showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    if(result.code === 200){//成功
			    		let data = result.data;
			    		if(data.isCaptcha){//显示验证码
			    			state.showCaptcha = true;
			    			state.captchaKey = data.captchaKey;
			    			state.imgUrl = "captcha/" + data.captchaKey + ".jpg";
			    			//设置验证码图片
							replaceCaptcha();
		
			    		}
			    	}else if(result.code === 500){//错误
			    		
			    		
			    	}
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }


    //选中字段
    const selectedField = (fieldName:string) => {
        if(fieldName == "username"){
            state.username_focus = true;
            state.username_field_label_class = "form-field-label form-field-active";
        }
        if(fieldName == "password"){
            state.password_focus = true;
            state.password_field_label_class = "form-field-label form-field-active";
        }
        if(fieldName == "captchaValue"){
            state.captchaValue_focus = true;
            state.captchaValue_field_label_class = "form-field-label form-field-active";
        }
    }

    //字段失去焦点
    const fieldBlur = (fieldName:string) => {
        if(fieldName == "username"){
            state.username_focus = false;
        }
        if(fieldName == "password"){
            state.password_focus = false;
        }
        if(fieldName == "captchaValue"){
            state.captchaValue_focus = false;
        }
        
        if(state.username == ''){
            //用户名称表单字段焦点
            state.username_focus = false;
            //用户名称表单字段样式
            state.username_field_label_class = 'form-field-label';
            
        }
        if(state.password == ''){
            //密码表单字段焦点
            state.password_focus = false;
            //密码表单字段样式
            state.password_field_label_class = 'form-field-label';
            
        }
        if(state.captchaValue == ''){
            //验证码表单字段焦点
            state.captchaValue_focus = false;
            //验证码表单字段样式
            state.captchaValue_field_label_class = 'form-field-label';
            
        }
    }
		
    //刷新验证码
    const replaceCaptcha = () => {
        state.imgUrl = store.apiUrl+"captcha/" + state.captchaKey + ".jpg?" + Math.random();

    }

    //验证验证码(同步)
    const validation_captchaValue = async () => {
        let cv = state.captchaValue.trim();
        if (cv.length < 4) {
            error.captchaValue = "请填写完整验证码";
        }
        if (cv.length >= 4) {
            //清除验证码错误
            error.captchaValue = "";

            await proxy?.$axios({
                url: '/userVerification',
                method: 'get',
                params: {
                    captchaKey:state.captchaKey,
                    captchaValue:cv
                },
                showLoading: false,//是否显示加载图标
                loadingMask:false,// 是否显示遮罩层
            })
            .then((response: AxiosResponse) => {
                if(response){
                    const result: any = response.data;
    
                    if (result == "false") {
                        error.captchaValue = "验证码错误";
                    }
                }
            })
            .catch((error: any) =>{
                console.log(error);
            });
        }
    }



    //提交数据
    const onSubmit = () => {
        state.allowSubmit = true;//提交按钮disabled状态
        //清空error的属性值
        Object.keys(error).map(key => {
            Object.assign(error, {[key] : ''});
        })
        
        
        let formData = new FormData();
        
        
        //用户名
        let username = state.username;
        if (username != "") {
            formData.append('username', encodeURIComponent(username));
        }
        //密码需SHA256加密
        let password = state.password;
        if (password != "") {
            formData.append('password', SHA256(password).toString());
        }
        if(state.captchaKey != ''){
            //验证码Key
            formData.append('captchaKey',encodeURIComponent(state.captchaKey));
            //验证码值
            formData.append('captchaValue',encodeURIComponent(state.captchaValue.trim()));
        }

        proxy?.$axios({
            url: '/admin/login',
            method: 'post',
            data: formData,  
         //   showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    
                    if(returnValue.code === 200){//成功
                        
                        let data = returnValue.data;
                        if(data){
                            //写入sessionStorage中
                            window.sessionStorage.setItem('oauth2Token', JSON.stringify(data));
                            
                        }
                        //清空历史路径记录
                        store.clearHistoryPath()
                        //清空窗口浏览状态
                        store.clearWindowBrowseStatus()

                        //删除窗口最后打开的URL
                        window.sessionStorage.removeItem('windowNewestURLList');
                        
                        
                        router.push("/admin/control/manage/home");
                        
                        
                    }else if(returnValue.code === 500){//错误
                        let errorMap = returnValue.data;
                        let showCaptcha = false;

                        for (const [key, value] of Object.entries(errorMap) as [string, string][]){
                            Object.assign(error, {[key] : value});//将变量作为一个对象的key
                            
                            if(key =="captchaKey" || key =="captchaValue"){
                                showCaptcha = true;
                            }
                        }

                        if(showCaptcha && state.showCaptcha){
                            //设置验证码图片
                            replaceCaptcha();
                        }
                        if(showCaptcha && state.showCaptcha == false){
                            loadLogin();
                        }
                        
                        
                    }
                }
            }
        })
        .catch((error: any) =>{
            console.log(error);
        });
    }

    onMounted(() => {
        loadLogin();
    }) 

</script>
<style scoped lang="scss">
.loginModule{
    width: 100%;
    height: 100%;
    position: fixed;
    
    background-color: #f5f5f6;
    background-image: linear-gradient(335deg, #fcfcfc 23px, transparent 23px),
    linear-gradient(155deg, #fcfcfc 23px, transparent 23px),
    linear-gradient(335deg, #fcfcfc 23px, transparent 23px),
    linear-gradient(155deg, #fcfcfc 23px, transparent 23px);
    background-size: 58px 58px; 
    background-position: 0px 2px, 4px 35px, 29px 31px, 34px 6px;
    .login-container {
        width:550px;position:absolute;left:50%;top:40%;margin-left:-300px;margin-top:-180px;
        background-color:#fff;border:1px solid #fff;border-radius:3px; box-shadow:0 0 8px #eeeeee;
        .title {
            text-align:center;
            letter-spacing:2px;
            padding:35px 0px 0px 0px;
            h2 {color:#409EFF;font-size:24px;font-weight:normal;}
        }
        .box{
            background: #fff;
            padding:0px 40px 20px 40px;
            width:360px;
            color:#6e6e6e;
            margin:5px auto 30px;
            .form {
                position: relative;
                height: auto;
                margin-right: 0;
                margin-left: 0;
                zoom: 1;
                display: block;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                &:after,&:before{
                    display: table;
	                content: ""
                }
                &:after {
                    clear: both
                }

                .form-field {
                    position: relative;
                    min-height: 1px;
                    width: 100%;
                    padding-right: 0;
                    padding-left: 0;
                    margin-top: 20px;
                    -ms-flex: 0 0 auto;
                    flex: 0 0 auto;
                    float: left;
                    display: block;
                    -webkit-box-sizing: border-box;
                    box-sizing: border-box;
                    border-bottom: solid 1px #e6e6e6;
                    
                    .form-field-container{
                        
                        .form-field-text {
                            position: relative;
                            overflow: hidden;
                            display: table;
                            border-collapse: separate;
                            border-spacing: 0;
                            width: 100%;
                            transition: all .3s cubic-bezier(.645,.045,.355,1);
                            -webkit-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            border-radius: 4px;
                            /**border: 1px solid rgba(0,0,0,0);**/
                        
                        }
                        .form-field-error>.form-field-text {
                            background: #fcf2f3;
                        }
                        .form-field-input-container{
                            position: relative;
                            display: table-cell;
                            width: 100%;
                            .form-field-text-input {
                                height: 54px;
                                box-sizing: border-box;
                                -webkit-appearance: none;
                                -moz-appearance: none;
                                appearance: none;
                                padding: 30px 0px 10px;
                                border: none;
                                font-size: 16px;
                                color: #333;
                                line-height: 20px;
                                background: rgba(0,0,0,0);
                                width: 100%;
                                &::-webkit-input-placeholder {
                                    color: #aaa
                                }
                                &:-ms-input-placeholder {
                                    color: #aaa
                                }
                                &::-ms-input-placeholder {
                                    color: #aaa
                                }
                                &::placeholder {
                                    color: #aaa
                                }
                                &:focus {
                                    outline: none
                                }
                            }
                        }
                        .form-field-label {
                            cursor: text;
                            -webkit-user-select: none;
                            -ms-user-select: none;
                            user-select: none;
                            position: absolute;
                            left: 0px;
                            top: 28px;
                            height: 20px;
                            font-weight: 400;
                            font-size: 16px;
                            color: rgba(0,0,0,.4);
                            line-height: 20px;
                            transition: top .15s cubic-bezier(.4,0,.2,1),font-size .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);
                            max-width: calc(100% - 20px);
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                            .required{
                                font-size: 14px;
                                color: #f04645;
                                position: relative;
                                top: 3px;
                            }
                        }
                        .form-field-active {
                            top: 2px;
                            color: #aaa;
                        }
                        .form-field-help {
                            margin-top: 8px;
                            font-size: 14px;
                            color: #999;
                            line-height: 20px
                        }
                        .form-field-prompt-success {
                            margin-top: 8px;
                            font-size: 14px;
                            color: green;
                            line-height: 20px
                        }
                        .form-field-button-container {
                            display: table-cell;
                            vertical-align: middle;
                            position: relative;top: 4px;
                            .btn {
                                line-height: 1.499;
                                position: relative;
                                display: inline-block;
                                font-weight: 400;
                                white-space: nowrap;
                                text-align: center;
                                background-image: none;
                                -webkit-box-shadow: 0 2px 0 rgba(0,0,0,.015);
                                box-shadow: 0 2px 0 rgba(0,0,0,.015);
                                cursor: pointer;
                                -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
                                transition: all .3s cubic-bezier(.645,.045,.355,1);
                                -webkit-user-select: none;
                                -moz-user-select: none;
                                -ms-user-select: none;
                                user-select: none;
                                -ms-touch-action: manipulation;
                                touch-action: manipulation;
                                height: 32px;
                                padding: 0 15px;
                                font-size: 16px;
                                border-radius: 4px;
                                color: rgba(0,0,0,.65);
                                background-color: #fff;
                                border: 1px solid #d9d9d9
                            }
                            .btn-link {
                                color: #2196F3;
                                background-color: rgba(0,0,0,0);
                                border-color: rgba(0,0,0,0);
                                -webkit-box-shadow: none;
                                box-shadow: none;
                                &:focus,&:hover {
                                    color: #45b6f7;
                                    background-color: rgba(0,0,0,0);
                                    border-color: rgba(0,0,0,0)
                                }
                            }
                            .btn-link-disabled,.btn-link-disabled.active,.btn-link-disabled:focus,.btn-link-disabled:hover{
                                color: rgba(0,0,0,.25);
                                background-color: rgba(0,0,0,0);
                                border-color: rgba(0,0,0,0);
                                text-shadow: none;
                                -webkit-box-shadow: none;
                                box-shadow: none
                            }
                        }
                        .form-field-image-container {
                            display: table-cell;
                            vertical-align: bottom;
                            background: #fff;
                            width:150px;
                            img{width:120px;height:40px;outline:none;margin-left: 10px;cursor:pointer;}
                        }
                    }
                }
                .form-field-prompt-error {
                    font-size: 14px;
                    line-height: 18px;
                    color: #f04645;
                    
                    margin-top: 5px;
                    float: left;
                }
            }
            .form+.form:before {
                clear: both
            }
            .loginButton{
                margin-top: 40px;
                span{
                    width:100%;
                    border-radius:4px;
                    color:#fff;
                    display: inline-block;
                    height:44px;
                    text-align: center;
                    font-weight:normal; 
                    font-size:20px;
                    line-height:44px;  
                    background:#409EFF;
                    outline:none;
                    &:hover{background:#53a8ff;text-decoration:none;cursor:pointer;}
                    &:focus {
                        box-shadow: 0 5px 20px rgba(64,158,255, .5);
                    }
                }
                .form-error {
                    margin-top: 15px;
                    font-size: 14px;
                    line-height: 26px;
                    color: #f04645;;
                } 
            }
        }
    }
}
</style>