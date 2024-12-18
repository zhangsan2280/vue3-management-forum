import { ElMessageBox, MessageBoxState } from 'element-plus'
import type { Action } from 'element-plus'
import {useStore} from '@/store'
import { storeToRefs } from 'pinia';
/**
 * 获取接口值
 * getInterfaceValue(result.error, "password")
 * @param obj 
 * @param key 
 * @returns 
 */
export function getInterfaceValue<T extends object, K extends keyof T>(obj: T, key: K){
    return obj[key];
}

/**
 * 解决元素隐式具有 “any” 类型，因为类型为 “string” 的表达式不能用于索引类型
 *  Object.keys(error).map(key => {
         if(isValidKey(key,error)){
            delete error[key];
         }
    })
 * @param key Map的键
 * @param object Map对象
 * @returns 
 */
export function isValidKey(key: string | number | symbol , object: object): key is keyof typeof object {
    return key in object;
}


 /**
 * 处理错误信息(Map的key为string类型)
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo(errorInfo:Map<string,string> , error: any,callback: () => void): void {
    let htmlMessage:string = "";
    let count = 1;
    for (const [key, value] of Object.entries(errorInfo) as [string, string][]){

        if(key.indexOf("_") != -1 && !Object.prototype.hasOwnProperty.call(error, key)){//例如userCustom_
           // error.userCustom.set(key ,value);
            error[key.split('_')[0]].set(key ,value);
            continue;
        }

        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}

 /**
 * 处理错误信息(Map的key为number类型)
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo_number(errorInfo:Map<string,string> , error: any,callback: () => void): void {
    let htmlMessage:string = "";
    let count = 1;
    for (const [key, value] of Object.entries(errorInfo) as [string, string][]){

        if(key.indexOf("_") != -1 && !Object.prototype.hasOwnProperty.call(error, key)){//例如userCustom_

           // error.userCustom.set(key ,value);
            error[key.split('_')[0]].set(parseInt(key.substring(key.lastIndexOf("_")+1,key.length)) ,value);
            continue;
        }

        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}

 /**
 * 处理错误信息(Map的key为Object类型)
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo_object(errorInfo:Map<string,string> , error: any,callback: () => void): void {
    let htmlMessage:string = "";
    let count = 1;
    A:for (const [key, value] of Object.entries(errorInfo) as [string, string][]){

        if(key.indexOf(".") != -1){//topicEditorTagObject.imageFormat
            let parameterName_first = key.split(".")[0];
            let parameterName_two = key.split(".")[1];
            //设置返回错误提示值到错误对象中
            for (let attribute_key in error) {
                if(attribute_key == parameterName_first){
                    let child = error[attribute_key]
                    for(let attribute_child_key in child){
                        
                        if(attribute_child_key == parameterName_two){
                            child[attribute_child_key] = value;
                            continue A;
                        }
                        
                    }
                }
            }
        }


        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}

 /**
 * 处理版块错误信息(Map的key为Object类型)
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo_forum(errorInfo:Map<string,string> , error: any,callback: () => void): void {
    let htmlMessage:string = "";
    let count = 1;

    A:for (const [key, value] of Object.entries(errorInfo) as [string, string][]){
       
        for (let attribute_key in error) {
            let attribute_value = error[attribute_key];

            if(getType(attribute_value) == 'object'){//如果为Object类型		
                let parameterName = (key.lastIndexOf("_") != -1 ? key.substring(0,key.lastIndexOf("_")) : '');//删除最后一个序号 collection_image_name_0
                if(parameterName != "" && getType(attribute_value[parameterName]) == 'map'){
                    attribute_value[parameterName].set(parseInt(key.substring(key.lastIndexOf("_")+1,key.length)),value);
                    continue A;
                }
                
                
                if(attribute_value[key] != undefined){
                    attribute_value[key] = value;
                    continue A;
                }
                
                
            }
            
        }

        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}


 /**
 * 处理‘短信管理’错误信息
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo_sms(errorInfo:Map<string,string> , error: any,callback: () => void): void {
    let htmlMessage:string = "";
    let count = 1;

    A:for (const [key, value] of Object.entries(errorInfo) as [string, string][]){
       
        if(key.split("_").length >3 && !Object.prototype.hasOwnProperty.call(error, key)){//例如alidayu_signName_1_1
            let parameterName = key.split("_")[0] +"_"+ key.split("_")[1];
            if(parameterName != "" && getType(error[parameterName]) == 'map'){
                error[parameterName].set(key.split("_")[2] +"_"+ key.split("_")[3],value);
                continue;
            }
        }

        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}

/**
 * 解析url参数
 * @param url 格式: /qq?aa=1&bb=2
 * @return 参数对象
 */
