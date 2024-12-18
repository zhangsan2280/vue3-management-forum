<!-- 添加版块 -->
<template>
    <div class="main" >
        <div class="nav-breadcrumb">
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item :to="{ path: '/admin/control/template/list' }">模板列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/control/layout/list',query:{ dirName : $route.query.dirName} }">布局列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/control/forum/list',query:{ layoutId : $route.query.layoutId,dirName : $route.query.dirName} }">版块列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{state.templates.name}} [{{state.templates.dirName}}] [{{state.layout.name}}]</el-breadcrumb-item>
                <el-breadcrumb-item>添加版块</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="data-form label-width-blank forumModule" >
            <el-form label-width="auto"  @submit.native.prevent>
                <el-form-item label="版块类型" :required="true" :error="error.forumType">
                    <el-select v-model="state.forumType" @change="selectedForumType" placeholder="选择类型">
                        <el-option v-for="item in state.forumTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select class="placeholder" v-model="state.forumChildType" placeholder="选择子类型">
                        <el-option v-for="item in state.forumChildTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版块标题" :required="true" :error="error.name">
                    <el-col :span="18"><el-input v-model.trim="state.name" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="版块模板" :required="true" :error="error.module">
                    <el-select v-model="state.module" @change="selectedModule" placeholder="选择模板" style="width: 100%">
                        <el-option v-for="item in state.moduleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调用方式" :required="true" :error="error.invokeMethod">
                    <el-radio-group v-model="state.invokeMethod" :disabled="(state.layout.type == 4 && state.layout.returnData == 1) || state.layout.type == 6">
                        <el-radio :label="1">引用代码</el-radio>
                        <el-radio :label="2">调用对象</el-radio>
                    </el-radio-group>
                    <div class="form-help" v-if="(state.layout.type == 4 && state.layout.returnData == 1) || state.layout.type == 6">空白页json方式返回数据或公共页(引用版块值) 这两种布局方式不能选择'调用对象'</div>
                </el-form-item>
                

                
                <!-- 话题部分--话题列表  分页-->
                <div v-if="state.forumType == '话题' && state.forumChildType == '话题列表' && state.displayType == '分页'">
                    <el-form-item label="选择标签" :error="error.page_Forum_TopicRelated_Topic.page_topic_tagId">
                        <el-select v-model="state.page_Forum_TopicRelated_Topic.tagIdGroup" size="large" v-show="state.page_Forum_TopicRelated_Topic.page_topic_tag_transferPrameter == false" @change="selectedTopicTag" @focus="loadTopicTag" multiple no-match-text="还没有标签" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_TopicRelated_Topic.tagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-switch class="placeholder" v-model="state.page_Forum_TopicRelated_Topic.page_topic_tag_transferPrameter" active-text="传递标签参数"/>
                    </el-form-item>
                    <el-form-item label="排序" :required="true" :error="error.page_Forum_TopicRelated_Topic.page_topic_sort">
                        <el-select v-model="state.page_Forum_TopicRelated_Topic.page_topic_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_TopicRelated_Topic.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页显示记录数" :error="error.page_Forum_TopicRelated_Topic.page_topic_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_TopicRelated_Topic.page_topic_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="页码显示总数" :error="error.page_Forum_TopicRelated_Topic.page_topic_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_TopicRelated_Topic.page_topic_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>

                <!-- 评论部分--评论列表  分页-->
                <div v-if="state.forumType == '话题' && state.forumChildType == '评论列表' && state.displayType == '分页'">
                    <el-form-item label="排序" :required="true" :error="error.page_Forum_CommentRelated_Comment.page_comment_sort">
                        <el-select v-model="state.page_Forum_CommentRelated_Comment.page_comment_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_CommentRelated_Comment.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页显示记录数" :error="error.page_Forum_CommentRelated_Comment.page_comment_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_CommentRelated_Comment.page_comment_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="页码显示总数" :error="error.page_Forum_CommentRelated_Comment.page_comment_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_CommentRelated_Comment.page_comment_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>
                <!-- 话题部分--相似话题  集合-->
                <div v-if="state.forumType == '话题' && state.forumChildType == '相似话题' && state.displayType == '集合'">
                    <el-form-item label="显示记录数" :error="error.collection_Forum_TopicRelated_LikeTopic.collection_likeTopic_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.collection_Forum_TopicRelated_LikeTopic.collection_likeTopic_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>
                <!-- 话题部分--热门话题  集合-->
                <div v-if="state.forumType == '话题' && state.forumChildType == '热门话题' && state.displayType == '集合'">
                    <el-form-item label="显示记录数" :error="error.collection_Forum_TopicRelated_HotTopic.collection_hotTopic_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.collection_Forum_TopicRelated_HotTopic.collection_hotTopic_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>

                <!-- 问题部分--问题列表  分页-->
                <div v-if="state.forumType == '问答' && state.forumChildType == '问题列表' && state.displayType == '分页'">
                    <el-form-item label="选择标签" :error="error.page_Forum_QuestionRelated_Question.page_question_tagId">
                        <el-select ref="page_question_tag_ref" size="large" v-model="state.page_Forum_QuestionRelated_Question.tagIdGroup" v-show="state.page_Forum_QuestionRelated_Question.page_question_tag_transferPrameter == false" @focus="loadQuestionTag" multiple placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_QuestionRelated_Question.tagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-switch class="placeholder" v-model="state.page_Forum_QuestionRelated_Question.page_question_tag_transferPrameter" active-text="传递标签参数"/>
                    </el-form-item>
                    <el-form-item label="过滤条件">
                        <el-select v-model="state.page_Forum_QuestionRelated_Question.page_question_filterCondition" v-show="state.page_Forum_QuestionRelated_Question.page_question_filterCondition_transferPrameter == false" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_QuestionRelated_Question.filterConditionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-switch class="placeholder" v-model="state.page_Forum_QuestionRelated_Question.page_question_filterCondition_transferPrameter" active-text="传递过滤参数"/>
                    </el-form-item>
                    <div class="form-help" >选择'传递过滤参数'时接收参数字段为filterCondition，全部：值为空或10 &nbsp; 未解决：20 &nbsp; 已解决：30 &nbsp; 积分悬赏：40 &nbsp; 现金悬赏：50</div>
                
                    <el-form-item label="排序" :error="error.page_Forum_QuestionRelated_Question.page_question_sort">
                        <el-select v-model="state.page_Forum_QuestionRelated_Question.page_question_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_QuestionRelated_Question.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页显示记录数" :error="error.page_Forum_QuestionRelated_Question.page_question_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_QuestionRelated_Question.page_question_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="页码显示总数" :error="error.page_Forum_QuestionRelated_Question.page_question_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_QuestionRelated_Question.page_question_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    
                    
                    <el-dialog title="选择标签" v-model="state.page_Forum_QuestionRelated_Question.question_tag_form">
                        <div class="dialog-nav-breadcrumb">
                            <el-breadcrumb :separator-icon="ArrowRight">
                                <el-breadcrumb-item @click="queryQuestionTag(1,'')">全部标签</el-breadcrumb-item>
                                <el-breadcrumb-item v-for="(value, key) in state.page_Forum_QuestionRelated_Question.navigation" @click="queryQuestionTag(1,String(key))">{{value}}</el-breadcrumb-item>
                                
                            </el-breadcrumb>
                        </div>
                        <div class="dialog-data-table" >
                            <el-table :data="state.page_Forum_QuestionRelated_Question.tableData" @cell-click="cellExpandRow_questionTag" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                                <el-table-column label="选择" align="right" width="50">
                                    <template #default="scope">
                                        <el-radio v-model="state.page_Forum_QuestionRelated_Question.page_question_tagId" v-if="scope.row.childNodeNumber ==0" :label="state.page_Forum_QuestionRelated_Question.tagIdList[scope.$index]" >&nbsp;</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column label="标签名称">
                                    <template #default="scope">
                                        <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                                        <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper" v-if="state.page_Forum_QuestionRelated_Question.isShowPage">
                                <el-pagination background  @current-change="questionTagPage" :current-page="state.page_Forum_QuestionRelated_Question.currentpage"  :page-size="state.page_Forum_QuestionRelated_Question.maxresult" layout="total, prev, pager, next,jumper" :total="state.page_Forum_QuestionRelated_Question.totalrecord"></el-pagination>
                            </div>
                        </div>
                    </el-dialog>
                </div>
                <!-- 答案部分--答案列表  分页-->
                <div v-if="state.forumType == '问答' && state.forumChildType == '答案列表' && state.displayType == '分页'">
                    <el-form-item label="排序" :required="true" :error="error.page_Forum_AnswerRelated_Answer.page_answer_sort">
                        <el-select v-model="state.page_Forum_AnswerRelated_Answer.page_answer_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_AnswerRelated_Answer.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页显示记录数" :error="error.page_Forum_AnswerRelated_Answer.page_answer_maxResult" >
                       <el-col :span="8"><el-input v-model.trim="state.page_Forum_AnswerRelated_Answer.page_answer_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="页码显示总数" :error="error.page_Forum_AnswerRelated_Answer.page_answer_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_AnswerRelated_Answer.page_answer_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>
                <!-- 问题部分--相似问题  集合-->
                <div v-if="state.forumType == '问答' && state.forumChildType == '相似问题' && state.displayType == '集合'">
                    <el-form-item label="显示记录数" :error="error.collection_Forum_QuestionRelated_LikeQuestion.collection_likeQuestion_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.collection_Forum_QuestionRelated_LikeQuestion.collection_likeQuestion_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>
                <!-- 红包部分--领取红包用户列表 分页 -->
                <div v-if="state.forumType == '红包' && state.forumChildType == '领取红包用户列表' && state.displayType == '分页'">
                    <el-form-item label="排序" :required="true" :error="error.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_sort">
                        <el-select v-model="state.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="显示记录数" :error="error.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                </div>
                <!-- 广告部分--图片广告 集合 -->
                <div v-if="state.forumType == '广告' && state.forumChildType == '图片广告' && state.displayType == '集合'" class="table-container">
                    <el-table ref="collection_Forum_AdvertisingRelated_imageList_table" :data="state.collection_Forum_AdvertisingRelated_imageList.tableList" row-key="key" tooltip-effect="dark" :show-header="false" stripe style="width: 100%" empty-text="没有项">
                        <el-table-column label="表单">
                            <template #default="scope">	
                                

                                <el-form-item label="图片名称" :required="true" :error="error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.get(scope.$index)">
                                    <el-input v-model.trim="state.collection_Forum_AdvertisingRelated_imageList.collection_image_name[scope.$index]" maxlength="40" :clearable="true" show-word-limit></el-input>
                                </el-form-item>
                                <el-form-item label="图片链接" :error="error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.get(scope.$index)">
                                    <el-input v-model.trim="state.collection_Forum_AdvertisingRelated_imageList.collection_image_link[scope.$index]" maxlength="200" :clearable="true" show-word-limit></el-input>
                                </el-form-item>
                                <el-form-item label="图片" :error="error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.get(scope.$index)" >
                                     <el-upload action="#" v-model:file-list="state.collection_Forum_AdvertisingRelated_imageList.uploadImgs[scope.$index]" list-type="picture-card" :auto-upload="false" :on-change="(file: UploadFile, fileList:UploadUserFile[]) => {advertising_imageList_handleChange(file, fileList, scope.row.key)}" :accept="'image/*'">
                                    
                                        <el-icon><Plus /></el-icon>
                                        <template #file="{ file }">
                                            <div>
                                                <!-- 因为移动el-upload时回显ile.url会发生错误，所以url地址转为base64格式图片  -->
                                                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                                <span class="el-upload-list__item-actions">
                                                <span
                                                    class="el-upload-list__item-preview"
                                                    @click="advertising_imageList_openImagePreview(file)"
                                                >
                                                    <el-icon><zoom-in /></el-icon>
                                                </span>
                                                <span
                                                    class="el-upload-list__item-delete"
                                                    @click="advertising_imageList_handleImageRemove(file,state.collection_Forum_AdvertisingRelated_imageList.uploadImgs[scope.$index])"
                                                >
                                                    <el-icon><Delete /></el-icon>
                                                </span>
                                                </span>
                                            </div>
                                        </template>
                                    </el-upload>


                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="right" width="200">
                            <template #default="scope">	
                                <el-button size="large" :icon="Top" circle @click.prevent="collection_Forum_AdvertisingRelated_imageList_moveUp(scope.row,scope.$index)" title="上移"></el-button>
                                <el-button size="large" :icon="Bottom" circle @click.prevent="collection_Forum_AdvertisingRelated_imageList_moveDown(scope.row,scope.$index)" title="下移"></el-button>
                                <el-button size="large" :icon="Delete" circle @click.prevent="collection_Forum_AdvertisingRelated_imageList_removeItem(scope.row,scope.$index)" title="删除"></el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>

                    <el-form-item  label=" ">
                        <div class="item-button"><el-button size="large" :icon="Plus" @click="advertising_imageList_addItem">添加项</el-button></div>
                         <!-- 图片预览 -->
                         <el-image-viewer v-if="state.collection_Forum_AdvertisingRelated_imageList.isImageViewer" @close="advertising_imageList_closeImagePreview" :url-list="[state.collection_Forum_AdvertisingRelated_imageList.localImageUrl]" hide-on-click-modal/>
                    </el-form-item>
                    
                </div>

                <!-- 在线帮助部分--在线帮助列表  单层-->
                <div v-if="state.forumType == '在线帮助' && state.forumChildType == '在线帮助列表' && state.displayType == '单层'">
                    <el-form-item label="选择分类" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_helpTypeId">
                        <el-select ref="monolayer_helpType_ref" v-model="state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup" v-if="state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpType_transferPrameter == false" @focus="load_monolayer_helpType" multiple placeholder="请选择">
                            <el-option v-for="item in state.monolayer_Forum_HelpRelated_Help.helpTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-switch class="placeholder" v-model="state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpType_transferPrameter" active-text="传递分类参数"/>
                    </el-form-item>
                    <el-form-item label="展示数量" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_quantity" >
                        <el-col :span="8"><el-input v-model.trim="state.monolayer_Forum_HelpRelated_Help.monolayer_help_quantity" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="更多" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_more">
                        <el-select v-model="state.monolayer_Forum_HelpRelated_Help.monolayer_help_more" placeholder="请选择">
                            <el-option v-for="item in state.monolayer_Forum_HelpRelated_Help.moreOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="'更多'每页显示记录数" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.monolayer_Forum_HelpRelated_Help.monolayer_help_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="'更多'页码显示总数" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.monolayer_Forum_HelpRelated_Help.monolayer_help_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="排序" :error="error.monolayer_Forum_HelpRelated_Help.monolayer_help_sort">
                        <el-select v-model="state.monolayer_Forum_HelpRelated_Help.monolayer_help_sort" placeholder="请选择">
                            <el-option v-for="item in state.monolayer_Forum_HelpRelated_Help.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    
                    <el-dialog title="选择分类" v-model="state.monolayer_Forum_HelpRelated_Help.helpType_form">
                        <div class="dialog-nav-breadcrumb">
                            <el-breadcrumb :separator-icon="ArrowRight">
                                <el-breadcrumb-item @click="query_monolayer_helpType(1,'')">全部标签</el-breadcrumb-item>
                                <el-breadcrumb-item v-for="(value, key) in state.monolayer_Forum_HelpRelated_Help.navigation" @click="query_monolayer_helpType(1,String(key))">{{value}}</el-breadcrumb-item>
                                
                            </el-breadcrumb>
                        </div>
                        <div class="dialog-data-table" >
                            <el-table :data="state.monolayer_Forum_HelpRelated_Help.tableData" @cell-click="cellExpandRow_monolayer_helpType" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                                <el-table-column label="选择" align="right" width="50">
                                    <template #default="scope">
                                        <el-radio v-model="state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpTypeId" v-if="scope.row.childNodeNumber ==0" :label="state.monolayer_Forum_HelpRelated_Help.helpTypeIdList[scope.$index]" >&nbsp;</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column label="分类名称">
                                    <template #default="scope">
                                        <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                                        <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper" v-if="state.monolayer_Forum_HelpRelated_Help.isShowPage">
                                <el-pagination background  @current-change="monolayer_helpTypePage" :current-page="state.monolayer_Forum_HelpRelated_Help.currentpage"  :page-size="state.monolayer_Forum_HelpRelated_Help.maxresult" layout="total, prev, pager, next,jumper" :total="state.monolayer_Forum_HelpRelated_Help.totalrecord"></el-pagination>
                            </div>
                        </div>
                    </el-dialog>
                </div>
                <!-- 在线帮助部分--在线帮助列表  分页-->
                <div v-if="state.forumType == '在线帮助' && state.forumChildType == '在线帮助列表' && state.displayType == '分页'">
                    <el-form-item label="选择分类" :error="error.page_Forum_HelpRelated_Help.page_help_helpTypeId">
                        <el-select ref="page_helpType_ref" v-model="state.page_Forum_HelpRelated_Help.helpTypeIdGroup" v-if="state.page_Forum_HelpRelated_Help.page_help_helpType_transferPrameter == false" @focus="load_page_helpType" multiple placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_HelpRelated_Help.helpTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-switch class="placeholder" v-model="state.page_Forum_HelpRelated_Help.page_help_helpType_transferPrameter" active-text="传递分类参数"/>
                    </el-form-item>
                    <el-form-item label="排序" :error="error.page_Forum_HelpRelated_Help.page_help_sort">
                        <el-select v-model="state.page_Forum_HelpRelated_Help.page_help_sort" placeholder="请选择">
                            <el-option v-for="item in state.page_Forum_HelpRelated_Help.sortOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每页显示记录数" :error="error.page_Forum_HelpRelated_Help.page_help_maxResult" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_HelpRelated_Help.page_help_maxResult" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    <el-form-item label="页码显示总数" :error="error.page_Forum_HelpRelated_Help.page_help_pageCount" >
                        <el-col :span="8"><el-input v-model.trim="state.page_Forum_HelpRelated_Help.page_help_pageCount" maxlength="9" :clearable="true" show-word-limit></el-input></el-col>
                    </el-form-item>
                    
                    
                    
                    <el-dialog title="选择分类" v-model="state.page_Forum_HelpRelated_Help.helpType_form">
                        <div class="dialog-nav-breadcrumb">
                            <el-breadcrumb :separator-icon="ArrowRight">
                                <el-breadcrumb-item @click="query_page_helpType(1,'')">全部标签</el-breadcrumb-item>
                                <el-breadcrumb-item v-for="(value, key) in state.page_Forum_HelpRelated_Help.navigation" @click="query_page_helpType(1,String(key))">{{value}}</el-breadcrumb-item>
                                
                            </el-breadcrumb>
                        </div>
                        <div class="dialog-data-table" >
                            <el-table :data="state.page_Forum_HelpRelated_Help.tableData" @cell-click="cellExpandRow_page_helpType" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                                <el-table-column label="选择" align="right" width="50">
                                    <template #default="scope">
                                        <el-radio v-model="state.page_Forum_HelpRelated_Help.page_help_helpTypeId" v-if="scope.row.childNodeNumber ==0" :label="state.page_Forum_HelpRelated_Help.helpTypeIdList[scope.$index]" >&nbsp;</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column label="分类名称">
                                    <template #default="scope">
                                    <el-icon class="icon icon-folder" v-if="scope.row.childNodeNumber >0"><Folder /></el-icon>
                                    <el-icon class="icon icon-file" v-if="scope.row.childNodeNumber ==0"><Document /></el-icon>{{scope.row.name}}
                                </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper" v-if="state.page_Forum_HelpRelated_Help.isShowPage">
                                <el-pagination background  @current-change="page_helpTypePage" :current-page="state.page_Forum_HelpRelated_Help.currentpage"  :page-size="state.page_Forum_HelpRelated_Help.maxresult" layout="total, prev, pager, next,jumper" :total="state.page_Forum_HelpRelated_Help.totalrecord"></el-pagination>
                            </div>
                        </div>
                    </el-dialog>
                </div>
                
                <!-- 在线帮助部分--推荐在线帮助  集合-->
                <div v-if="state.forumType == '在线帮助' && state.forumChildType == '推荐在线帮助' && state.displayType == '集合'" class="table-item-container">
                    <el-table ref="collection_Forum_HelpRelated_RecommendHelp_table" :data="state.collection_Forum_HelpRelated_RecommendHelp.tableList" row-key="key" tooltip-effect="dark" :show-header="false" stripe style="width: 100%" empty-text="没有项">
                        <el-table-column label="索引" align="center" width="50">
                            <template #default="scope">	
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="帮助名称" >
                            <template #default="scope">	
                                {{scope.row.name}}
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="right" width="200">
                            <template #default="scope">	
                                <el-button size="large" :icon="Top" circle @click.prevent="collection_Forum_HelpRelated_RecommendHelp_moveUp(scope.row,scope.$index)" title="上移"></el-button>
                                <el-button size="large" :icon="Bottom" circle @click.prevent="collection_Forum_HelpRelated_RecommendHelp_moveDown(scope.row,scope.$index)" title="下移"></el-button>
                                <el-button size="large" :icon="Delete" circle @click.prevent="collection_Forum_HelpRelated_RecommendHelp_removeItem(scope.row,scope.$index)" title="删除"></el-button>
                            </template>
                        </el-table-column>
                        
                    </el-table>
                    <el-form-item>
                        <div class="item-button"><el-button size="large" :icon="Plus" @click="collection_Forum_HelpRelated_RecommendHelp_loadHelp">添加项</el-button></div>
                    </el-form-item>
                
                    <el-dialog title="选择帮助" v-model="state.collection_Forum_HelpRelated_RecommendHelp.help_form">
                        <div class="dialog-nav-search">
                            <el-form :inline="true" label-width="auto" @submit.native.prevent   >
                                <el-form-item :error="error.collection_Forum_HelpRelated_RecommendHelp.keyword" >
                                    <el-tooltip content="不限制请留空" placement="top">
                                        <el-input v-model.trim="state.collection_Forum_HelpRelated_RecommendHelp.keyword" @keyup.enter.native="collection_Forum_HelpRelated_RecommendHelp_helpPage(1)" maxlength="50" placeholder="关键词"></el-input>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item >
                                    <el-button type="primary" size="large" class="submitButton" @click="collection_Forum_HelpRelated_RecommendHelp_helpPage(1)" >搜索</el-button>
                                </el-form-item>
                                
                            </el-form>
                        </div>
                        <div class="dialog-data-table" >
                            <el-table :data="state.collection_Forum_HelpRelated_RecommendHelp.tableData" @cell-click="cellExpandRow_collection_Forum_HelpRelated_RecommendHelp" :show-header="false" tooltip-effect="dark" style="width: 100%" stripe empty-text="没有内容">
                                <el-table-column label="选择" align="right" width="50">
                                    <template #default="scope">
                                        <el-checkbox v-model="state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup[scope.$index]" @click.native.prevent="radioClickEvent($event)">&nbsp;</el-checkbox>
                                    </template>
                                </el-table-column>
                                <el-table-column label="帮助名称">
                                    <template #default="scope">
                                        {{scope.row.name}}
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="pagination-wrapper" v-if="state.collection_Forum_HelpRelated_RecommendHelp.isShowPage">
                                <el-pagination background  @current-change="collection_Forum_HelpRelated_RecommendHelp_helpPage" :current-page="state.collection_Forum_HelpRelated_RecommendHelp.currentpage"  :page-size="state.collection_Forum_HelpRelated_RecommendHelp.maxresult" layout="total, prev, pager, next,jumper" :total="state.collection_Forum_HelpRelated_RecommendHelp.totalrecord"></el-pagination>
                            </div>
                        </div>
                    </el-dialog>
                </div>

                <!-- 自定义版块 -- 用户自定义HTML--实体对象 -->
                <div v-show="state.forumType == '自定义版块' && state.forumChildType == '用户自定义HTML' && state.displayType == '实体对象'" >
                    <el-form-item label="内容" :error="error.entityBean_Forum_CustomForumRelated_CustomHTML.htmlContent" >
                        <textarea ref="entityBean_customForum_htmlContent_ref" style="width:100%;height:400px;visibility:hidden;"></textarea>
                    </el-form-item>
                </div>
                
                <!-- 系统--热门搜索词  集合-->
                <div v-show="state.forumType == '系统' && state.forumChildType == '热门搜索词' && state.displayType == '集合'" >
                    <el-form-item v-for="(formOption, index) in state.collection_Forum_SystemRelated_SearchWord.formOptions" label="搜索词"  :prop="'collection_Forum_SystemRelated_SearchWord.formOptions.' + index + '.value'">
                        
                        <el-col :span="14">
                            <el-input v-model.trim="formOption.value" maxlength="40"></el-input>
                        </el-col>
                        <el-col :span="6" :offset="1">
                            <el-button size="large" :icon="Top" circle @click.prevent="collection_Forum_SystemRelated_SearchWord_moveUp(formOption)" title="上移"></el-button>
                            <el-button size="large" :icon="Bottom" circle @click.prevent="collection_Forum_SystemRelated_SearchWord_moveDown(formOption)" title="下移"></el-button>
                            <el-button size="large" :icon="Delete" circle @click.prevent="collection_Forum_SystemRelated_SearchWord_removeItem(formOption)" title="删除"></el-button>
                        </el-col>
                        
                    </el-form-item>
                    <el-form-item label=" ">
                        <div class="item-button"><el-button size="large" :icon="Plus" @click="collection_Forum_SystemRelated_SearchWord_addItem">添加项</el-button></div>
                    </el-form-item>
                </div>
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, nextTick, onActivated, onDeactivated, onMounted, reactive, ref, watch } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { storeToRefs } from 'pinia';
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage, ElTable, UploadFile, UploadUserFile } from 'element-plus';
    import { getType, processErrorInfo,processErrorInfo_forum, toBase64Image } from '@/utils/tool';
    import { createEditor } from '@/utils/editor';
    import { ForumCodeNode, Layout, Templates } from '@/types';
    import { ArrowRight } from '@element-plus/icons-vue'
    import { Top, Bottom,Delete,Plus} from '@element-plus/icons-vue'


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();
    const {fileStorageSystem:store_fileStorageSystem} = storeToRefs(store)
 

    const page_question_tag_ref = ref()
    const monolayer_helpType_ref = ref()
    const page_helpType_ref = ref()
    const entityBean_customForum_htmlContent_ref = ref()
    



    //Select 选择器选项
    interface OptionsItem {
        value: string;
        label: string;
    }

    const state = reactive({
        layoutId :'',
        layout: {} as Layout,
        templates: {} as Templates,
    
        dirName: '',
        forumType: '',//版块类型
        forumChildType: '',//版块子类型
        forumCodeNodeList:[] as Array<ForumCodeNode>,//版块代码节点列表选项
        forumTypeOptions: [] as Array<OptionsItem>,//版块类型选项
        forumChildTypeOptions:[] as any,//版块子类型选项
        moduleOptions:[] as Array<OptionsItem>,//模板选项
        
        name: '',//版块标题
        module: '',//版块模板
        invokeMethod: 1,//调用方式
        displayType :'',//模板显示类型
        
        
        page_Forum_TopicRelated_Topic :{//话题部分--话题列表  分页
            isAllowLoadTagGroup:true,//是否允许加载标签组	
            tagIdGroup :[],//标签Id组
            tagOptions:[] as Array<OptionsItem>,
            
            sortOptions: [{//排序
                    value: 1,
                    label: '按发表时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按发表时间 旧 -> 新'
                }, {
                    value: 3,
                    label: '按回复时间 新 -> 旧'
                }, {
                    value: 4,
                    label: '按回复时间 旧 -> 新'
                }],
                
            page_topic_tagId: '',
            page_topic_tagName :'',//标签名称
            page_topic_tag_transferPrameter: false,
            page_topic_sort: 1,
            page_topic_maxResult: '',
            page_topic_pageCount: '',
        },
        
        page_Forum_CommentRelated_Comment :{//话题部分--评论列表  分页
            sortOptions: [{//排序
                    value: 1,
                    label: '按发布时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按发布时间 旧 -> 新'
                }],
            page_comment_sort: 1,
            page_comment_maxResult: '',
            page_comment_pageCount: '',
        },
        collection_Forum_TopicRelated_LikeTopic :{//话题部分--相似话题  集合
            collection_likeTopic_maxResult: '',
        },
        collection_Forum_TopicRelated_HotTopic :{//话题部分--热门话题  集合
            collection_hotTopic_maxResult: '',
        },
        
        page_Forum_QuestionRelated_Question :{//问题部分--问题列表  分页	
            tagIdGroup :[] as Array<string>,//标签Id组
            tagOptions:[] as Array<OptionsItem>,
            tableData: [],//表格内容
            parentId : '',//父Id
            tagIdList: [] as Array<string>,//可选择Id集合
            totalrecord : 0, //总记录数
            currentpage : 1, //当前页码
            totalpage : 1, //总页数
            maxresult: 12, //每页显示记录数
            isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
            question_tag_form:false,//是否显示问题标签表单
            navigation: '',
            sortOptions: [{//排序
                    value: 1,
                    label: '按发表时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按发表时间 旧 -> 新'
                }, {
                    value: 3,
                    label: '按回答时间 新 -> 旧'
                }, {
                    value: 4,
                    label: '按回答时间 旧 -> 新'
                }],
                    
            filterConditionOptions: [{//过滤条件
                    value: 10,
                    label: '全部'
                }, {
                    value: 20,
                    label: '未解决'
                }, {
                    value: 30,
                    label: '已解决'
                }, {
                    value: 40,
                    label: '积分悬赏'
                }, {
                    value: 50,
                    label: '现金悬赏'
                }],
            page_question_tagId: '',
            page_question_tag_transferPrameter: false,
            page_question_filterCondition: 10,
            page_question_filterCondition_transferPrameter: false,
            page_question_sort: 1,
            page_question_maxResult: '',
            page_question_pageCount: '',
        },
        page_Forum_AnswerRelated_Answer :{//答案部分--答案列表  分页
            sortOptions: [{//排序
                    value: 1,
                    label: '按回答时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按回答时间 旧 -> 新'
                }],
            page_answer_sort: 1,
            page_answer_maxResult: '',
            page_answer_pageCount: '',
        },
        collection_Forum_QuestionRelated_LikeQuestion :{//问题部分--相似问题  集合
            collection_likeQuestion_maxResult: '',
        },
        page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser :{//红包部分--领取红包用户列表 分页
            sortOptions: [{//排序
                    value: 10,
                    label: '按领取时间 新 -> 旧'
                }, {
                    value: 20,
                    label: '按领取时间 旧 -> 新'
                }],
            page_receiveRedEnvelopeUser_sort: 10,
            page_receiveRedEnvelopeUser_maxResult: '',
        },
        collection_Forum_AdvertisingRelated_imageList :{//广告部分--图片广告 集合
            tableList:[] as any,
            uploadImgs:[] as any,//上传图片集合
            localImageUrl:'' as string | undefined,//本地预览图
            isImageViewer: false,//是否显示图片查看器
            collection_image_name: [] as Array<string>,
            collection_image_link: [] as Array<string>,
            collection_image_path: [] as Array<string>,
            
        },
        monolayer_Forum_HelpRelated_Help :{//在线帮助部分--在线帮助列表  单层
            helpTypeIdGroup :[] as Array<string>,//分类Id组
            helpTypeOptions:[] as Array<OptionsItem>,
            tableData: [],//表格内容
            parentId : '',//父Id
            helpTypeIdList: [] as Array<string>,//可选择Id集合
            totalrecord : 0, //总记录数
            currentpage : 1, //当前页码
            totalpage : 1, //总页数
            maxresult: 12, //每页显示记录数
            isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
            helpType_form:false,//是否显示问题标签表单
            navigation: '',
            
            isAllowLoadHelpTypeMore:true,
            moreOptions:[] as Array<OptionsItem>,
            monolayer_help_helpType_transferPrameter:false,
            sortOptions: [{//排序
                    value: 1,
                    label: '按发布时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按发布时间 旧 -> 新'
                }],
            
            
            monolayer_help_helpTypeId: '',
            monolayer_help_quantity: '',
            monolayer_help_more: '',
            monolayer_help_maxResult: '',
            monolayer_help_pageCount: '',
            monolayer_help_sort : 1,
        },
        page_Forum_HelpRelated_Help :{//在线帮助部分--在线帮助列表  分页
            helpTypeIdGroup :[] as Array<string>,//分类Id组
            helpTypeOptions:[] as Array<OptionsItem>,
            tableData: [],//表格内容
            parentId : '',//父Id
            helpTypeIdList: [] as Array<string>,//可选择Id集合
            totalrecord : 0, //总记录数
            currentpage : 1, //当前页码
            totalpage : 1, //总页数
            maxresult: 12, //每页显示记录数
            isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
            helpType_form:false,//是否显示帮助分类表单
            navigation: '',
            
            page_help_helpType_transferPrameter:false,
            sortOptions: [{//排序
                    value: 1,
                    label: '按发布时间 新 -> 旧'
                }, {
                    value: 2,
                    label: '按发布时间 旧 -> 新'
                }],
            page_help_helpTypeId: '',
            page_help_maxResult: '',
            page_help_pageCount: '',
            page_help_sort : 1,
        },
        collection_Forum_HelpRelated_RecommendHelp:{//在线帮助部分--推荐在线帮助  集合
            help_form:false,//是否显示帮助表单
            
            keyword: '',//关键词
            tableList :[] as any,
            helpIdGroup :[] as Array<boolean>,//帮助Id组
            tableData: [] as any,//表格内容
            totalrecord : 0, //总记录数
            currentpage : 1, //当前页码
            totalpage : 1, //总页数
            maxresult: 12, //每页显示记录数
            isShowPage:false,//是否显示分页 maxresult没返回结果前就显示会导致分页栏显示页码错误
        },
        entityBean_Forum_CustomForumRelated_CustomHTML:{//自定义版块 -- 用户自定义HTML--实体对象
            editor: {} as any,//编辑器
            editorCreateParameObject: {} as any,
        },
        collection_Forum_SystemRelated_SearchWord:{//系统--热门搜索词  集合
            formOptions: [{
                key: '',
                value: ''
            }],
        },
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        name: '',//版块标题
        forumType :'',
        module: '',//版块模板
        invokeMethod: '',//调用方式
        
        page_Forum_TopicRelated_Topic :{//话题部分--话题列表  分页
            page_topic_tagId: '',//话题部分--话题列表  分页
            page_topic_tag_transferPrameter: '',
            page_topic_sort: '',
            page_topic_maxResult: '',
            page_topic_pageCount: '',
        },
        page_Forum_CommentRelated_Comment :{//话题部分--评论列表  分页
            page_comment_sort: '',
            page_comment_maxResult: '',
            page_comment_pageCount: '',
        },
        collection_Forum_TopicRelated_LikeTopic :{//话题部分--相似话题  集合
            collection_likeTopic_maxResult: '',
        },
        collection_Forum_TopicRelated_HotTopic :{//话题部分--热门话题  集合
            collection_hotTopic_maxResult: '',
        },
        
        page_Forum_QuestionRelated_Question :{//问题部分--问题列表  分页
            page_question_tagId: '',
            page_question_tagName :'',//标签名称
            page_question_tag_transferPrameter: '',
            page_question_sort: '',
            page_question_maxResult: '',
            page_question_pageCount: '',
        },
        page_Forum_AnswerRelated_Answer :{//答案部分--答案列表  分页
            page_answer_sort: '',
            page_answer_maxResult: '',
            page_answer_pageCount: '',
        },
        collection_Forum_QuestionRelated_LikeQuestion :{//问题部分--相似问题  集合
            collection_likeQuestion_maxResult: '',
        },
        page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser :{//红包部分--领取红包用户列表 分页
            page_receiveRedEnvelopeUser_sort: '',
            page_receiveRedEnvelopeUser_maxResult: '',
        },
        collection_Forum_AdvertisingRelated_imageList :{//广告部分--图片广告 集合
            collection_image_name: new Map(),
            collection_image_link: new Map(),
            collection_image_imagePath: new Map(),
        },
        monolayer_Forum_HelpRelated_Help :{//在线帮助部分--在线帮助列表  单层
            monolayer_help_helpTypeId: '',
            monolayer_help_quantity: '',
            monolayer_help_more: '',
            monolayer_help_maxResult: '',
            monolayer_help_pageCount: '',
            monolayer_help_sort: '',
        },
        page_Forum_HelpRelated_Help :{//在线帮助部分--在线帮助列表  分页
            page_help_helpTypeId: '',
            page_help_maxResult: '',
            page_help_pageCount: '',
            page_help_sort: '',
        },
        collection_Forum_HelpRelated_RecommendHelp:{//在线帮助部分--推荐在线帮助  集合
            keyword: '',//关键词
        },
        entityBean_Forum_CustomForumRelated_CustomHTML:{//自定义版块 -- 用户自定义HTML--实体对象
            htmlContent: '',
        },
        collection_Forum_SystemRelated_SearchWord:{//系统--热门搜索词  集合

        },
    });


    //空的点击事件  不写上本方法点击cellExpandRow时会运行两次
    const radioClickEvent = (event:any) => {
        
    }

    //选中版块类型
    const selectedForumType = (val:any) => {
        state.forumType = val;
        //清空
        state.forumChildTypeOptions = [];
            
        if(state.forumCodeNodeList != null && state.forumCodeNodeList.length >0){
            for(let i=0; i<state.forumCodeNodeList.length; i++){
                let forumCodeNode = state.forumCodeNodeList[i];
                        
                if(forumCodeNode.nodeName == val){
                    if(forumCodeNode.childNode != null && forumCodeNode.childNode.length >0){
                        for(let j=0; j<forumCodeNode.childNode.length; j++){
                            let childForumCodeNode = forumCodeNode.childNode[j];
                            state.forumChildTypeOptions.push({
                                value: childForumCodeNode.nodeName,
                                label: childForumCodeNode.nodeName
                            });
                            
                            if(j == 0){//默认选择第一项
                                state.forumChildType = childForumCodeNode.nodeName;
                            }
                        }
                    }
                }
            }
        }
    }
    //选中模板
    const selectedModule = (val:any) => {
        let stringArray = val.split("_");
        let displayType = "单层";//模板显示类型参数 默认是单层
        if(stringArray != null && stringArray.length >1){	
            if(stringArray[2] == "monolayer"){//单层
                displayType = "单层";
            }else if(stringArray[2] == "multilayer"){//多层
                displayType = "多层";
            }else if(stringArray[2] == "page"){//分页
                displayType = "分页";
            }else if(stringArray[2] == "entityBean"){//实体对象
                displayType = "实体对象";
            }else if(stringArray[2] == "collection"){//集合
                displayType = "集合";
            }
        }
        state.displayType = displayType;
    }
    //选中话题标签
    const selectedTopicTag = (val:any) => {
        //因为只允许选中一个，所以将已选择的清空
        if (Object.keys(state.page_Forum_TopicRelated_Topic.tagIdGroup).length >1) {
            state.page_Forum_TopicRelated_Topic.tagIdGroup.shift();//从Array 头部移除元素
        }
        
        state.page_Forum_TopicRelated_Topic.page_topic_tagId = val[0];
        
        for(let option in state.page_Forum_TopicRelated_Topic.tagOptions){
            if(state.page_Forum_TopicRelated_Topic.tagOptions[option].value == state.page_Forum_TopicRelated_Topic.page_topic_tagId){
                state.page_Forum_TopicRelated_Topic.page_topic_tagName = state.page_Forum_TopicRelated_Topic.tagOptions[option].label;
                break;
            }
        }
    }
 
    //加载话题标签
    const loadTopicTag = () => {
        if(!state.page_Forum_TopicRelated_Topic.isAllowLoadTagGroup){
            return;
        }

        proxy?.$axios({
            url: '/control/tag/manage',
            method: 'get',
            params: {
                method : 'allTag'
            },
            //showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.page_Forum_TopicRelated_Topic.isAllowLoadTagGroup = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		state.page_Forum_TopicRelated_Topic.tagOptions = [];
			    		
			    		let tagList = returnValue.data;
			    		if(tagList != null && tagList.length >0){
			    			for(let i=0; i<tagList.length; i++){
			    				let tag = tagList[i];
				    			let obj:any =new Object();
				    	    	obj.value = tag.id;
				    	    	obj.label = tag.name;
				    	    	state.page_Forum_TopicRelated_Topic.tagOptions.push(obj);
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
    const cellExpandRow_questionTag = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            if(row.childNodeNumber ==0){
                state.page_Forum_QuestionRelated_Question.tagIdGroup.push(row.id);
                
                state.page_Forum_QuestionRelated_Question.page_question_tagId = row.id;
                
                let obj:any =new Object();
                obj.value = row.id;
                obj.label = row.name;
                state.page_Forum_QuestionRelated_Question.tagOptions.length = 0;//清空
                state.page_Forum_QuestionRelated_Question.tagOptions.push(obj);
                
                
                //因为只允许选中一个，所以将已选择的清空
                if (Object.keys(state.page_Forum_QuestionRelated_Question.tagIdGroup).length >1) {
                    state.page_Forum_QuestionRelated_Question.tagIdGroup.shift();//从Array 头部移除元素
                }
                
                state.page_Forum_QuestionRelated_Question.question_tag_form = false;
            }
        }else if(column.label=="标签名称"){
            if(row.childNodeNumber >0){
                state.page_Forum_QuestionRelated_Question.parentId = row.id;
                queryQuestionTag(1,row.id);
            }
        }
    }


    //加载问题标签
    const loadQuestionTag = () => {
	    	
        state.page_Forum_QuestionRelated_Question.question_tag_form = true;
        page_question_tag_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        
        if(state.page_Forum_QuestionRelated_Question.tagIdGroup.length ==0){
            state.page_Forum_QuestionRelated_Question.page_question_tagId = "";
            state.page_Forum_QuestionRelated_Question.tagOptions.length = 0;//清空	
        }
        
        
        //清空数据
        state.page_Forum_QuestionRelated_Question.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.page_Forum_QuestionRelated_Question.currentpage = 1;
        state.page_Forum_QuestionRelated_Question.totalpage = 1;//服务器返回的long类型已转为String类型
        state.page_Forum_QuestionRelated_Question.maxresult = 12;
        state.page_Forum_QuestionRelated_Question.isShowPage = false;//显示分页栏
        state.page_Forum_QuestionRelated_Question.parentId = '';
        
        queryQuestionTag(1,'');
    }
    //问题标签分页
    const questionTagPage = (page:number) => {
        
        queryQuestionTag(page, state.page_Forum_QuestionRelated_Question.parentId);
    }

    //查询问题标签
    const queryQuestionTag = (page:number,parentId:string) => {
        state.page_Forum_QuestionRelated_Question.tableData = [];
        state.page_Forum_QuestionRelated_Question.tagIdList = [];
        state.page_Forum_QuestionRelated_Question.navigation = '';
        
        state.page_Forum_QuestionRelated_Question.parentId = parentId;


        proxy?.$axios({
            url: '/control/questionTag/manage',
            method: 'get',
            params: {
                method : 'questionTagPage',
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
                                        state.page_Forum_QuestionRelated_Question.tagIdList.push(tag.id);
                                    
                                    }
                                
                                
                                    state.page_Forum_QuestionRelated_Question.tableData = tagList;
                        
                                    state.page_Forum_QuestionRelated_Question.totalrecord = parseInt(tagView.totalrecord);//服务器返回的long类型已转为String类型
                                    state.page_Forum_QuestionRelated_Question.currentpage = tagView.currentpage;
                                    state.page_Forum_QuestionRelated_Question.totalpage = parseInt(tagView.totalpage);//服务器返回的long类型已转为String类型
                                    state.page_Forum_QuestionRelated_Question.maxresult = tagView.maxresult;
                                    state.page_Forum_QuestionRelated_Question.isShowPage = true;//显示分页栏
                                }
                            }else if(key == "navigation"){
                                state.page_Forum_QuestionRelated_Question.navigation = mapData[key];
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
		


    //广告部分--图片广告 集合 添加项
    const advertising_imageList_addItem = () => {
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.push("");
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.push("");
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.push("");
    
        let key = Math.random().toString().slice(2)//随机数
        state.collection_Forum_AdvertisingRelated_imageList.tableList.push({
            key: key
        });
    }

    //处理上传图片
    const advertising_imageList_handleChange = (file: UploadFile, fileList:UploadUserFile[],key:string) => {
        if (fileList.length > 1) {
            fileList.splice(0, 1);
        }

        //使用Base64格式显示图片
        toBase64Image(file.raw).then((data:any) => {
            file.url = data
        })
    }
    //处理删除图片
    const advertising_imageList_handleImageRemove = (file: UploadFile,fileList:UploadUserFile[]) => {
        
        let index = fileList.findIndex( fileItem => {
            return fileItem.uid === file.uid
        });
        fileList.splice(index, 1);

    }
    //打开图片预览
    const advertising_imageList_openImagePreview = (file: UploadFile) => {
        //使用Base64格式显示图片
        toBase64Image(file.raw).then((data:any) => {
            state.collection_Forum_AdvertisingRelated_imageList.localImageUrl = data; 
        })
        state.collection_Forum_AdvertisingRelated_imageList.isImageViewer = true;
    }
    //关闭图片预览
    const advertising_imageList_closeImagePreview= () => {
        state.collection_Forum_AdvertisingRelated_imageList.localImageUrl = '';
        state.collection_Forum_AdvertisingRelated_imageList.isImageViewer = false;
    }

    //上移
    const collection_Forum_AdvertisingRelated_imageList_moveUp= (row:any,index:any) => {
        if (index >0) {
            let upData = state.collection_Forum_AdvertisingRelated_imageList.tableList[index - 1];

            state.collection_Forum_AdvertisingRelated_imageList.tableList.splice(index - 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.tableList.splice(index, 0, upData);
            
            let uploadImgs_upData = state.collection_Forum_AdvertisingRelated_imageList.uploadImgs[index - 1];
            state.collection_Forum_AdvertisingRelated_imageList.uploadImgs.splice(index - 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.uploadImgs.splice(index, 0, uploadImgs_upData);


            let image_name_upData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_name[index - 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.splice(index - 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.splice(index, 0, image_name_upData);
            
            let image_link_upData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_link[index - 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.splice(index - 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.splice(index, 0, image_link_upData);
            
            let image_path_upData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_path[index - 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.splice(index - 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.splice(index, 0, image_path_upData);
            
            //错误信息移动
            let up_image_name_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.get(index - 1);
            let current_image_name_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.delete(index - 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.delete(index);
            if(up_image_name_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.set(index,up_image_name_error);
            }
            if(current_image_name_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.set(index - 1,current_image_name_error);
            }
            
            let up_image_link_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.get(index - 1);
            let current_image_link_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.delete(index - 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.delete(index);
            if(up_image_link_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.set(index,up_image_link_error);
            }
            if(current_image_link_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.set(index - 1,current_image_link_error);
            }
            
            let up_image_imagePath_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.get(index - 1);
            let current_image_imagePath_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.delete(index - 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.delete(index);
            if(up_image_imagePath_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.set(index,up_image_imagePath_error);
            }
            if(current_image_imagePath_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.set(index - 1,current_image_imagePath_error);
            }
        }
    
    }
    //下移
    const collection_Forum_AdvertisingRelated_imageList_moveDown= (row:any,index:any) => {
        if ((index + 1) < state.collection_Forum_AdvertisingRelated_imageList.tableList.length) {
            let downData = state.collection_Forum_AdvertisingRelated_imageList.tableList[index + 1];
            state.collection_Forum_AdvertisingRelated_imageList.tableList.splice(index + 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.tableList.splice(index, 0, downData);
            
            let uploadImgs_downData = state.collection_Forum_AdvertisingRelated_imageList.uploadImgs[index + 1];
            state.collection_Forum_AdvertisingRelated_imageList.uploadImgs.splice(index + 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.uploadImgs.splice(index, 0, uploadImgs_downData);

            let image_name_downData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_name[index + 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.splice(index + 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.splice(index, 0, image_name_downData);
            
            let image_link_downData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_link[index + 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.splice(index + 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.splice(index, 0, image_link_downData);
            
            let image_path_downData = state.collection_Forum_AdvertisingRelated_imageList.collection_image_path[index + 1];
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.splice(index + 1, 1);
            state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.splice(index, 0, image_path_downData);
            
            //错误信息移动
            let down_image_name_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.get(index + 1);
            let current_image_name_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.delete(index + 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.delete(index);
            if(down_image_name_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.set(index,down_image_name_error);
            }
            if(current_image_name_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_name.set(index + 1,current_image_name_error);
                
            }
            
            let down_image_link_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.get(index + 1);
            let current_image_link_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.delete(index + 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.delete(index);
            if(down_image_link_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.set(index,down_image_link_error);
            }
            if(current_image_link_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_link.set(index + 1,current_image_link_error);
                
            }
            
            let down_image_imagePath_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.get(index + 1);
            let current_image_imagePath_error = error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.get(index);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.delete(index + 1);
            error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.delete(index);
            if(down_image_imagePath_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.set(index,down_image_imagePath_error);
            }
            if(current_image_imagePath_error != null){
                error.collection_Forum_AdvertisingRelated_imageList.collection_image_imagePath.set(index + 1,current_image_imagePath_error);
                
            }
            
            
        }
    
    }
    //删除
    const collection_Forum_AdvertisingRelated_imageList_removeItem= (row:any,index:any) => {
        state.collection_Forum_AdvertisingRelated_imageList.tableList.splice(index, 1);
        
        state.collection_Forum_AdvertisingRelated_imageList.uploadImgs.splice(index, 1);//上传图片Element节点集合
        state.collection_Forum_AdvertisingRelated_imageList.localImageUrl = '';//本地预览图
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.splice(index, 1);
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_link.splice(index, 1);
        state.collection_Forum_AdvertisingRelated_imageList.collection_image_path.splice(index, 1);
        
    }


    //在线帮助列表 -- 单层 ---点击单元格选择
    const cellExpandRow_monolayer_helpType = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            if(row.childNodeNumber ==0){
                state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup.push(row.id);
                
                state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpTypeId = row.id;
                
                let obj:any =new Object();
                obj.value = row.id;
                obj.label = row.name;
                state.monolayer_Forum_HelpRelated_Help.helpTypeOptions.length = 0;//清空
                state.monolayer_Forum_HelpRelated_Help.helpTypeOptions.push(obj);
                
                
                //因为只允许选中一个，所以将已选择的清空
                if (Object.keys(state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup).length >1) {
                    state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup.shift();//从Array 头部移除元素
                }
                
                state.monolayer_Forum_HelpRelated_Help.helpType_form = false;
            }
        }else if(column.label=="分类名称"){
            if(row.childNodeNumber >0){
                state.monolayer_Forum_HelpRelated_Help.parentId = row.id;
                query_monolayer_helpType(1,row.id);
            }
        }
    }
    
    
    //加载帮助分类 -- 单层
    const load_monolayer_helpType = () => {
        
        state.monolayer_Forum_HelpRelated_Help.helpType_form = true;
        monolayer_helpType_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        
        if(state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup.length ==0){
            state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpTypeId = "";
            state.monolayer_Forum_HelpRelated_Help.helpTypeOptions.length = 0;//清空	
        }
        
        
        //清空数据
        state.monolayer_Forum_HelpRelated_Help.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.monolayer_Forum_HelpRelated_Help.currentpage = 1;
        state.monolayer_Forum_HelpRelated_Help.totalpage = 1;//服务器返回的long类型已转为String类型
        state.monolayer_Forum_HelpRelated_Help.maxresult = 12;
        state.monolayer_Forum_HelpRelated_Help.isShowPage = false;//显示分页栏
        state.monolayer_Forum_HelpRelated_Help.parentId = '';
        
        query_monolayer_helpType(1,'');
    }
    //帮助分类分页 -- 单层
    const monolayer_helpTypePage = (page:number) => {
        
        query_monolayer_helpType(page, state.monolayer_Forum_HelpRelated_Help.parentId);
    }

    //查询帮助分类 -- 单层
    const query_monolayer_helpType = (page:number,parentId:string) => {
        state.monolayer_Forum_HelpRelated_Help.tableData = [];
        state.monolayer_Forum_HelpRelated_Help.helpTypeIdList = [];
        state.monolayer_Forum_HelpRelated_Help.navigation = '';
        
        state.monolayer_Forum_HelpRelated_Help.parentId = parentId;

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
			    				let typeView = mapData[key];
					    		let typeList = typeView.records;
					    		if(typeList != null && typeList.length >0){
					    			for(let i = 0; i<typeList.length; i++){
					    				let type = typeList[i];
					    				state.monolayer_Forum_HelpRelated_Help.helpTypeIdList.push(type.id);
					    			
					    			}
					    		
					    		
					    			state.monolayer_Forum_HelpRelated_Help.tableData = typeList;
					 
					    			state.monolayer_Forum_HelpRelated_Help.totalrecord = parseInt(typeView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.monolayer_Forum_HelpRelated_Help.currentpage = typeView.currentpage;
									state.monolayer_Forum_HelpRelated_Help.totalpage = parseInt(typeView.totalpage);//服务器返回的long类型已转为String类型
									state.monolayer_Forum_HelpRelated_Help.maxresult = typeView.maxresult;
									state.monolayer_Forum_HelpRelated_Help.isShowPage = true;//显示分页栏
					    		}
			    			}else if(key == "navigation"){
			    				state.monolayer_Forum_HelpRelated_Help.navigation = mapData[key];
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


    //加载帮助分类更多 -- 单层
    const load_monolayer_helpType_more = () => {
        if(!state.monolayer_Forum_HelpRelated_Help.isAllowLoadHelpTypeMore){
            return;
        }

        proxy?.$axios({
            url: '/control/layout/manage',
            method: 'get',
            params: {
                method : 'ajax_more',
                dirName:state.dirName,
                forumChildType:state.forumChildType,
            },
           // showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.monolayer_Forum_HelpRelated_Help.isAllowLoadHelpTypeMore = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		state.monolayer_Forum_HelpRelated_Help.moreOptions = [];
			    		let first = "";
			    		let moreMap = returnValue.data;
			    		for(let key in moreMap){
			    			let obj:any =new Object();
			    	    	obj.value = key;
			    	    	obj.label = moreMap[key];
			    	    	state.monolayer_Forum_HelpRelated_Help.moreOptions.push(obj);
			    			if(first == ""){
			    				first = key;
			    			}
			    		}
			    		
			    		//默认选中第一项
			    		state.monolayer_Forum_HelpRelated_Help.monolayer_help_more = first;
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

    //在线帮助列表 -- 分页 ---点击单元格选择
    const cellExpandRow_page_helpType = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
            if(row.childNodeNumber ==0){
                state.page_Forum_HelpRelated_Help.helpTypeIdGroup.push(row.id);
                
                state.page_Forum_HelpRelated_Help.page_help_helpTypeId = row.id;
                
                let obj:any =new Object();
                obj.value = row.id;
                obj.label = row.name;
                state.page_Forum_HelpRelated_Help.helpTypeOptions.length = 0;//清空
                state.page_Forum_HelpRelated_Help.helpTypeOptions.push(obj);
                
                
                //因为只允许选中一个，所以将已选择的清空
                if (Object.keys(state.page_Forum_HelpRelated_Help.helpTypeIdGroup).length >1) {
                    state.page_Forum_HelpRelated_Help.helpTypeIdGroup.shift();//从Array 头部移除元素
                }
                
                state.page_Forum_HelpRelated_Help.helpType_form = false;
            }
        }else if(column.label=="分类名称"){
            if(row.childNodeNumber >0){
                state.page_Forum_HelpRelated_Help.parentId = row.id;
                query_page_helpType(1,row.id);
            }
        }
    }

    //加载帮助分类 -- 分页
    const load_page_helpType = () => {
        
        state.page_Forum_HelpRelated_Help.helpType_form = true;
        page_helpType_ref.value.blur();//使Select选择器失去焦点，并隐藏下拉框
        
        if(state.page_Forum_HelpRelated_Help.helpTypeIdGroup.length ==0){
            state.page_Forum_HelpRelated_Help.page_help_helpTypeId = "";
            state.page_Forum_HelpRelated_Help.helpTypeOptions.length = 0;//清空	
        }
        
        
        //清空数据
        state.page_Forum_HelpRelated_Help.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.page_Forum_HelpRelated_Help.currentpage = 1;
        state.page_Forum_HelpRelated_Help.totalpage = 1;//服务器返回的long类型已转为String类型
        state.page_Forum_HelpRelated_Help.maxresult = 12;
        state.page_Forum_HelpRelated_Help.isShowPage = false;//显示分页栏
        state.page_Forum_HelpRelated_Help.parentId = '';
        
        query_page_helpType(1,'');
    }

    //帮助分类分页 -- 分页
    const page_helpTypePage = (page:number) => {
        
        query_page_helpType(page, state.page_Forum_HelpRelated_Help.parentId);
    }
    //查询帮助分类 -- 分页
    const query_page_helpType = (page:number,parentId:string) => {
        
        state.page_Forum_HelpRelated_Help.tableData = [];
        state.page_Forum_HelpRelated_Help.helpTypeIdList = [];
        state.page_Forum_HelpRelated_Help.navigation = '';
        

        state.monolayer_Forum_HelpRelated_Help.parentId = parentId;

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
            state.monolayer_Forum_HelpRelated_Help.isAllowLoadHelpTypeMore = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let mapData = returnValue.data;
			    		for(let key in mapData){
			    			if(key == "pageView"){
			    				let typeView = mapData[key];
					    		let typeList = typeView.records;
					    		if(typeList != null && typeList.length >0){
					    			for(let i = 0; i<typeList.length; i++){
					    				let type = typeList[i];
					    				state.page_Forum_HelpRelated_Help.helpTypeIdList.push(type.id);
					    			
					    			}
					    		
					    		
					    			state.page_Forum_HelpRelated_Help.tableData = typeList;
					 
					    			state.page_Forum_HelpRelated_Help.totalrecord = parseInt(typeView.totalrecord);//服务器返回的long类型已转为String类型
					    			state.page_Forum_HelpRelated_Help.currentpage = typeView.currentpage;
									state.page_Forum_HelpRelated_Help.totalpage = parseInt(typeView.totalpage);//服务器返回的long类型已转为String类型
									state.page_Forum_HelpRelated_Help.maxresult = typeView.maxresult;
									state.page_Forum_HelpRelated_Help.isShowPage = true;//显示分页栏
					    		}
			    			}else if(key == "navigation"){
			    				state.page_Forum_HelpRelated_Help.navigation = mapData[key];
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

    //推荐在线帮助 - 集合 --点击单元格选择
    const cellExpandRow_collection_Forum_HelpRelated_RecommendHelp = (row:any,column:any,event:any,cell:any) => {
        if(column.label=="选择"){
        
            
        //ref="collection_Forum_HelpRelated_RecommendHelp_table" :data="collection_Forum_HelpRelated_RecommendHelp.tableList"
            
            
            for(let i =0; i< state.collection_Forum_HelpRelated_RecommendHelp.tableData.length; i++){
                let search_help = state.collection_Forum_HelpRelated_RecommendHelp.tableData[i];
                if(row.id == search_help.id){
                    if(state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup[i] == true){//原来已选中
                        state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup[i] = false;
                        for(let j =0; j< state.collection_Forum_HelpRelated_RecommendHelp.tableList.length; j++){
                            let help = state.collection_Forum_HelpRelated_RecommendHelp.tableList[j];
                            if(row.id == help.id){
                                state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(j, 1);
                                break;
                            }
                        }
                    }else{
                        state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup[i] = true;
                        state.collection_Forum_HelpRelated_RecommendHelp.tableList.push(row);
                    }
                
                    
                }
            }
        }
    }

    //推荐在线帮助 - 集合 -- 加载 
    const collection_Forum_HelpRelated_RecommendHelp_loadHelp = () => {
        state.collection_Forum_HelpRelated_RecommendHelp.help_form = true;

        state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup.length = 0;//清空
        state.collection_Forum_HelpRelated_RecommendHelp.keyword = '';//关键词

        //清空数据
        state.collection_Forum_HelpRelated_RecommendHelp.totalrecord = 0;//服务器返回的long类型已转为String类型
        state.collection_Forum_HelpRelated_RecommendHelp.currentpage = 1;
        state.collection_Forum_HelpRelated_RecommendHelp.totalpage = 1;//服务器返回的long类型已转为String类型
        state.collection_Forum_HelpRelated_RecommendHelp.maxresult = 12;
        state.collection_Forum_HelpRelated_RecommendHelp.isShowPage = false;//显示分页栏
        
        search_collection_help(1,'');
    }

    //推荐在线帮助 -- 分页
    const collection_Forum_HelpRelated_RecommendHelp_helpPage = (page:number) => {
        
        search_collection_help(page, state.collection_Forum_HelpRelated_RecommendHelp.keyword);
    }
    
    //推荐在线帮助 - 集合 搜索分类
    const search_collection_help = (page:number,keyword:string) => {
        
        state.collection_Forum_HelpRelated_RecommendHelp.tableData = [];
        state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup = [];

        proxy?.$axios({
            url: '/control/help/manage',
            method: 'get',
            params: {
                method : 'ajax_searchHelpPage',
                keyword : keyword,
                page : page
            },
           // showLoading: false,//是否显示加载图标
            loadingMask:false,// 是否显示遮罩层
        })
        .then((response: AxiosResponse) => {
            state.monolayer_Forum_HelpRelated_Help.isAllowLoadHelpTypeMore = false;
            if(response){
                const result: any = response.data;
                if(result){
                    let returnValue = JSON.parse(result);
                    if(returnValue.code === 200){//成功
			    		let pageView = returnValue.data;
			    		let list = pageView.records;
			    		if(list != null && list.length >0){
			    			
			    			A:for(let i =0; i<list.length; i++){
			    				let help = list[i];
			    				
			    				for(let j =0; j<state.collection_Forum_HelpRelated_RecommendHelp.tableList.length; j++){
			    					let item = state.collection_Forum_HelpRelated_RecommendHelp.tableList[j];
			    					if(item.id == help.id){
			    						state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup.push(true);
			    						continue A;
			    					}
			    				}
			    				state.collection_Forum_HelpRelated_RecommendHelp.helpIdGroup.push(false);
			    			}
			    			
			    			state.collection_Forum_HelpRelated_RecommendHelp.tableData = list;
			 
			    			state.collection_Forum_HelpRelated_RecommendHelp.totalrecord = parseInt(pageView.totalrecord);//服务器返回的long类型已转为String类型
			    			state.collection_Forum_HelpRelated_RecommendHelp.currentpage = pageView.currentpage;
							state.collection_Forum_HelpRelated_RecommendHelp.totalpage = parseInt(pageView.totalpage);//服务器返回的long类型已转为String类型
							state.collection_Forum_HelpRelated_RecommendHelp.maxresult = pageView.maxresult;
							state.collection_Forum_HelpRelated_RecommendHelp.isShowPage = true;//显示分页栏
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

    //推荐在线帮助 - 集合 -- 上移
    const collection_Forum_HelpRelated_RecommendHelp_moveUp = (row:any,index:any) => {
        if (index >0) {
            let upData = state.collection_Forum_HelpRelated_RecommendHelp.tableList[index - 1];
            state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(index - 1, 1);
            state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(index, 0, upData);
        }
    
    }
    //推荐在线帮助 - 集合 -- 下移
    const collection_Forum_HelpRelated_RecommendHelp_moveDown = (row:any,index:any) => {
        if ((index + 1) < state.collection_Forum_HelpRelated_RecommendHelp.tableList.length) {
            let downData = state.collection_Forum_HelpRelated_RecommendHelp.tableList[index + 1];
            state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(index + 1, 1);
            state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(index, 0, downData); 
        }
    
    }
    //推荐在线帮助 - 集合 -- 删除
    const collection_Forum_HelpRelated_RecommendHelp_removeItem = (row:any,index:any) => {
        state.collection_Forum_HelpRelated_RecommendHelp.tableList.splice(index, 1);
    }

    //自定义版块 -- 用户自定义HTML -- 实体对象 -- 编辑器
    const entityBean_Forum_CustomForumRelated_CustomHTML_editor = () => {
        let availableTag =  ['source', '|', 'preview', 
            '|', 'justifyleft', 'justifycenter', 'justifyright',
            'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
            'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 
            'formatblock', 'fontname', 'fontsize','fullscreen', '/', 'forecolor', 'hilitecolor', 'bold',
            'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
                'media','embedVideo','uploadVideo', 'insertfile','emoticons','baidumap', 'table', 'hr',   'pagebreak',
                'link', 'unlink'];
        let uploadPath = "control/forum/manage?method=upload&layoutId="+state.layoutId;
        if (Object.keys(state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject).length === 0) {//等于空
            //创建富文本编辑器
            state.entityBean_Forum_CustomForumRelated_CustomHTML.editor = createEditor(entityBean_customForum_htmlContent_ref.value, availableTag, uploadPath, null,store_fileStorageSystem.value);
            state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject = {
                    ref:entityBean_customForum_htmlContent_ref.value,
                    availableTag:availableTag,
                    uploadPath:uploadPath,
                    userGradeList:null
            }
        }
        
    }
    
    //系统--热门搜索词  集合 -- 添加项
    const collection_Forum_SystemRelated_SearchWord_addItem = () => {
        state.collection_Forum_SystemRelated_SearchWord.formOptions.push({
            key: '',
            value: ''
        });
    }
    //系统--热门搜索词  集合 -- 删除项
    const collection_Forum_SystemRelated_SearchWord_removeItem = (formOption:any) => {
        let index = state.collection_Forum_SystemRelated_SearchWord.formOptions.indexOf(formOption);
        if (index !== -1) {
            state.collection_Forum_SystemRelated_SearchWord.formOptions.splice(index, 1);
        }
    }
    //系统--热门搜索词  集合 -- 上移
    const collection_Forum_SystemRelated_SearchWord_moveUp = (formOption:any) => {
        let index = state.collection_Forum_SystemRelated_SearchWord.formOptions.indexOf(formOption);
        if (index >0) {
            let upData = state.collection_Forum_SystemRelated_SearchWord.formOptions[index - 1];
            state.collection_Forum_SystemRelated_SearchWord.formOptions.splice(index - 1, 1);
            state.collection_Forum_SystemRelated_SearchWord.formOptions.splice(index, 0, upData);
        }
    }
    //系统--热门搜索词  集合 -- 下移
    const collection_Forum_SystemRelated_SearchWord_moveDown = (formOption:any) => {
        let index = state.collection_Forum_SystemRelated_SearchWord.formOptions.indexOf(formOption);
        if ((index + 1) < state.collection_Forum_SystemRelated_SearchWord.formOptions.length) {
            let downData = state.collection_Forum_SystemRelated_SearchWord.formOptions[index + 1];
            state.collection_Forum_SystemRelated_SearchWord.formOptions.splice(index + 1, 1);
            state.collection_Forum_SystemRelated_SearchWord.formOptions.splice(index, 0, downData);
        }
    }

    //查询添加界面
    const queryAddForumUI = () => {
        proxy?.$axios({
            url: '/control/forum/manage',
            method: 'get',
            params: {
                method : 'add',
                layoutId:  state.layoutId,
                dirName: state.dirName,
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
			    			if(key == "layout"){
			    				state.layout = mapData[key];
			    			}else if(key == "templates"){
			    				state.templates = mapData[key];
			    			}else if(key == "forumCodeNodeList"){
			    				let forumCodeNodeList = mapData[key];
			    				if(forumCodeNodeList != null && forumCodeNodeList.length >0){
			    					//清空
			    					state.forumTypeOptions = [];
			    					state.forumChildTypeOptions = [];
			    				
			    					for(let i=0; i<forumCodeNodeList.length; i++){
			    						let forumCodeNode = forumCodeNodeList[i];
			    						
			    						state.forumTypeOptions.push({//版块类型
								        	value: forumCodeNode.nodeName,
								        	label: forumCodeNode.nodeName
								        });
								        
								       
								        if(i == 0){//默认选择第一项
								        	state.forumType = forumCodeNode.nodeName;
			 									
								        	if(forumCodeNode.childNode != null && forumCodeNode.childNode.length >0){
				    							for(let j=0; j<forumCodeNode.childNode.length; j++){
				    								let childForumCodeNode = forumCodeNode.childNode[j];
				    								state.forumChildTypeOptions.push({
											        	value: childForumCodeNode.nodeName,
											        	label: childForumCodeNode.nodeName
											        });
											        
											        if(j == 0){//默认选择第一项
                                                        state.forumChildType = childForumCodeNode.nodeName;
					    							}
				    							}
				    						}
								        }
			    					}
			    				}
			    				state.forumCodeNodeList = forumCodeNodeList;
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

    //查询版块模板文件名
    const queryForumTemplateFileName = (childNodeName:string) => {
        state.moduleOptions = [];
        state.module = "";
        state.displayType = "";

        proxy?.$axios({
            url: '/control/forum/manage',
            method: 'get',
            params: {
                method : 'forumTemplateFileNameUI',
			    childNodeName: childNodeName,
			    dirName: state.dirName,
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
			    		let forumCodeNodeList = returnValue.data;
			    		if(forumCodeNodeList != null && forumCodeNodeList.length >0){
			    			for(let i=0; i<forumCodeNodeList.length; i++){
			    				let forumCodeNode = forumCodeNodeList[i];
			    				
			    				
			    				let stringArray = forumCodeNode.nodeName.split("_");
								//var childType = "";
								let displayType = "单层";//模板显示类型参数 默认是单层
								if(stringArray != null && stringArray.length >1){
								//	childType = stringArray[1].toLowerCase(); //子版块类型参数  转为小写	
									if(stringArray[2] == "monolayer"){//单层
										displayType = "单层";
									}else if(stringArray[2] == "multilayer"){//多层
										displayType = "多层";
									}else if(stringArray[2] == "page"){//分页
										displayType = "分页";
									}else if(stringArray[2] == "entityBean"){//实体对象
										displayType = "实体对象";
									}else if(stringArray[2] == "collection"){//集合
										displayType = "集合";
									}
								}
			    				
			    				
			    				state.moduleOptions.push({
						        	value: forumCodeNode.nodeName,
						        	label: forumCodeNode.nodeName+" ("+displayType+")"
						        });
						        
						        if(i == 0){//默认选择第一项
						        	state.displayType = displayType;
					    			state.module = forumCodeNode.nodeName;
					    		}
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

    //提交表单
    const submitForm = () => {
        state.submitForm_disabled = true;

        

        //清空error的属性值
        for (const [key, value] of Object.entries(error) as any){
            if(getType(value) == 'object'){//如果为Object类型

                Object.keys(value).forEach(
                    function(key){
                        if(getType(value[key]) == 'map'){
                            value[key].clear();
                        }else{
                            value[key]= '';
                        }
                    }
                );
            }else{
                Object.assign(error, {[key] : ''});
            }
        }

        let formData = new FormData();
			
        if(state.layoutId != null){
            formData.append('layoutId', state.layoutId);
        }
        if(state.dirName != null){
            formData.append('dirName', state.dirName);
        }
        if(state.forumType != null){
            formData.append('forumType', state.forumType);
        }
        if(state.forumChildType != null){
            formData.append('forumChildType', state.forumChildType);
        }
        if(state.name != null){
            formData.append('name', state.name);
        }
        if(state.module != null){
            formData.append('module', state.module);
        }
        if(state.invokeMethod != null){
            formData.append('invokeMethod', String(state.invokeMethod));
        }
        
        if(state.forumType == '话题' && state.forumChildType == '话题列表' && state.displayType == '分页'){
            if( state.page_Forum_TopicRelated_Topic.page_topic_tagId != undefined){
                formData.append('page_topic_tagId', state.page_Forum_TopicRelated_Topic.page_topic_tagId);
            }
            
            formData.append('page_topic_tag_transferPrameter', state.page_Forum_TopicRelated_Topic.page_topic_tag_transferPrameter.toString());
            formData.append('page_topic_sort', String(state.page_Forum_TopicRelated_Topic.page_topic_sort));
            formData.append('page_topic_maxResult', state.page_Forum_TopicRelated_Topic.page_topic_maxResult);
            formData.append('page_topic_pageCount', state.page_Forum_TopicRelated_Topic.page_topic_pageCount);
        }
        
        if(state.forumType == '话题' && state.forumChildType == '评论列表' && state.displayType == '分页'){
            formData.append('page_comment_sort', String(state.page_Forum_CommentRelated_Comment.page_comment_sort));
            formData.append('page_comment_maxResult', state.page_Forum_CommentRelated_Comment.page_comment_maxResult);
            formData.append('page_comment_pageCount', state.page_Forum_CommentRelated_Comment.page_comment_pageCount);
        }
        if(state.forumType == '话题' && state.forumChildType == '相似话题' && state.displayType == '集合'){
            formData.append('collection_likeTopic_maxResult', state.collection_Forum_TopicRelated_LikeTopic.collection_likeTopic_maxResult);
        }
        if(state.forumType == '话题' && state.forumChildType == '热门话题' && state.displayType == '集合'){
            formData.append('collection_hotTopic_maxResult', state.collection_Forum_TopicRelated_HotTopic.collection_hotTopic_maxResult);
        }
        
        if(state.forumType == '问答' && state.forumChildType == '问题列表' && state.displayType == '分页'){
            if(state.page_Forum_QuestionRelated_Question.tagIdGroup != null && state.page_Forum_QuestionRelated_Question.tagIdGroup.length >0){
                for(let i=0; i<state.page_Forum_QuestionRelated_Question.tagIdGroup.length; i++){
                    let tagId = state.page_Forum_QuestionRelated_Question.tagIdGroup[i];
                    formData.append('page_question_tagId', tagId);
                    break;
                }
            }
            formData.append('page_question_tag_transferPrameter', state.page_Forum_QuestionRelated_Question.page_question_tag_transferPrameter.toString());
            formData.append('page_question_sort', String(state.page_Forum_QuestionRelated_Question.page_question_sort));
            formData.append('page_question_filterCondition', String(state.page_Forum_QuestionRelated_Question.page_question_filterCondition));
            formData.append('page_question_filterCondition_transferPrameter', state.page_Forum_QuestionRelated_Question.page_question_filterCondition_transferPrameter.toString());
            formData.append('page_question_sort', String(state.page_Forum_QuestionRelated_Question.page_question_sort));
            formData.append('page_question_maxResult', state.page_Forum_QuestionRelated_Question.page_question_maxResult);
            formData.append('page_question_pageCount', state.page_Forum_QuestionRelated_Question.page_question_pageCount);
        }
        if(state.forumType == '问答' && state.forumChildType == '答案列表' && state.displayType == '分页'){
            formData.append('page_answer_sort', String(state.page_Forum_AnswerRelated_Answer.page_answer_sort));
            formData.append('page_answer_maxResult',state.page_Forum_AnswerRelated_Answer.page_answer_maxResult);
            formData.append('page_answer_pageCount', state.page_Forum_AnswerRelated_Answer.page_answer_pageCount);
        }
        if(state.forumType == '问答' && state.forumChildType == '相似问题' && state.displayType == '集合'){
            formData.append('collection_likeQuestion_maxResult', state.collection_Forum_QuestionRelated_LikeQuestion.collection_likeQuestion_maxResult);
        }
        
        if(state.forumType == '红包' && state.forumChildType == '领取红包用户列表' && state.displayType == '分页'){
            formData.append('page_receiveRedEnvelopeUser_sort', String(state.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_sort));
            formData.append('page_receiveRedEnvelopeUser_maxResult', state.page_Forum_RedEnvelopeRelated_ReceiveRedEnvelopeUser.page_receiveRedEnvelopeUser_maxResult);
        }
        
        if(state.forumType == '广告' && state.forumChildType == '图片广告' && state.displayType == '集合'){
            for(let i=0; i<state.collection_Forum_AdvertisingRelated_imageList.tableList.length; i++){
                let table = state.collection_Forum_AdvertisingRelated_imageList.tableList[i];

                let image_name = state.collection_Forum_AdvertisingRelated_imageList.collection_image_name[i];
                let image_link = state.collection_Forum_AdvertisingRelated_imageList.collection_image_link[i];
                formData.append('advertisingRelated_Image_Count', String(i));
                formData.append('collection_image_name', image_name);
                formData.append('collection_image_link', image_link);
                formData.append('collection_image_path', '');
                let flag = false;


                let fileList = state.collection_Forum_AdvertisingRelated_imageList.uploadImgs[i];
                if(fileList != null && fileList.length >0){
                    for(let i=0; i<fileList.length; i++){
                        let file = fileList[i];
                        flag = true;
                        formData.append('collection_image_uploadImage', file.raw);
                        break;
                    }
                }
                if(!flag){
                    formData.append('collection_image_uploadImage', new File([], '', {}));//空文件占位
                
                }

            }
        }
        if(state.forumType == '在线帮助' && state.forumChildType == '在线帮助列表' && state.displayType == '单层'){
            if(state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup != null && state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup.length >0){
                for(let i=0; i<state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup.length; i++){
                    let helpTypeId = state.monolayer_Forum_HelpRelated_Help.helpTypeIdGroup[i];
                    formData.append('monolayer_help_helpTypeId', helpTypeId);
                    break;
                }
            }
            formData.append('monolayer_help_helpType_transferPrameter', state.monolayer_Forum_HelpRelated_Help.monolayer_help_helpType_transferPrameter.toString());
            formData.append('monolayer_help_quantity', state.monolayer_Forum_HelpRelated_Help.monolayer_help_quantity);
            formData.append('monolayer_help_more', state.monolayer_Forum_HelpRelated_Help.monolayer_help_more);
            formData.append('monolayer_help_maxResult', state.monolayer_Forum_HelpRelated_Help.monolayer_help_maxResult);
            formData.append('monolayer_help_pageCount', state.monolayer_Forum_HelpRelated_Help.monolayer_help_pageCount);
            formData.append('monolayer_help_sort', String(state.monolayer_Forum_HelpRelated_Help.monolayer_help_sort));
        }
        if(state.forumType == '在线帮助' && state.forumChildType == '在线帮助列表' && state.displayType == '分页'){
            if(state.page_Forum_HelpRelated_Help.helpTypeIdGroup != null && state.page_Forum_HelpRelated_Help.helpTypeIdGroup.length >0){
                for(let i=0; i<state.page_Forum_HelpRelated_Help.helpTypeIdGroup.length; i++){
                    let helpTypeId = state.page_Forum_HelpRelated_Help.helpTypeIdGroup[i];
                    formData.append('page_help_helpTypeId', helpTypeId);
                    break;
                }
            }
            formData.append('page_help_helpType_transferPrameter', state.page_Forum_HelpRelated_Help.page_help_helpType_transferPrameter.toString());
            formData.append('page_help_maxResult', state.page_Forum_HelpRelated_Help.page_help_maxResult);
            formData.append('page_help_pageCount', state.page_Forum_HelpRelated_Help.page_help_pageCount);
            formData.append('page_help_sort', String(state.page_Forum_HelpRelated_Help.page_help_sort));
        }
        if(state.forumType == '在线帮助' && state.forumChildType == '推荐在线帮助' && state.displayType == '集合'){
            if(state.collection_Forum_HelpRelated_RecommendHelp.tableList != null && state.collection_Forum_HelpRelated_RecommendHelp.tableList.length >0){	
                for(let i=0; i<state.collection_Forum_HelpRelated_RecommendHelp.tableList.length; i++){
                    let help:any = state.collection_Forum_HelpRelated_RecommendHelp.tableList[i];
                    formData.append('collection_recommendHelp_helpId', help.id);
                }
            }
        }
        if(state.forumType == '自定义版块' && state.forumChildType == '用户自定义HTML' && state.displayType == '实体对象'){
            if(entityBean_customForum_htmlContent_ref.value.value != null && entityBean_customForum_htmlContent_ref.value.value !=''){
                formData.append('entityBean_customForum_htmlContent', entityBean_customForum_htmlContent_ref.value.value);
            }
        }
        if(state.forumType == '系统' && state.forumChildType == '热门搜索词' && state.displayType == '集合'){
            if(state.collection_Forum_SystemRelated_SearchWord.formOptions != null && state.collection_Forum_SystemRelated_SearchWord.formOptions.length >0){
                for(let i=0; i<state.collection_Forum_SystemRelated_SearchWord.formOptions.length; i++){
                    let formOption = state.collection_Forum_SystemRelated_SearchWord.formOptions[i];
                    formData.append('collection_searchWord', formOption.value);
                    
                }
            }
        }
        
        proxy?.$axios({
            url: '/control/forum/manage?method=add',
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
							path : '/admin/control/forum/list',
							query:{ 
								layoutId : state.layoutId,
								dirName : state.dirName,
								sourcePage: (router.currentRoute.value.query.sourcePage != undefined ? router.currentRoute.value.query.sourcePage:''),
								page :(router.currentRoute.value.query.page != undefined ? router.currentRoute.value.query.page:''),
							}
						});
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo_forum(returnValue.data as Map<string,string> , error,()=>{});

			    		
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

        if(router.currentRoute.value.query.dirName != undefined && router.currentRoute.value.query.dirName != ''){
			state.dirName = router.currentRoute.value.query.dirName as string;
		}
		if(router.currentRoute.value.query.layoutId != undefined && router.currentRoute.value.query.layoutId != ''){
			state.layoutId = router.currentRoute.value.query.layoutId as string;
		}
		
		queryAddForumUI();
        
    }) 

    
    //监听版块子类型值变化
    watch(() => state.forumChildType, (val, old) => {
        queryForumTemplateFileName(val);
        if(val == "图片广告"){
            if(state.collection_Forum_AdvertisingRelated_imageList.collection_image_name.length ==0){
                advertising_imageList_addItem();
            }
        }
    })
    watch(() => state.module, (val, old) => {
        nextTick(()=>{//渲染结束再监听
            if(state.forumChildType == '在线帮助列表' && state.displayType == '单层' && state.monolayer_Forum_HelpRelated_Help.moreOptions.length ==0){
                load_monolayer_helpType_more();
            }
            if(state.forumChildType == '用户自定义HTML' && state.displayType == '实体对象'){
                if(Object.keys(state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject).length === 0){
                    entityBean_Forum_CustomForumRelated_CustomHTML_editor();
                }
            }
        });
    })


    //keep-alive 进入时
    onActivated (()=>{
        if (Object.keys(state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject).length != 0) {//不等于空
			//创建富文本编辑器
			state.entityBean_Forum_CustomForumRelated_CustomHTML.editor = createEditor(
				state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject.ref, 
				state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject.availableTag, 
				state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject.uploadPath, 
				state.entityBean_Forum_CustomForumRelated_CustomHTML.editorCreateParameObject.userGradeList,
                store_fileStorageSystem.value
			);
		}
    })

    // keep-alive 离开时
    onDeactivated (()=>{
        if (Object.keys(state.entityBean_Forum_CustomForumRelated_CustomHTML.editor).length != 0) {//不等于空
            state.entityBean_Forum_CustomForumRelated_CustomHTML.editor.remove();
            state.entityBean_Forum_CustomForumRelated_CustomHTML.editor = {};
        }
    })



</script>