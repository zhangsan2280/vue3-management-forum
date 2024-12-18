<!-- 修改会员卡 -->
<template>
    <div class="main">
        <div class="navbar">
            <el-button type="primary" plain @click="$router.push({path: '/admin/control/membershipCard/list', query:{ page:($route.query.page != undefined ? $route.query.page:'')}})">返回</el-button>
        </div>
        <div class="data-form label-width-blank" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="名称" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="50" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="副标题" :error="error.subtitle">
                    <el-col :span="18"><el-input v-model.trim="state.subtitle" maxlength="50" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                
                <el-form-item label="用户角色" :error="error.userRoleId">
                    <el-radio-group v-model="state.userRoleId">
                        <el-radio :label="roles.id" v-for="roles in state.rolesList">{{roles.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                <div class="table-container membershipCardModule">
                    <el-table ref="specification_table" :data="state.specification.tableList" row-key="key" tooltip-effect="dark" :show-header="false" stripe style="width: 100%" empty-text="没有项">
                        <el-table-column label="表单" >
                            <template #default="scope">	
                                <el-row :gutter="30">
                                    <el-col :span="12">
                                        <el-form-item label="规格名称" :required="true" :error="error.specificationName.get(scope.$index)">
                                            <el-input v-model.trim="state.specification.specificationName[scope.$index]" maxlength="40" :clearable="true" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="启用规格" :error="error.enable.get(scope.$index)">
                                            <el-switch v-model="state.specification.enable[scope.$index]"/>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                
                                <el-form-item label="库存" :required="true" :error="error.stock.get(scope.$index)">
                                    
                                    <el-row v-if="state.specification.stockStatus[scope.$index] == 0">
                                        <div class="singleRowTable">
                                            <div class="leftCell">
                                                <el-input v-model.trim="state.specification.stock[scope.$index]" maxlength="10" :clearable="true" show-word-limit></el-input>
                                            </div>
                                            <div class="rightCell">
                                                <span v-if="state.specification.stockOccupy[scope.$index] != ''">
                                                已出售数量：{{state.specification.stockOccupy[scope.$index]}}
                                            </span>
                                            </div>
                                        </div>
                                    </el-row>
                                    <el-row v-if="state.specification.stockStatus[scope.$index] > 0">
                                        <div class="singleRowTable">
                                            <div class="leftCell">
                                                {{state.specification.stock[scope.$index]}}
                                            </div>
                                            <div class="leftCell" style="margin-left: 20px;width: 100px;">
                                                <el-select v-model="state.specification.symbol[scope.$index]"  no-match-text="还没有符号" placeholder="选择符号">
                                                    <el-option v-for="item in state.specification.stockStatusOptions[scope.$index]" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                                </el-select>
                                            </div>
                                            <div class="leftCell">
                                                <el-input v-model.trim="state.specification.changeStock[scope.$index]" maxlength="10" :clearable="true" show-word-limit></el-input>
                                            </div>
                                            <div class="rightCell">
                                                <span v-if="state.specification.stockOccupy[scope.$index] != ''">
                                                    已出售数量：{{state.specification.stockOccupy[scope.$index]}}
                                                </span>
                                            </div>
                                        </div>
                                    </el-row>
                                </el-form-item>
                                <el-row :gutter="30">
                                    <el-col :span="12">
                                        <el-form-item label="市场价" :error="error.marketPrice.get(scope.$index)">
                                            <el-input v-model.trim="state.specification.marketPrice[scope.$index]" maxlength="10" :clearable="true" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="销售价" :error="error.sellingPrice.get(scope.$index)">
                                            <el-input v-model.trim="state.specification.sellingPrice[scope.$index]" maxlength="10" :clearable="true" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                
                                <el-row :gutter="30">
                                    <el-col :span="12">
                                        <el-form-item label="支付积分" :error="error.point.get(scope.$index)">
                                            <el-input v-model.trim="state.specification.point[scope.$index]" maxlength="10" :clearable="true" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="时长" :required="true" :error="error.duration.get(scope.$index)">
                                            <el-input v-model.trim="state.specification.duration[scope.$index]" maxlength="8" :clearable="true" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4">
                                        <el-form-item :error="error.unit.get(scope.$index)" style="margin-left: -20px;">
                                            <el-select v-model="state.specification.unit[scope.$index]"  no-match-text="还没有单位" placeholder="选择单位">
                                                <el-option v-for="item in state.unitOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="right" width="200">
                            <template #default="scope">	
                                <el-button size="large" :icon="Top" circle @click.prevent="specification_moveUp(scope.row,scope.$index)" title="上移"></el-button>
                                <el-button size="large" :icon="Bottom" circle @click.prevent="specification_moveDown(scope.row,scope.$index)" title="下移"></el-button>
                                <el-button size="large" :icon="Delete" circle @click.prevent="specification_removeItem(scope.row,scope.$index)" title="删除"></el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-form-item label=" ">
                        <div class="item-button" style="margin-left: 10px;"><el-button size="large" :icon="Plus" @click="specification_addItem">添加规格项</el-button></div>
                    </el-form-item>
                    
                </div>
                
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="排序" :required="true" :error="error.sort">
                            <el-col :span="10"><el-input v-model.trim="state.sort" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否上架" :error="error.state">
                        <el-switch v-model="state.upper" ></el-switch>
                    </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-for="(formOption, index) in state.formOptions" label="说明标签"  :prop="'formOptions.' + index + '.value'">
                    <el-col :span="16">
                        <el-input v-model.trim="formOption.value" maxlength="50" :clearable="true" show-word-limit></el-input>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-button size="large" :icon="Top" circle @click.prevent="moveUp(formOption)" title="上移"></el-button>
                        <el-button size="large" :icon="Bottom" circle @click.prevent="moveDown(formOption)" title="下移"></el-button>
                        <el-button size="large" :icon="Delete" circle @click.prevent="removeItem(formOption)" title="删除"></el-button>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <div class="form-error" v-text="error.descriptionTag"></div>
                    <div class="item-button"><el-button size="large" :icon="Plus" @click="addItem">添加说明标签项</el-button></div>
                </el-form-item>
                <el-form-item label="简介" :error="error.introduction">
                    <textarea ref="introductionRef" style="width:99%;height:400px;visibility:hidden;"></textarea>
                </el-form-item>
                    
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
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
    import { ElMessage} from 'element-plus';
    import { processErrorInfo_number } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import { UserRole } from '@/types';
    import { Top, Bottom,Delete,Plus} from '@element-plus/icons-vue'

    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();

    const {fileStorageSystem:store_fileStorageSystem} = storeToRefs(store)

    
    const introductionRef = ref()

    const state = reactive({
        membershipCardId:'',
        rolesList:[] as Array<UserRole>,
        
        name:'',
        subtitle:'',
        userRoleId:'',
        sort:0,
        upper:true,//是否上架

        formOptions: [] as any,
        introductionEditor :{} as any,//简介编辑器
        introductionEditorCreateParameObject :{} as any,//简介编辑器的创建参数
        
        specification :{//规格
            tableList:[] as any,
            specificationId:[] as Array<string>,
            specificationName: [] as Array<string>,
            enable: [] as Array<boolean>,
            stock: [] as Array<string>,
            point: [] as Array<string>,
            marketPrice: [] as Array<string>,
            sellingPrice: [] as Array<string>,
            duration: [] as Array<string>,
            unit: [] as Array<number>,
            
            stockStatus: [] as any,
            stockOccupy: [] as Array<string>,
            changeStock: [] as Array<string>,
            symbol: [] as any,
            stockStatusOptions:[] as any,
        },
        
        unitOptions: [{
            value: 10,
            label: '小时'
        }, {
            value: 20,
            label: '日'
        }, {
            value: 30,
            label: '月'
        }, {
            value: 40,
            label: '年'
        }],

        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name:'',
        subtitle:'',
        userRoleId:'',
        sort:'',
        state:'',
        introduction:'',
        descriptionTag:'',
        
        specificationName:new Map(),
        enable:new Map(),
        stock:new Map(),
        point:new Map(),
        marketPrice:new Map(),
        sellingPrice:new Map(),
        duration:new Map(),
        unit:new Map(),
    });


     //查询修改会员卡
     const queryEditMembershipCard = () => {
        proxy?.$axios({
            url: '/control/membershipCard/manage',
            method: 'get',
            params: {
                method : 'edit',
			    membershipCardId :state.membershipCardId,
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
			    			if(key == "membershipCard"){
			    				let membershipCard = mapData[key];
			    				
			    				state.name = membershipCard.name;
			    				if(membershipCard.subtitle != null){
			    					state.subtitle = membershipCard.subtitle;
			    				}
			    				state.userRoleId = membershipCard.userRoleId;
			    				state.sort = membershipCard.sort;
			    				if(membershipCard.state == 1){
			    					state.upper = true;
			    				}else if(membershipCard.state == 2){
			    					state.upper = false;
			    				}
			    				if(membershipCard.introduction != null){
			    					introductionRef.value.value = membershipCard.introduction;
			    				}
			    				for (let i =0; i<membershipCard.descriptionTagList.length; i++) {  
			    					let descriptionTag = membershipCard.descriptionTagList[i];
			    					let item = {
								    	key: '',
										value: descriptionTag,
						            }
			    				
			    					state.formOptions.push(item);
			    				 
					    			
					    	    }
			    			}else if(key == "specificationList"){
			    				let specificationList = mapData[key];
			    				if(specificationList != null && specificationList.length >0){
			    					for(let i =0; i<specificationList.length; i++){
			    						let specification = specificationList[i];
			    						let key = Math.random().toString().slice(2);
			    						state.specification.specificationId.push(specification.id);
			    						state.specification.specificationName.push(specification.specificationName);
			    						state.specification.enable.push(specification.enable);
			    						state.specification.stock.push(specification.stock);
			    						if(specification.point != null){
			    							state.specification.point.push(specification.point);
			    						}else{
			    							state.specification.point.push("");
			    						}
			    						if(specification.marketPrice != null){
			    							state.specification.marketPrice.push(specification.marketPrice);
			    						}else{
			    							state.specification.marketPrice.push("");
			    						}
			    						if(specification.sellingPrice != null){
			    							state.specification.sellingPrice.push(specification.sellingPrice);
			    						}else{
			    							state.specification.sellingPrice.push("");
			    						}
			    						
			    						state.specification.duration.push(specification.duration);
			    						state.specification.unit.push(specification.unit);
			    						if(specification.stockStatus != null){
			    							state.specification.stockStatus.push(specification.stockStatus);
			    						}else{
			    							state.specification.stockStatus.push("");
			    						}
			    						if(specification.stockOccupy != null){
			    							state.specification.stockOccupy.push(specification.stockOccupy);
			    						}else{
			    							state.specification.stockOccupy.push("");
			    						}
			    						
			    						
			    						let options = [{
			    					    	value: 1,
			    					        label: '增加'
			    					    }, {
			    					        value: 2,
			    					        label: '减少'
			    					    }];
			    						state.specification.stockStatusOptions.push(options);
			    						state.specification.symbol.push(1);
			    						state.specification.changeStock.push("");
			    						
			    						
			    						state.specification.tableList.push({
								        	key: key,
								        });
			    					
			    					}
			    				}
			    			}else if(key == "userRoleList"){
			    				let rolesList = mapData[key];
			    				if(rolesList != null && rolesList.length >0){
			    					for(let i=0; i<rolesList.length; i++){
			    						let roles = rolesList[i];
			    					}
			    				}
			    				state.rolesList = rolesList;
			    			}
			    		}
			    		
			    		
			    		let availableTag = ['source', '|', 'preview', 
			    				        '|', 'justifyleft', 'justifycenter', 'justifyright',
			    				        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
			    				        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 
			    				        'formatblock', 'fontname', 'fontsize','fullscreen', '/', 'forecolor', 'hilitecolor', 'bold',
			    				        'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
			    				         'media','embedVideo','uploadVideo', 'insertfile','emoticons','baidumap', 'table', 'hr',   'pagebreak',
			    				         'link', 'unlink'];
		    			let uploadPath = "control/membershipCard/manage?method=upload";
			    		//创建富文本编辑器
						state.introductionEditor = createEditor(introductionRef.value, availableTag, uploadPath, null,store_fileStorageSystem.value);
						state.introductionEditorCreateParameObject = {
			    				ref:introductionRef.value,
			    				availableTag:availableTag,
			    				uploadPath:uploadPath,
			    				userGradeList:null
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
    
    //规格 添加项
    const specification_addItem = () => {
        state.specification.specificationId.push("");
        state.specification.specificationName.push("");
        state.specification.enable.push(true);
        state.specification.stock.push("");
        state.specification.point.push("");
        state.specification.marketPrice.push("");
        state.specification.sellingPrice.push("");
        state.specification.duration.push("");
        state.specification.unit.push(10);
        
        state.specification.stockStatus.push(0);
        state.specification.stockOccupy.push("");
        state.specification.symbol.push("");
        let options = [{
            value: 1,
            label: '增加'
        }, {
            value: 2,
            label: '减少'
        }];
        state.specification.stockStatusOptions.push(options);
        state.specification.changeStock.push("");
        
        state.specification.tableList.push({
            key: Math.random().toString().slice(2),//随机数
        });
    }
    //上移
    const specification_moveUp = (row:any,index:any) => {
        if (index >0) {
            let upData = state.specification.tableList[index - 1];
            state.specification.tableList.splice(index - 1, 1);
            state.specification.tableList.splice(index, 0, upData);
            
            
            let specificationId_upData = state.specification.specificationId[index - 1];
            state.specification.specificationId.splice(index - 1, 1);
            state.specification.specificationId.splice(index, 0, specificationId_upData);
            
            let specificationName_upData = state.specification.specificationName[index - 1];
            state.specification.specificationName.splice(index - 1, 1);
            state.specification.specificationName.splice(index, 0, specificationName_upData);
            
            let enable_upData = state.specification.enable[index - 1];
            state.specification.enable.splice(index - 1, 1);
            state.specification.enable.splice(index, 0, enable_upData);
            
            let stock_upData = state.specification.stock[index - 1];
            state.specification.stock.splice(index - 1, 1);
            state.specification.stock.splice(index, 0, stock_upData);
            
            let point_upData = state.specification.point[index - 1];
            state.specification.point.splice(index - 1, 1);
            state.specification.point.splice(index, 0, point_upData);
            
            let marketPrice_upData = state.specification.marketPrice[index - 1];
            state.specification.marketPrice.splice(index - 1, 1);
            state.specification.marketPrice.splice(index, 0, marketPrice_upData);
            
            let sellingPrice_upData = state.specification.sellingPrice[index - 1];
            state.specification.sellingPrice.splice(index - 1, 1);
            state.specification.sellingPrice.splice(index, 0, sellingPrice_upData);
            
            let duration_upData = state.specification.duration[index - 1];
            state.specification.duration.splice(index - 1, 1);
            state.specification.duration.splice(index, 0, duration_upData);
            
            let unit_upData = state.specification.unit[index - 1];
            state.specification.unit.splice(index - 1, 1);
            state.specification.unit.splice(index, 0, unit_upData);
            
            let stockStatus_upData = state.specification.stockStatus[index - 1];
            state.specification.stockStatus.splice(index - 1, 1);
            state.specification.stockStatus.splice(index, 0, stockStatus_upData);
            
            let stockOccupy_upData = state.specification.stockOccupy[index - 1];
            state.specification.stockOccupy.splice(index - 1, 1);
            state.specification.stockOccupy.splice(index, 0, stockOccupy_upData);
            
            let changeStock_upData = state.specification.changeStock[index - 1];
            state.specification.changeStock.splice(index - 1, 1);
            state.specification.changeStock.splice(index, 0, changeStock_upData);
            
            let symbol_upData = state.specification.symbol[index - 1];
            state.specification.symbol.splice(index - 1, 1);
            state.specification.symbol.splice(index, 0, symbol_upData);
            
            let stockStatusOptions_upData = state.specification.stockStatusOptions[index - 1];
            state.specification.stockStatusOptions.splice(index - 1, 1);
            state.specification.stockStatusOptions.splice(index, 0, stockStatusOptions_upData);
        
            
            //错误信息移动
            let up_specificationName_error = error.specificationName.get(index - 1);
            let current_specificationName_error = error.specificationName.get(index);
            error.specificationName.delete(index - 1);
            error.specificationName.delete(index);
            if(up_specificationName_error != null){
                error.specificationName.set(index,up_specificationName_error);
            }
            if(current_specificationName_error != null){
                error.specificationName.set(index - 1,current_specificationName_error);
            }
            
            let up_enable_error = error.enable.get(index - 1);
            let current_enable_error = error.enable.get(index);
            error.enable.delete(index - 1);
            error.enable.delete(index);
            if(up_enable_error != null){
                error.enable.set(index,up_enable_error);
            }
            if(current_enable_error != null){
                error.enable.set(index - 1,current_enable_error);
            }
            
            let up_stock_error = error.stock.get(index - 1);
            let current_stock_error = error.stock.get(index);
            error.stock.delete(index - 1);
            error.stock.delete(index);
            if(up_stock_error != null){
                error.stock.set(index,up_stock_error);
            }
            if(current_stock_error != null){
                error.stock.set(index - 1,current_stock_error);
            }
            
            let up_point_error = error.point.get(index - 1);
            let current_point_error = error.point.get(index);
            error.point.delete(index - 1);
            error.point.delete(index);
            if(up_point_error != null){
                error.point.set(index,up_point_error);
            }
            if(current_point_error != null){
                error.point.set(index - 1,current_point_error);
            }
            
            let up_marketPrice_error = error.marketPrice.get(index - 1);
            let current_marketPrice_error = error.marketPrice.get(index);
            error.marketPrice.delete(index - 1);
            error.marketPrice.delete(index);
            if(up_marketPrice_error != null){
                error.marketPrice.set(index,up_marketPrice_error);
            }
            if(current_marketPrice_error != null){
                error.marketPrice.set(index - 1,current_marketPrice_error);
            }
            
            let up_sellingPrice_error = error.sellingPrice.get(index - 1);
            let current_sellingPrice_error = error.sellingPrice.get(index);
            error.sellingPrice.delete(index - 1);
            error.sellingPrice.delete(index);
            if(up_sellingPrice_error != null){
                error.sellingPrice.set(index,up_sellingPrice_error);
            }
            if(current_sellingPrice_error != null){
                error.sellingPrice.set(index - 1,current_sellingPrice_error);
            }
            
            let up_duration_error = error.duration.get(index - 1);
            let current_duration_error = error.duration.get(index);
            error.duration.delete(index - 1);
            error.duration.delete(index);
            if(up_duration_error != null){
                error.duration.set(index,up_duration_error);
            }
            if(current_duration_error != null){
                error.duration.set(index - 1,current_duration_error);
            }
            
            let up_unit_error = error.unit.get(index - 1);
            let current_unit_error = error.unit.get(index);
            error.unit.delete(index - 1);
            error.unit.delete(index);
            if(up_unit_error != null){
                error.unit.set(index,up_unit_error);
            }
            if(current_unit_error != null){
                error.unit.set(index - 1,current_unit_error);
            }
        }
    }
    //下移
    const specification_moveDown = (row:any,index:any) => {
        if ((index + 1) < state.specification.tableList.length) {
            let downData = state.specification.tableList[index + 1];
            state.specification.tableList.splice(index + 1, 1);
            state.specification.tableList.splice(index, 0, downData);
        
            
            let specificationId_downData = state.specification.specificationId[index + 1];
            state.specification.specificationId.splice(index + 1, 1);
            state.specification.specificationId.splice(index, 0, specificationId_downData);
            
            let specificationName_downData = state.specification.specificationName[index + 1];
            state.specification.specificationName.splice(index + 1, 1);
            state.specification.specificationName.splice(index, 0, specificationName_downData);
            
            let enable_downData = state.specification.enable[index + 1];
            state.specification.enable.splice(index + 1, 1);
            state.specification.enable.splice(index, 0, enable_downData);
            
            let stock_downData = state.specification.stock[index + 1];
            state.specification.stock.splice(index + 1, 1);
            state.specification.stock.splice(index, 0, stock_downData);
            
            let point_downData = state.specification.point[index + 1];
            state.specification.point.splice(index + 1, 1);
            state.specification.point.splice(index, 0, point_downData);
            
            let marketPrice_downData = state.specification.marketPrice[index + 1];
            state.specification.marketPrice.splice(index + 1, 1);
            state.specification.marketPrice.splice(index, 0, marketPrice_downData);
            
            let sellingPrice_downData = state.specification.sellingPrice[index + 1];
            state.specification.sellingPrice.splice(index + 1, 1);
            state.specification.sellingPrice.splice(index, 0, sellingPrice_downData);
            
            let duration_downData = state.specification.duration[index + 1];
            state.specification.duration.splice(index + 1, 1);
            state.specification.duration.splice(index, 0, duration_downData);
            
            let unit_downData = state.specification.unit[index + 1];
            state.specification.unit.splice(index + 1, 1);
            state.specification.unit.splice(index, 0, unit_downData);
            
            let stockStatus_downData = state.specification.stockStatus[index + 1];
            state.specification.stockStatus.splice(index + 1, 1);
            state.specification.stockStatus.splice(index, 0, stockStatus_downData);
            
            let stockOccupy_downData = state.specification.stockOccupy[index + 1];
            state.specification.stockOccupy.splice(index + 1, 1);
            state.specification.stockOccupy.splice(index, 0, stockOccupy_downData);
            
            let changeStock_downData = state.specification.changeStock[index + 1];
            state.specification.changeStock.splice(index + 1, 1);
            state.specification.changeStock.splice(index, 0, changeStock_downData);
            
            let symbol_downData = state.specification.symbol[index + 1];
            state.specification.symbol.splice(index + 1, 1);
            state.specification.symbol.splice(index, 0, symbol_downData);
            
            let stockStatusOptions_downData = state.specification.stockStatusOptions[index + 1];
            state.specification.stockStatusOptions.splice(index + 1, 1);
            state.specification.stockStatusOptions.splice(index, 0, stockStatusOptions_downData);
            
            
            
            //错误信息移动
            let down_specificationName_error = error.specificationName.get(index + 1);
            let current_specificationName_error = error.specificationName.get(index);
            error.specificationName.delete(index + 1);
            error.specificationName.delete(index);
            if(down_specificationName_error != null){
                error.specificationName.set(index,down_specificationName_error);
            }
            if(current_specificationName_error != null){
                error.specificationName.set(index + 1,current_specificationName_error);
            }
            
            let down_enable_error = error.enable.get(index + 1);
            let current_enable_error = error.enable.get(index);
            error.enable.delete(index + 1);
            error.enable.delete(index);
            if(down_enable_error != null){
                error.enable.set(index,down_enable_error);
            }
            if(current_enable_error != null){
                error.enable.set(index + 1,current_enable_error);	
            }
            
            let down_stock_error = error.stock.get(index + 1);
            let current_stock_error = error.stock.get(index);
            error.stock.delete(index + 1);
            error.stock.delete(index);
            if(down_stock_error != null){
                error.stock.set(index,down_stock_error);
            }
            if(current_stock_error != null){
                error.stock.set(index + 1,current_stock_error);
            }
            
            let down_point_error = error.point.get(index + 1);
            let current_point_error = error.point.get(index);
            error.point.delete(index + 1);
            error.point.delete(index);
            if(down_point_error != null){
                error.point.set(index,down_point_error);
            }
            if(current_point_error != null){
                error.point.set(index + 1,current_point_error);
            }
            
            let down_marketPrice_error = error.marketPrice.get(index + 1);
            let current_marketPrice_error = error.marketPrice.get(index);
            error.marketPrice.delete(index + 1);
            error.marketPrice.delete(index);
            if(down_marketPrice_error != null){
                error.marketPrice.set(index,down_marketPrice_error);
            }
            if(current_marketPrice_error != null){
                error.marketPrice.set(index + 1,current_marketPrice_error);
            }
            
            let down_sellingPrice_error = error.sellingPrice.get(index + 1);
            let current_sellingPrice_error = error.sellingPrice.get(index);
            error.sellingPrice.delete(index + 1);
            error.sellingPrice.delete(index);
            if(down_sellingPrice_error != null){
                error.sellingPrice.set(index,down_sellingPrice_error);
            }
            if(current_sellingPrice_error != null){
                error.sellingPrice.set(index + 1,current_sellingPrice_error);
            }
            
            let down_duration_error = error.duration.get(index + 1);
            let current_duration_error = error.duration.get(index);
            error.duration.delete(index + 1);
            error.duration.delete(index);
            if(down_duration_error != null){
                error.duration.set(index,down_duration_error);
            }
            if(current_duration_error != null){
                error.duration.set(index + 1,current_duration_error);
            }
            
            let down_unit_error = error.unit.get(index + 1);
            let current_unit_error = error.unit.get(index);
            error.unit.delete(index + 1);
            error.unit.delete(index);
            if(down_unit_error != null){
                error.unit.set(index,down_unit_error);
            }
            if(current_unit_error != null){
                error.unit.set(index + 1,current_unit_error);
            }
        }
    
    }
    //规格  删除
    const specification_removeItem = (row:any,index:any) => {
        state.specification.tableList.splice(index, 1);

        state.specification.specificationId.splice(index, 1);
        state.specification.specificationName.splice(index, 1);
        state.specification.enable.splice(index, 1);
        state.specification.stock.splice(index, 1);
        state.specification.point.splice(index, 1);
        state.specification.marketPrice.splice(index, 1);
        state.specification.sellingPrice.splice(index, 1);
        state.specification.duration.splice(index, 1);
        state.specification.unit.splice(index, 1);
        
        state.specification.stockStatus.splice(index, 1);
        state.specification.stockOccupy.splice(index, 1);
        state.specification.changeStock.splice(index, 1);
        state.specification.symbol.splice(index, 1);
        state.specification.stockStatusOptions.splice(index, 1);
    }

    
    //说明标签 添加项
    const addItem = () => {
        state.formOptions.push({
            key: '',
            value: ''
        });
    }
    //说明标签 删除项
    const removeItem = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if (index !== -1) {
            state.formOptions.splice(index, 1);
        }
    }
    //说明标签 上移
    const moveUp = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if (index >0) {
            let upData = state.formOptions[index - 1];
            state.formOptions.splice(index - 1, 1);
            state.formOptions.splice(index, 0, upData);
        }
    }
    //说明标签 下移
    const moveDown = (formOption:any) => {
        let index = state.formOptions.indexOf(formOption);
        if ((index + 1) < state.formOptions.length) {
            let downData = state.formOptions[index + 1];
            state.formOptions.splice(index + 1, 1);
            state.formOptions.splice(index, 0, downData);
        }
    }
	    

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        //清空error的属性值
        for (const [key, value] of Object.entries(error) as [string, string|Map<string,string>][]){
            if(value instanceof Map){
                value.clear();
            }else{
                Object.assign(error, {[key] : ''});
            }
        }


        let formData = new FormData();
        formData.append('membershipCardId', state.membershipCardId);
        formData.append('name', state.name);
        formData.append('subtitle', state.subtitle);
        formData.append('userRoleId',state.userRoleId);

        formData.append('sort', String(state.sort));
        if(state.upper == true){//上架
            formData.append('state', String(1));
            
        }else{//下架
            formData.append('state', String(2));
        }
        
        for(let i=0; i<state.specification.tableList.length; i++){
            let table = state.specification.tableList[i];

            let specificationId = state.specification.specificationId[i];
            let specificationName = state.specification.specificationName[i];
            let enable = state.specification.enable[i];
            let stock = state.specification.stock[i];
            let point = state.specification.point[i];
            let marketPrice = state.specification.marketPrice[i];
            let sellingPrice = state.specification.sellingPrice[i];
            let duration = state.specification.duration[i];
            let unit = state.specification.unit[i];
            
            let stockStatus = state.specification.stockStatus[i];
            let symbol = state.specification.symbol[i];
            let changeStock =state.specification.changeStock[i];
            
            formData.append('specificationRowTable', String(i));
            formData.append('specificationId', specificationId);
            formData.append('specificationName', specificationName);
            formData.append('enable', enable.toString());
            formData.append('stock', stock);
            formData.append('point', point);
            formData.append('marketPrice', marketPrice);
            formData.append('sellingPrice', sellingPrice);
            formData.append('duration', duration);
            formData.append('unit', String(unit));
            
            if(stockStatus == 0){
                formData.append('stockStatus', stockStatus);
                
                
            }else{
                formData.append('stockStatus', String(symbol));
            }
            formData.append('changeStock', changeStock);
        }
        
        
        if(state.formOptions != null && state.formOptions.length >0){
            for(let i=0; i<state.formOptions.length; i++){
                let formOption = state.formOptions[i];
                formData.append('descriptionTag', formOption.value);
                
            }
        }
        if(introductionRef.value.value != null && introductionRef.value.value !=''){
            formData.append('introduction', introductionRef.value.value);
        }

        proxy?.$axios({
            url: '/control/membershipCard/manage?method=edit',
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
							path : '/admin/control/membershipCard/list',
							query:{ page:(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:'')}
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo_number(returnValue.data as Map<string,string> , error,()=>{});

			    		
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

        if(router.currentRoute.value.query.membershipCardId != undefined && router.currentRoute.value.query.membershipCardId != ''){
			state.membershipCardId = router.currentRoute.value.query.membershipCardId as string;
		}
		
		queryEditMembershipCard();
    }) 

    //keep-alive 进入时
    onActivated (()=>{
        if (Object.keys(state.introductionEditorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.introductionEditor = createEditor(
				state.introductionEditorCreateParameObject.ref, 
				state.introductionEditorCreateParameObject.availableTag, 
				state.introductionEditorCreateParameObject.uploadPath, 
				state.introductionEditorCreateParameObject.userGradeList,
                store_fileStorageSystem.value
			);
		}
    })

    // keep-alive 离开时
    onDeactivated (()=>{
        if (Object.keys(state.introductionEditor).length != 0) {//不等于空
            state.introductionEditor.remove();
            state.introductionEditor = {};
        }
    })

</script>