export function analyzeUrlParam(url:string) {
	let params = {} as any;
	let urls = url.split("?");
	if(urls.length ==2){
		let arr = urls[1].split("&");
		for (let i = 0, l = arr.length; i < l; i++) {
			let a = arr[i].split("=");
			if(a[1] == undefined){//参数和值都为空时也加上&
				params[a[0]] = "";
			}else{
				params[a[0]] = a[1];
			}
			
		} 
	}
	return params;
}

/**
 *对象转换为Map
 */
export function objToStrMap(obj:any){
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k,obj[k]);
    }
    return strMap;
}
/**
 *map转化为对象（map所有键都是字符串，可以将其转换为对象）
 */
 export function strMapToObj(strMap:any){
	let obj= Object.create(null);
    for (let[k,v] of strMap) {
        obj[k] = v;
    }
    return obj;
}

/**
 * 获取URL中的URI
 * @param url 例如 login?jumpPath=aW5kZXg 返回login
 * @returns 
 */
 export function getUri(url:string): string{
    if(url.indexOf("?") != -1){//如果存在问号
        return url.substring(0,url.indexOf("?"));
    }else{
        return url;
    }
}
/**
 * 获取URL参数
 * @param url 例如 login?jumpPath=aW5kZXg 返回aW5kZXg
 * @param name 参数名称
 * @returns
 */
 export function getUrlParam(url:string,name:string) : string | null{
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

    if(url.indexOf("?") != -1){//如果存在问号
        let afterUrl = url.substring(url.indexOf("?")+1,url.length);

        let r = afterUrl.match(reg); //匹配目标参数
	    if (r != null) return r[2];
    }
	return null; //返回参数值
}
/**
 * 获取所有URL参数
 * @param url 例如 login?jumpPath=aW5kZXg&aa=2 返回[{jumpPath:aW5kZXg},{aa:2}]
 * @returns
 */
 export function getAllUrlParam(url:string) :Array<Object>{
    let arr = new Array<Object>();
    if(url.indexOf("?") != -1){//如果存在问号
        let afterUrl = url.substring(url.indexOf("?")+1,url.length);
        if(afterUrl!=""){
            let urlParamArr = afterUrl.split("&");
            for(let i=0;i<urlParamArr.length;i++){
                let paramArr:string[] = urlParamArr[i].split("=");
               arr.push({[paramArr[0]]:paramArr[1]});
            }
        }
    }
	return arr;
}

/**
 * 替换URL参数
 * url 目标url
 * param 需要替换的参数名称
 * paramVal 替换后的参数的值
 * 返回值为新的url
 * example: updateURLParameter('www.baidu.com?id=12','id','13') 返回结果为 'www.baidu.com?id=13'
 * @returns
 */
export function updateURLParameter(url:string, param:string, paramVal:string){
	let newAdditionalURL = "";
	let tempArray = url.split("?");
	let baseURL = tempArray[0];
	let additionalURL = tempArray[1];
	let temp = "";
    
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (let i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    let rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

//转Base64格式图片
export function toBase64Image (data:any){
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (e:any) => {
            resolve(e.target.result);
        };
        fileReader.readAsDataURL(data);
        fileReader.onerror = () => {
            reject(new Error('文件流异常'));
        };
    });
}

/**
 * 计算标签对象距顶部的距离
 * @param element
 */
export function getElementTop(element:any){
	let actualTop = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null){
    	actualTop += current.offsetTop;
        current = current.offsetParent;
    }

    return actualTop;
}

/**
 * 判断对象类型 getType(new Map()) // "map"
 * obj instanceof Map
 * @param obj 
 * @returns 
 */
 export function getType(obj:any) :string{
    let text = Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)
    if(text != null){
        let type = text[1].toLowerCase();
        if(type === 'string' && typeof obj === 'object') return 'object'; // Let "new String('')" return 'object'
        if (obj === null) return 'null'; // PhantomJS has type "DOMWindow" for null
        if (obj === undefined) return 'undefined'; // PhantomJS has type "DOMWindow" for undefined
        return type;
    }


    
    return '';
 }

/**
 * 生成随机数
 * @returns 
 */
export function generateRandom() :string{
    return Math.random().toString().slice(2);//随机数
}




/**
 * 精确计算
 */
 function getDigits(num:string) {
	var digits = 0,
		parts = num.toString().split(".");
	if (parts.length === 2) {
		digits = parts[1].length;
	}
	return digits;
}

function toFixed(num:number, digits:number) {
	if (typeof digits == 'undefined') {
		return num;
	}
	return Number(num).toFixed(digits);
}
/**
 * 加法函数
 * arg1：加数；arg2加数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
export function calc_add(arg1:string, arg2:string, digits:number) {
	arg1 = arg1.toString(), arg2 = arg2.toString();
	let maxLen = Math.max(getDigits(arg1), getDigits(arg2)),
		m = Math.pow(10, maxLen),
		result = Number(((parseFloat(arg1) * m + parseFloat(arg2) * m) / m).toFixed(maxLen));
	return toFixed(result, digits);
}
;
/**
 * 减法函数
 * arg1：减数；arg2：被减数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_sub(arg1:string, arg2:string, digits:number) {
	return calc_add(arg1, (Math.abs(parseFloat(arg2)) * -1).toString(), digits);

}
;
/**
 * 乘法函数
 * arg1：乘数；arg2乘数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_multiply(arg1:string, arg2:string, digits:number) {
	// 数字化
	let num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		m = getDigits(num1) + getDigits(num2),
		result = parseFloat(num1.replace(".", "")) * parseFloat(num2.replace(".", "")) / Math.pow(10, m);
        
	return toFixed(result, digits);
}
;
/**
 * 除法函数
 * arg1：除数；arg2被除数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_div(arg1:string, arg2:string, digits:number) {
	// 数字化
	let num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		t1 = getDigits(num1),
		t2 = getDigits(num2),
		result = parseFloat(num1.replace(".", "")) / parseFloat(num2.replace(".", "")) * Math.pow(10, t2 - t1)
	return toFixed(result, digits);
}


/**
 * 获取代码语言
 * @param languageCode
 */
 export function getLanguageClassName(languageCode:string) {
	let language_arr = new Array();
	language_arr.push("lang-xml_language-xml");
	language_arr.push("lang-css_language-css");
	language_arr.push("lang-html_language-html");
	language_arr.push("lang-js_language-javascript");
	language_arr.push("lang-java_language-java");
	language_arr.push("lang-pl_language-perl");
	language_arr.push("lang-py_language-python");
	language_arr.push("lang-rb_language-ruby");
	language_arr.push("lang-go_language-go");
	language_arr.push("lang-cpp_language-cpp");
	language_arr.push("lang-cs_language-cs");
	language_arr.push("lang-bsh_language-bash");
		
	for(let k=0; k<language_arr.length; k++){
		let language = language_arr[k];
		let class_arr = new Array();
		class_arr = language.split('_');
		if(languageCode == class_arr[0]){
			
			return class_arr[1];
		}
	}
	return "language-markup";
}


//校验权限菜单
export function verifyPermissionMenu(url:string,methods:string) {
    const store = useStore();
    const {permissionMenuList:store_permissionMenuList} = storeToRefs(store);

    if(store_permissionMenuList.value != null && store_permissionMenuList.value.length >0){
        for(let i=0; i< store_permissionMenuList.value.length; i++){
            let permissionMenu = store_permissionMenuList.value[i];
            if(permissionMenu.url == url && permissionMenu.methods == methods.toUpperCase() ){
                return true;
            }
        }
    }
    return false;
}