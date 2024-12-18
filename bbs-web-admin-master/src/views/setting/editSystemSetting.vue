<!-- 基本设置 -->
<template>
    <div class="main" >
        <div class="data-form label-width-blank systemSettingModule" >
            <el-form label-width="270px"  @submit.native.prevent>
                <el-tabs v-model="state.activeTag" type="card" >
                    <el-tab-pane label="基本设置" :name="10"></el-tab-pane>
                    <el-tab-pane label="话题编辑器" :name="20"></el-tab-pane>
                    <el-tab-pane label="评论编辑器" :name="30"></el-tab-pane>
                    <el-tab-pane label="问题编辑器" :name="40"></el-tab-pane>
                    <el-tab-pane label="答案编辑器" :name="50"></el-tab-pane>
                </el-tabs>
            
                <el-form-item label="站点名称" :required="true" :error="error.title" v-show="state.activeTag == 10">
                    <el-input v-model.trim="state.title" maxlength="200" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="站点关键词(keywords)" :error="error.keywords" v-show="state.activeTag == 10">
                    <el-input v-model.trim="state.keywords" maxlength="200" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="站点描述(description)" :error="error.description" v-show="state.activeTag == 10">
                    <el-input v-model.trim="state.description" maxlength="200" :clearable="true" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="关闭站点" :error="error.closeSite" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.closeSite" size="large">
                        <el-radio-button :label="1">打开</el-radio-button>
                        <el-radio-button :label="2">只读模式</el-radio-button>
                        <el-radio-button :label="3">全站关闭</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关闭站点提示信息" v-show="state.activeTag == 10 && state.closeSite ==3" :error="error.closeSitePrompt">
                    <el-input type="textarea" v-model="state.closeSitePrompt" :autosize="{minRows: 4}" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="支持访问设备" :error="error.supportAccessDevice" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.supportAccessDevice">
                        <el-radio :label="1">自动识别终端</el-radio>
                        <el-radio :label="2">电脑端</el-radio>
                        <el-radio :label="3">移动端</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="支持编辑器" :error="error.supportEditor" v-show="state.activeTag == 10" >
                    <el-radio-group v-model="state.supportEditor">
                        <el-radio :label="10">仅富文本编辑器</el-radio>
                        <el-radio :label="20" disabled >仅Markdown编辑器</el-radio>
                        <el-radio :label="30" disabled >富文本编辑器优先</el-radio>
                        <el-radio :label="40" disabled >Markdown编辑器优先</el-radio>
                    </el-radio-group>
                    <div class="form-help" >仅支持前后端分离模板</div>
                </el-form-item>
                <el-form-item label="允许注册账号类型" v-show="state.activeTag == 10">
                    <el-checkbox v-model="state.allowRegisterAccountObject.local">本地账号密码用户</el-checkbox>
                    <el-checkbox v-model="state.allowRegisterAccountObject.mobile">手机用户</el-checkbox>
                    <el-checkbox v-model="state.allowRegisterAccountObject.weChat">微信用户</el-checkbox>
                </el-form-item>
                <el-form-item label="注册是否需要验证码" :error="error.registerCaptcha" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.registerCaptcha">
                        <el-radio :label="true">需要</el-radio>
                        <el-radio :label="false">不需要</el-radio>
                    </el-radio-group>
                </el-form-item>
                
                    
                <el-form-item label="登录密码每分钟连续错误" :error="error.login_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.login_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="发表话题每分钟提交超过" :error="error.topic_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.topic_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="发表评论每分钟提交超过" :error="error.comment_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.comment_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="提交问题每分钟提交超过" :error="error.question_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.question_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="提交答案每分钟提交超过" :error="error.answer_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.answer_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="发表私信每分钟提交超过" :error="error.privateMessage_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.privateMessage_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="举报每分钟提交超过" :error="error.report_submitQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.report_submitQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为每次都出现验证码</div>
                </el-form-item>
                <el-form-item label="举报图片允许最大上传数量" :error="error.reportMaxImageUpload" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.reportMaxImageUpload" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0为不允许上传图片</div>
                </el-form-item>
                <el-form-item label="提交问题最多可选择标签数量" :error="error.maxQuestionTagQuantity" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.maxQuestionTagQuantity" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="发表话题奖励积分" :error="error.topic_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.topic_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="发表评论奖励积分" :error="error.comment_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.comment_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="发表回复奖励积分" :error="error.reply_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.reply_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="提交问题奖励积分" :error="error.question_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.question_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="提交答案奖励积分" :error="error.answer_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.answer_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="提交答案回复奖励积分" :error="error.answerReply_rewardPoint" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.answerReply_rewardPoint" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="前台发表话题审核" :error="error.topic_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.topic_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="前台发表评论审核" :error="error.comment_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.comment_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="前台发表回复审核" :error="error.reply_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.reply_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="前台提交问题审核" :error="error.question_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.question_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="前台提交答案审核" :error="error.answer_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.answer_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="前台提交答案回复审核" :error="error.answerReply_review" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.answerReply_review">
                        <el-radio :label="10">全部审核</el-radio>
                        <el-radio :label="30">特权会员免审核</el-radio>
                        <el-radio :label="50">无需审核</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许提交在线留言" :error="error.allowFeedback" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowFeedback">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全局允许提交话题" :error="error.allowTopic" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowTopic">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全局允许提交评论" :error="error.allowComment" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowComment">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全局允许提交问题" :error="error.allowQuestion" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowQuestion">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全局允许提交答案" :error="error.allowAnswer" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowAnswer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="实名用户才允许提交话题" :error="error.realNameUserAllowTopic" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.realNameUserAllowTopic">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="实名用户才允许提交评论" :error="error.realNameUserAllowComment" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.realNameUserAllowComment">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="实名用户才允许提交问题" :error="error.realNameUserAllowQuestion" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.realNameUserAllowQuestion">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="实名用户才允许提交答案" :error="error.realNameUserAllowAnswer" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.realNameUserAllowAnswer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全局允许提交举报" :error="error.allowReport" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowReport">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否显示IP归属地" :error="error.showIpAddress" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.showIpAddress">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="话题热度因子加权" :error="error.topicHeatFactor" v-show="state.activeTag == 10">
                    <el-col :span="16"><el-input v-model.trim="state.topicHeatFactor" maxlength="100" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >以竖线符号分割各热度因子，因子的分数越高，在热度因子中占比重越大；如果不设参数，则因子的加权值默认为1；因子加权值“评论|点赞|浏览量”可以为0至9999之间的整数，“重力因子”可以为0.1至2之间的数。示例：评论=20|点赞=10|浏览量=1|重力因子=1.8    </div>
                </el-form-item>
                <el-form-item label="热门话题" :error="error.topicHotRecommendedTime" v-show="state.activeTag == 10">
                    <div class="singleRowTable">
                        <div class="leftCell">
                            仅推荐发布
                        </div>
                        <div style="width: 150px;">
                            <el-input v-model.trim="state.topicHotRecommendedTime" maxlength="8" :clearable="true" show-word-limit></el-input>
                        </div>
                        <div class="rightCell">
                            小时内的话题
                        </div>
                    </div>
                    <div class="form-help" >空值为不限制</div>
                </el-form-item>
                <el-form-item label="解锁话题隐藏内容平台分成比例" :error="error.topicUnhidePlatformShareProportion" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.topicUnhidePlatformShareProportion" maxlength="3" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">%</el-col>
                    <div class="form-help" >0至100之间的整数</div>
                </el-form-item> 
                
                
                <el-form-item label="问题悬赏积分下限" :error="error.questionRewardPointMin" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.questionRewardPointMin" :required="true" maxlength="15" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0至999999999999999之间的整数</div>
                </el-form-item>
                <el-form-item label="问题悬赏积分上限" :error="error.questionRewardPointMax" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.questionRewardPointMax" :required="true" maxlength="15" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为无限制 0则不允许悬赏积分</div>
                </el-form-item>
                <el-form-item label="问题悬赏金额下限" :error="error.questionRewardAmountMin" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.questionRewardAmountMin" :required="true" maxlength="12" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0至99999999之间的金额</div>
                </el-form-item>
                <el-form-item label="问题悬赏金额上限" :error="error.questionRewardAmountMax" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.questionRewardAmountMax" :required="true" maxlength="12" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为无限制 0则不允许悬赏金额</div>
                </el-form-item>
            
                <el-form-item label="悬赏问答平台分成比例" :error="error.questionRewardPlatformShareProportion" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.questionRewardPlatformShareProportion" maxlength="3" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">%</el-col>
                    <div class="form-help" >0至100之间的整数</div>
                </el-form-item> 
                
                <el-form-item label="发红包总金额下限" :error="error.giveRedEnvelopeAmountMin" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.giveRedEnvelopeAmountMin" :required="true" maxlength="12" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >0.01至99999999之间的金额</div>
                </el-form-item>
                <el-form-item label="发红包总金额上限" :error="error.giveRedEnvelopeAmountMax" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.giveRedEnvelopeAmountMax" :required="true" maxlength="12" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为无限制 0则不允许发红包</div>
                </el-form-item>
                <el-form-item label="敏感词过滤" :error="error.allowFilterWord" v-show="state.activeTag == 10">
                    <el-radio-group v-model="state.allowFilterWord" size="large">
                        <el-radio-button :label="true">打开</el-radio-button>
                        <el-radio-button :label="false">关闭</el-radio-button>
                    </el-radio-group>
                    <div class="form-help" >前台发表话题/评论/回复时过滤</div>
                </el-form-item>
                <el-form-item label="敏感词替换为" v-show="state.activeTag == 10 && state.allowFilterWord ==true" :error="error.filterWordReplace">
                    <el-col :span="6"><el-input v-model.trim="state.filterWordReplace" :required="true" maxlength="30" :clearable="true" show-word-limit></el-input></el-col>
                </el-form-item>
                <el-form-item label="文件防盗链密钥" v-show="state.activeTag == 10" :error="error.fileSecureLinkSecret">
                    <el-col :span="10"><el-input v-model.trim="state.fileSecureLinkSecret" :required="true" maxlength="16" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >必须和Nginx的Secure Link模块密钥一致，并且为16个字符</div>
                </el-form-item>
                <el-form-item label="文件防盗链过期时间" :error="error.fileSecureLinkExpire" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.fileSecureLinkExpire" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">秒</el-col>
                </el-form-item> 
                <el-form-item label="允许 @提及 用户最大数量" :error="error.allowMentionMaxNumber" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.allowMentionMaxNumber" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空值为不限制</div>
                </el-form-item>
                <el-form-item label="前台分页数量" :error="error.forestagePageNumber" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.forestagePageNumber" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为默认20条</div>
                </el-form-item>
                <el-form-item label="后台分页数量" :error="error.backstagePageNumber" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.backstagePageNumber" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为默认20条</div>
                </el-form-item>
                <el-form-item label="上传临时文件有效期" :error="error.temporaryFileValidPeriod" v-show="state.activeTag == 10">
                    <div class="singleRowTable">
                        <div class="leftCell">
                            文件上传
                        </div>
                        <div style="width: 150px;">
                            <el-input v-model.trim="state.temporaryFileValidPeriod" maxlength="8" :clearable="true" show-word-limit></el-input>
                        </div>
                        <div class="rightCell">
                            分钟内未提交表单由定时任务自动删除
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="每用户每24小时内发送短信最大限制次数" :error="error.userSentSmsCount" v-show="state.activeTag == 10">
                    <el-col :span="6"><el-input v-model.trim="state.userSentSmsCount" :required="true" maxlength="8" :clearable="true" show-word-limit></el-input></el-col>
                    <div class="form-help" >空为无限制 &nbsp;短信发送最大数量受短信服务商限制</div>
                </el-form-item>
                
                
                <!-- 话题编辑器 -->
                <el-form-item label="字体" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.fontname">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字大小" v-show="state.activeTag == 20">
                    <span class="container-icon"><span class="toolbar-icon-url icon-fontsize"></span></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.fontsize">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字颜色" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-forecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.forecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字背景" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-hilitecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hilitecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="粗体" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-bold"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.bold">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="斜体" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-italic"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.italic">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="下划线" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-underline"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.underline">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="删除格式" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-removeformat"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.removeformat">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="超级链接" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-link"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.link">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="取消超级链接" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-unlink"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.unlink">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="左对齐" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-justifyleft"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.justifyleft">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="居中" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-justifycenter"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.justifycenter">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="右对齐" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-justifyright"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.justifyright">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编号" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.insertorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目符号" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-insertunorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.insertunorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="代码" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-code"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.code">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="插入表情" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-emoticons"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.emoticons">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="输入密码可见" v-show="state.activeTag == 20">
                    <span class="icon-hide" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hidePassword">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="评论话题可见" v-show="state.activeTag == 20">
                    <span class="icon-hide" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hideComment">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="达到等级可见" v-show="state.activeTag == 20">
                    <span class="icon-hide" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hideGrade">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="积分购买可见" v-show="state.activeTag == 20">
                    <span class="icon-hide" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hidePoint">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="余额购买可见" v-show="state.activeTag == 20">
                    <span class="icon-hide" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.hideAmount">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="提及" v-show="state.activeTag == 20">
                    <span class="icon-mention" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition" disabled v-model="state.topicEditorTagObject.mention">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全屏显示" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-fullscreen"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.fullscreen">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-image"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.image">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传图片格式" :error="error.topicEditorTagObject.imageFormat" v-show="state.activeTag == 20 && state.topicEditorTagObject.image == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.topicEditorTagObject.imageFormat">
                        <el-checkbox :label="imageUploadFormat" v-for="imageUploadFormat in state.imageUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传图片大小" :error="error.topicEditorTagObject.imageSize" v-show="state.activeTag == 20 && state.topicEditorTagObject.image == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.topicEditorTagObject.imageSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                <el-form-item label="文件" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-insertfile"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.file">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传文件格式" :error="error.topicEditorTagObject.fileFormat" v-show="state.activeTag == 20 && state.topicEditorTagObject.file == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.topicEditorTagObject.fileFormat">
                        <el-checkbox :label="fileUploadFormat" v-for="fileUploadFormat in state.fileUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传文件大小" :error="error.topicEditorTagObject.fileSize" v-show="state.activeTag == 20 && state.topicEditorTagObject.file == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.topicEditorTagObject.fileSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                <el-form-item label="嵌入视频" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-media"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.embedVideo">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传视频" v-show="state.activeTag == 20">
                    <span class="toolbar-icon-url icon-media"></span>
                    <el-radio-group class="radioPosition"  v-model="state.topicEditorTagObject.uploadVideo">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传视频格式" :error="error.topicEditorTagObject.videoFormat" v-show="state.activeTag == 20 && state.topicEditorTagObject.uploadVideo == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.topicEditorTagObject.videoFormat">
                        <el-checkbox :label="videoUploadFormat" v-for="videoUploadFormat in state.videoUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传视频大小" :error="error.topicEditorTagObject.videoSize" v-show="state.activeTag == 20 && state.topicEditorTagObject.uploadVideo == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.topicEditorTagObject.videoSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                
                <!-- 评论编辑器 -->
                <el-form-item label="字体" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.fontname">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字大小" v-show="state.activeTag == 30">
                    <span class="container-icon"><span class="toolbar-icon-url icon-fontsize"></span></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.fontsize">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字颜色" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-forecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.forecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字背景" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-hilitecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.hilitecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="粗体" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-bold"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.bold">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="斜体" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-italic"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.italic">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="下划线" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-underline"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.underline">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="删除格式" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-removeformat"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.removeformat">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="超级链接" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-link"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.link">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="取消超级链接" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-unlink"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.unlink">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="左对齐" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-justifyleft"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.justifyleft">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="居中" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-justifycenter"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.justifycenter">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="右对齐" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-justifyright"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.justifyright">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编号" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.insertorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目符号" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-insertunorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.insertunorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="代码" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-code"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.code">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="插入表情" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-emoticons"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.emoticons">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="提及" v-show="state.activeTag == 30">
                    <span class="icon-mention" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition" disabled v-model="state.editorTagObject.mention">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全屏显示" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-fullscreen"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.fullscreen">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="state.activeTag == 30">
                    <span class="toolbar-icon-url icon-image"></span>
                    <el-radio-group class="radioPosition"  v-model="state.editorTagObject.image">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传图片格式" :error="error.editorTagObject.imageFormat" v-show="state.activeTag == 30 && state.editorTagObject.image == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.editorTagObject.imageFormat">
                        <el-checkbox :label="imageUploadFormat" v-for="imageUploadFormat in state.imageUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传图片大小" :error="error.editorTagObject.imageSize" v-show="state.activeTag == 30 && state.editorTagObject.image == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.editorTagObject.imageSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                
                <!-- 问题编辑器 -->
                <el-form-item label="字体" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.fontname">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字大小" v-show="state.activeTag == 40">
                    <span class="container-icon"><span class="toolbar-icon-url icon-fontsize"></span></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.fontsize">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字颜色" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-forecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.forecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字背景" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-hilitecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.hilitecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="粗体" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-bold"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.bold">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="斜体" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-italic"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.italic">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="下划线" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-underline"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.underline">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="删除格式" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-removeformat"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.removeformat">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="超级链接" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-link"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.link">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="取消超级链接" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-unlink"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.unlink">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="左对齐" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-justifyleft"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.justifyleft">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="居中" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-justifycenter"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.justifycenter">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="右对齐" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-justifyright"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.justifyright">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编号" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.insertorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目符号" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-insertunorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.insertunorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="代码" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-code"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.code">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="插入表情" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-emoticons"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.emoticons">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="提及" v-show="state.activeTag == 40">
                    <span class="icon-mention" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition" disabled v-model="state.questionEditorTagObject.mention">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全屏显示" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-fullscreen"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.fullscreen">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="state.activeTag == 40">
                    <span class="toolbar-icon-url icon-image"></span>
                    <el-radio-group class="radioPosition"  v-model="state.questionEditorTagObject.image">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传图片格式" :error="error.questionEditorTagObject.imageFormat" v-show="state.activeTag == 40 && state.questionEditorTagObject.image == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.questionEditorTagObject.imageFormat">
                        <el-checkbox :label="imageUploadFormat" v-for="imageUploadFormat in state.imageUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传图片大小" :error="error.questionEditorTagObject.imageSize" v-show="state.activeTag == 40 && state.questionEditorTagObject.image == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.questionEditorTagObject.imageSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                
                <!-- 答案编辑器 -->
                <el-form-item label="字体" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.fontname">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字大小" v-show="state.activeTag == 50">
                    <span class="container-icon"><span class="toolbar-icon-url icon-fontsize"></span></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.fontsize">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字颜色" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-forecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.forecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="文字背景" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-hilitecolor"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.hilitecolor">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="粗体" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-bold"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.bold">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="斜体" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-italic"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.italic">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="下划线" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-underline"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.underline">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="删除格式" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-removeformat"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.removeformat">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="超级链接" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-link"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.link">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="取消超级链接" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-unlink"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.unlink">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="左对齐" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-justifyleft"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.justifyleft">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="居中" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-justifycenter"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.justifycenter">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="右对齐" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-justifyright"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.justifyright">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="编号" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-insertorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.insertorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目符号" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-insertunorderedlist"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.insertunorderedlist">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="代码" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-code"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.code">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="插入表情" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-emoticons"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.emoticons">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="提及" v-show="state.activeTag == 50">
                    <span class="icon-mention" style="width: 16px;height: 16px;position: relative;top: -1px;margin-left: -9px;margin-right: 9px;"></span>
                    <el-radio-group class="radioPosition" disabled v-model="state.answerEditorTagObject.mention">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="全屏显示" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-fullscreen"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.fullscreen">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图片" v-show="state.activeTag == 50">
                    <span class="toolbar-icon-url icon-image"></span>
                    <el-radio-group class="radioPosition"  v-model="state.answerEditorTagObject.image">
                        <el-radio :label="true">打开</el-radio>
                        <el-radio :label="false">关闭</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="允许上传图片格式" :error="error.answerEditorTagObject.imageFormat" v-show="state.activeTag == 50 && state.answerEditorTagObject.image == true">
                    <el-checkbox-group class="singColumnPlaceholder" v-model="state.answerEditorTagObject.imageFormat">
                        <el-checkbox :label="imageUploadFormat" v-for="imageUploadFormat in state.imageUploadFormatList"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="允许上传图片大小" :error="error.answerEditorTagObject.imageSize" v-show="state.activeTag == 50 && state.answerEditorTagObject.image == true">
                    <el-col :span="8" class="multipleColumnPlaceholder"><el-input v-model.trim="state.answerEditorTagObject.imageSize" maxlength="10" :clearable="true" show-word-limit></el-input></el-col>
                    <el-col :span="6" style="margin-left: 10px;">K</el-col>
                </el-form-item> 
                
                <el-form-item label=" ">
                    <el-button type="primary" size="large" class="submitButton" @click="submitForm" :disabled="state.submitForm_disabled">提交</el-button>
                </el-form-item>
            </el-form>
            
            
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ComponentInternalInstance, getCurrentInstance, onMounted, reactive } from 'vue';
    import pinia from '@/store/store'
    import {useStore} from '@/store'
    import { AxiosResponse } from 'axios';
    import { useRouter } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import { getType, processErrorInfo ,processErrorInfo_object} from '@/utils/tool';
    import { AllowRegisterAccount, EditorTag } from '@/types';


    const store = useStore(pinia);
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    const router = useRouter();


    const state = reactive({
        imageUploadFormatList :[],
        fileUploadFormatList:[],
		videoUploadFormatList:[],
			
        activeTag: 10,//选项卡
        
        title :'',
        keywords:'',
        description:'',
        closeSite:1,
        closeSitePrompt:'',
        supportAccessDevice:1,
        supportEditor:10,
        allowRegisterAccountObject:{} as AllowRegisterAccount,
        registerCaptcha:false,
        login_submitQuantity:'',
        topic_submitQuantity:'',
        comment_submitQuantity:'',
        question_submitQuantity:'',
        answer_submitQuantity:'',
        privateMessage_submitQuantity:'',
        report_submitQuantity:'',
        reportMaxImageUpload:'',
        maxQuestionTagQuantity:'',
        topic_rewardPoint:'',
        comment_rewardPoint:'',
        reply_rewardPoint:'',
        question_rewardPoint:'',
        answer_rewardPoint:'',
        answerReply_rewardPoint:'',
        topic_review:10,
        comment_review:10,
        reply_review:10,
        question_review:10,
        answer_review:10,
        answerReply_review:10,
        allowFeedback:false,
        allowTopic:false,
        allowComment:false,
        allowQuestion:false,
        allowAnswer:false,
        realNameUserAllowTopic:false,
        realNameUserAllowComment:false,
        realNameUserAllowQuestion:false,
        realNameUserAllowAnswer:false,
        allowReport:true,
		showIpAddress:false,
        topicHeatFactor:'',
		topicHotRecommendedTime:'',
        questionRewardPointMin:'',
        questionRewardPointMax:'',
        questionRewardAmountMin:'',
        questionRewardAmountMax:'',
        topicUnhidePlatformShareProportion:'',
        questionRewardPlatformShareProportion:'',
        giveRedEnvelopeAmountMin:'',
        giveRedEnvelopeAmountMax:'',
        allowFilterWord:false,
        filterWordReplace:'',
        fileSecureLinkSecret:'',
        fileSecureLinkExpire:'',
        forestagePageNumber:'',
        backstagePageNumber:'',
        temporaryFileValidPeriod:'',
        userSentSmsCount:'',
        allowMentionMaxNumber:'',

        topicEditorTagObject:{} as EditorTag,//话题编辑器
        editorTagObject:{} as EditorTag,//评论编辑器
        questionEditorTagObject:{} as EditorTag,//问题编辑器
        answerEditorTagObject:{} as EditorTag,//答案编辑器
        
        submitForm_disabled:false,//提交按钮是否禁用
    });
    const error = reactive({
        title :'',
        keywords:'',
        description:'',
        closeSite :'',
        closeSitePrompt:'',
        supportAccessDevice :'',
        supportEditor :'',
        allowRegisterAccountObject:'',
        registerCaptcha :'',
        login_submitQuantity:'',
        topic_submitQuantity:'',
        comment_submitQuantity:'',
        question_submitQuantity:'',
        answer_submitQuantity:'',
        privateMessage_submitQuantity:'',
        report_submitQuantity:'',
        reportMaxImageUpload:'',
        maxQuestionTagQuantity:'',
        topic_rewardPoint:'',
        comment_rewardPoint:'',
        reply_rewardPoint:'',
        question_rewardPoint:'',
        answer_rewardPoint:'',
        answerReply_rewardPoint:'',
        topic_review :'',
        comment_review :'',
        reply_review :'',
        question_review :'',
        answer_review :'',
        answerReply_review :'',
        allowFeedback :'',
        allowTopic :'',
        allowComment :'',
        allowQuestion :'',
        allowAnswer :'',
        realNameUserAllowTopic :'',
        realNameUserAllowComment :'',
        realNameUserAllowQuestion :'',
        realNameUserAllowAnswer :'',
        allowReport :'',
		showIpAddress :'',
        topicHeatFactor:'',
		topicHotRecommendedTime:'',
        questionRewardPointMin:'',
        questionRewardPointMax:'',
        questionRewardAmountMin:'',
        questionRewardAmountMax:'',
        topicUnhidePlatformShareProportion:'',
        questionRewardPlatformShareProportion:'',
        giveRedEnvelopeAmountMin:'',
        giveRedEnvelopeAmountMax:'',
        allowFilterWord :'',
        filterWordReplace:'',
        fileSecureLinkSecret:'',
        fileSecureLinkExpire:'',
        forestagePageNumber:'',
        backstagePageNumber:'',
        temporaryFileValidPeriod:'',
        userSentSmsCount:'',
        allowMentionMaxNumber:'',
        
        topicEditorTagObject:{
            imageFormat:'',
            imageSize:'',
            fileFormat:'',
            fileSize:'',
            videoFormat:'',
            videoSize:'',
        },
        editorTagObject:{
            imageFormat:'',
            imageSize:'',
        },
        questionEditorTagObject:{
            imageFormat:'',
            imageSize:'',
        },
        answerEditorTagObject:{
            imageFormat:'',
            imageSize:'',
        },
    });


    //查询基本设置
    const queryEditSystemSetting = () => {
        proxy?.$axios({
            url: '/control/systemSetting/manage/edit',
            method: 'get',
            params: {
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
			    			let systemSetting = null;
			    			if(key == "systemSetting"){
			    				systemSetting = mapData[key];
			    			}else if(key == "imageUploadFormatList"){
			    				state.imageUploadFormatList = mapData[key];
			    			}else if(key == "fileUploadFormatList"){
			    				state.fileUploadFormatList = mapData[key];
			    			}else if(key == "videoUploadFormatList"){
			    				state.videoUploadFormatList = mapData[key];
			    			}
			    		
			    			
			    			if(systemSetting != null){
			    				if(systemSetting.title != null){
			    					state.title = systemSetting.title;
			    				}
			    				if(systemSetting.keywords != null){
			    					state.keywords = systemSetting.keywords;
			    				}
			    				if(systemSetting.description != null){
			    					state.description = systemSetting.description;
			    				}
			    				state.closeSite = systemSetting.closeSite;
			    				if(systemSetting.closeSitePrompt != null){
			    					state.closeSitePrompt = systemSetting.closeSitePrompt;
			    				}
			    				state.supportAccessDevice = systemSetting.supportAccessDevice;
                                state.supportEditor = systemSetting.supportEditor;
			    				if(systemSetting.allowRegisterAccountObject != null){
			    					state.allowRegisterAccountObject = systemSetting.allowRegisterAccountObject;
			    				}
			    				state.registerCaptcha = systemSetting.registerCaptcha;
			    				if(systemSetting.login_submitQuantity != null){
			    					state.login_submitQuantity = systemSetting.login_submitQuantity;
			    				}
			    				if(systemSetting.topic_submitQuantity != null){
			    					state.topic_submitQuantity = systemSetting.topic_submitQuantity;
			    				}
			    				if(systemSetting.comment_submitQuantity != null){
			    					state.comment_submitQuantity = systemSetting.comment_submitQuantity;
			    				}
			    				if(systemSetting.question_submitQuantity != null){
			    					state.question_submitQuantity = systemSetting.question_submitQuantity;
			    				}
			    				if(systemSetting.answer_submitQuantity != null){
			    					state.answer_submitQuantity = systemSetting.answer_submitQuantity;
			    				}
			    				if(systemSetting.privateMessage_submitQuantity != null){
			    					state.privateMessage_submitQuantity = systemSetting.privateMessage_submitQuantity;
			    				}
                                if(systemSetting.report_submitQuantity != null){
			    					state.report_submitQuantity = systemSetting.report_submitQuantity;
			    				}
                                if(systemSetting.reportMaxImageUpload != null){
			    					state.reportMaxImageUpload = systemSetting.reportMaxImageUpload;
			    				}
			    				if(systemSetting.maxQuestionTagQuantity != null){
			    					state.maxQuestionTagQuantity = systemSetting.maxQuestionTagQuantity;
			    				}
			    				if(systemSetting.topic_rewardPoint != null){
			    					state.topic_rewardPoint = systemSetting.topic_rewardPoint;
			    				}
			    				if(systemSetting.comment_rewardPoint != null){
			    					state.comment_rewardPoint = systemSetting.comment_rewardPoint;
			    				}
			    				if(systemSetting.reply_rewardPoint != null){
			    					state.reply_rewardPoint = systemSetting.reply_rewardPoint;
			    				}
			    				if(systemSetting.question_rewardPoint != null){
			    					state.question_rewardPoint = systemSetting.question_rewardPoint;
			    				}
			    				if(systemSetting.answer_rewardPoint != null){
			    					state.answer_rewardPoint = systemSetting.answer_rewardPoint;
			    				}
			    				if(systemSetting.answerReply_rewardPoint != null){
			    					state.answerReply_rewardPoint = systemSetting.answerReply_rewardPoint;
			    				}
			    				if(systemSetting.topic_review != null){
			    					state.topic_review = systemSetting.topic_review;
			    				}
			    				if(systemSetting.comment_review != null){
			    					state.comment_review = systemSetting.comment_review;
			    				}
			    				if(systemSetting.reply_review != null){
			    					state.reply_review = systemSetting.reply_review;
			    				}
			    				if(systemSetting.question_review != null){
			    					state.question_review = systemSetting.question_review;
			    				}
			    				if(systemSetting.answer_review != null){
			    					state.answer_review = systemSetting.answer_review;
			    				}
			    				if(systemSetting.answerReply_review != null){
			    					state.answerReply_review = systemSetting.answerReply_review;
			    				}
			    				state.allowFeedback = systemSetting.allowFeedback;
			    				state.allowTopic = systemSetting.allowTopic;
			    				state.allowComment = systemSetting.allowComment;
			    				state.allowQuestion = systemSetting.allowQuestion;
			    				state.allowAnswer = systemSetting.allowAnswer;
			    				state.realNameUserAllowTopic = systemSetting.realNameUserAllowTopic;
			    				state.realNameUserAllowComment= systemSetting.realNameUserAllowComment;
			    				state.realNameUserAllowQuestion= systemSetting.realNameUserAllowQuestion;
			    				state.realNameUserAllowAnswer= systemSetting.realNameUserAllowAnswer;
			    				state.allowReport = systemSetting.allowReport;
			    				state.showIpAddress = systemSetting.showIpAddress;
                                if(systemSetting.topicHeatFactor != null){
			    					state.topicHeatFactor = systemSetting.topicHeatFactor;
			    				}
			    				if(systemSetting.topicHotRecommendedTime != null){
			    					state.topicHotRecommendedTime = systemSetting.topicHotRecommendedTime;
			    				}
			    				if(systemSetting.questionRewardPointMin != null){
			    					state.questionRewardPointMin = systemSetting.questionRewardPointMin;
			    				}
			    				if(systemSetting.questionRewardPointMax != null){
			    					state.questionRewardPointMax = systemSetting.questionRewardPointMax;
			    				}
			    				if(systemSetting.questionRewardAmountMin != null){
			    					state.questionRewardAmountMin = systemSetting.questionRewardAmountMin;
			    				}
			    				if(systemSetting.questionRewardAmountMax != null){
			    					state.questionRewardAmountMax = systemSetting.questionRewardAmountMax;
			    				}
			    				if(systemSetting.topicUnhidePlatformShareProportion != null){
			    					state.topicUnhidePlatformShareProportion = systemSetting.topicUnhidePlatformShareProportion;
			    				}
			    				if(systemSetting.questionRewardPlatformShareProportion != null){
			    					state.questionRewardPlatformShareProportion = systemSetting.questionRewardPlatformShareProportion;
			    				}
			    				if(systemSetting.giveRedEnvelopeAmountMin != null){
			    					state.giveRedEnvelopeAmountMin = systemSetting.giveRedEnvelopeAmountMin;
			    				}
			    				if(systemSetting.giveRedEnvelopeAmountMax != null){
			    					state.giveRedEnvelopeAmountMax = systemSetting.giveRedEnvelopeAmountMax;
			    				}
			    				state.allowFilterWord = systemSetting.allowFilterWord;
			    				if(systemSetting.filterWordReplace != null){
			    					state.filterWordReplace = systemSetting.filterWordReplace;
			    				}
			    				if(systemSetting.fileSecureLinkSecret != null){
			    					state.fileSecureLinkSecret = systemSetting.fileSecureLinkSecret;
			    				}
			    				if(systemSetting.fileSecureLinkExpire != null){
			    					state.fileSecureLinkExpire = systemSetting.fileSecureLinkExpire;
			    				}
			    				if(systemSetting.forestagePageNumber != null){
			    					state.forestagePageNumber = systemSetting.forestagePageNumber;
			    				}
			    				if(systemSetting.backstagePageNumber != null){
			    					state.backstagePageNumber = systemSetting.backstagePageNumber;
			    				}
			    				if(systemSetting.temporaryFileValidPeriod != null){
			    					state.temporaryFileValidPeriod = systemSetting.temporaryFileValidPeriod;
			    				}
			    				if(systemSetting.userSentSmsCount != null){
			    					state.userSentSmsCount = systemSetting.userSentSmsCount;
			    				}
                                if(systemSetting.allowMentionMaxNumber != null){
			    					state.allowMentionMaxNumber = systemSetting.allowMentionMaxNumber;
			    				}
			    				if(systemSetting.topicEditorTagObject != null){//话题编辑器
			    					let topicEditorTagObject = systemSetting.topicEditorTagObject;
			    					let imageFormat_arr = [];
			    					if(state.imageUploadFormatList != null && state.imageUploadFormatList.length >0){
			    						A:for(let i=0; i<state.imageUploadFormatList.length; i++){
			    							let imageUploadFormat = state.imageUploadFormatList[i];
			    							
			    							if(topicEditorTagObject.imageFormat != null && topicEditorTagObject.imageFormat.length >0){
			    								for(let j=0; j<topicEditorTagObject.imageFormat.length; j++){
			    									let format = topicEditorTagObject.imageFormat[j];
			    									if(imageUploadFormat == format){
			    										imageFormat_arr.push(imageUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							imageFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					let fileFormat_arr = [];
			    					if(state.fileUploadFormatList != null && state.fileUploadFormatList.length >0){
			    						A:for(let i=0; i<state.fileUploadFormatList.length; i++){
			    							let fileUploadFormat = state.fileUploadFormatList[i];
			    							
			    							if(topicEditorTagObject.fileFormat != null && topicEditorTagObject.fileFormat.length >0){
			    								for(let j=0; j<topicEditorTagObject.fileFormat.length; j++){
			    									let format = topicEditorTagObject.fileFormat[j];
			    									if(fileUploadFormat == format){
			    										fileFormat_arr.push(fileUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							fileFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					let videoFormat_arr = [];
			    					if(state.videoUploadFormatList != null && state.videoUploadFormatList.length >0){
			    						A:for(let i=0; i<state.videoUploadFormatList.length; i++){
			    							let videoUploadFormat = state.videoUploadFormatList[i];
			    							
			    							if(topicEditorTagObject.videoFormat != null && topicEditorTagObject.videoFormat.length >0){
			    								for(let j=0; j<topicEditorTagObject.videoFormat.length; j++){
			    									let format = topicEditorTagObject.videoFormat[j];
			    									if(videoUploadFormat == format){
			    										videoFormat_arr.push(videoUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							videoFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					topicEditorTagObject.imageFormat = imageFormat_arr;
			    					topicEditorTagObject.fileFormat = fileFormat_arr;
			    					topicEditorTagObject.videoFormat = videoFormat_arr;
			    					state.topicEditorTagObject = topicEditorTagObject;
			    				}
			    				if(systemSetting.editorTagObject != null){//评论编辑器
			    					let editorTagObject = systemSetting.editorTagObject;
			    					let imageFormat_arr = [];
			    					if(state.imageUploadFormatList != null && state.imageUploadFormatList.length >0){
			    						A:for(let i=0; i<state.imageUploadFormatList.length; i++){
			    							let imageUploadFormat = state.imageUploadFormatList[i];
			    							
			    							if(editorTagObject.imageFormat != null && editorTagObject.imageFormat.length >0){
			    								for(let j=0; j<editorTagObject.imageFormat.length; j++){
			    									let format = editorTagObject.imageFormat[j];
			    									if(imageUploadFormat == format){
			    										imageFormat_arr.push(imageUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							imageFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					editorTagObject.imageFormat = imageFormat_arr;
			    					state.editorTagObject = editorTagObject;
			    				}
			    				if(systemSetting.questionEditorTagObject != null){//问题编辑器
			    					let questionEditorTagObject = systemSetting.questionEditorTagObject;
			    					let imageFormat_arr = [];
			    					if(state.imageUploadFormatList != null && state.imageUploadFormatList.length >0){
			    						A:for(let i=0; i<state.imageUploadFormatList.length; i++){
			    							let imageUploadFormat = state.imageUploadFormatList[i];
			    							
			    							if(questionEditorTagObject.imageFormat != null && questionEditorTagObject.imageFormat.length >0){
			    								for(let j=0; j<questionEditorTagObject.imageFormat.length; j++){
			    									let format = questionEditorTagObject.imageFormat[j];
			    									if(imageUploadFormat == format){
			    										imageFormat_arr.push(imageUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							imageFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					questionEditorTagObject.imageFormat = imageFormat_arr;
			    					state.questionEditorTagObject = questionEditorTagObject;
			    				}
			    				if(systemSetting.answerEditorTagObject != null){//答案编辑器
			    					let answerEditorTagObject = systemSetting.answerEditorTagObject;
			    					let imageFormat_arr = [];
			    					if(state.imageUploadFormatList != null && state.imageUploadFormatList.length >0){
			    						A:for(let i=0; i<state.imageUploadFormatList.length; i++){
			    							let imageUploadFormat = state.imageUploadFormatList[i];
			    							
			    							if(answerEditorTagObject.imageFormat != null && answerEditorTagObject.imageFormat.length >0){
			    								for(let j=0; j<answerEditorTagObject.imageFormat.length; j++){
			    									let format = answerEditorTagObject.imageFormat[j];
			    									if(imageUploadFormat == format){
			    										imageFormat_arr.push(imageUploadFormat);
			    										continue A;
			    									}
			    								}
			    								
			    							}
			    							imageFormat_arr.push("-");//横杆代表空值
			    						}
			    						
			    					}
			    					answerEditorTagObject.imageFormat = imageFormat_arr;
			    					state.answerEditorTagObject = answerEditorTagObject;
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
                        value[key]= '';
                    }
                );
            }else{
                Object.assign(error, {[key] : ''});
            }
        }

        let formData = new FormData();
        if(state.title != null){
            formData.append('title', state.title);
        }
        if(state.keywords != null){
            formData.append('keywords', state.keywords);
        }
        if(state.description != null){
            formData.append('description', state.description);
        }
        if(state.closeSite != null){
            formData.append('closeSite', String(state.closeSite));
        }
        if(state.closeSitePrompt != null){
            formData.append('closeSitePrompt', state.closeSitePrompt);
        }
        if(state.supportAccessDevice != null){
            formData.append('supportAccessDevice', String(state.supportAccessDevice));
        }
        if(state.supportEditor != null){
            formData.append('supportEditor', String(state.supportEditor));
        }
        if(state.allowRegisterAccountObject != null){
            formData.append('allowRegisterAccountObject.local', state.allowRegisterAccountObject.local.toString());
            formData.append('allowRegisterAccountObject.mobile', state.allowRegisterAccountObject.mobile.toString());
            formData.append('allowRegisterAccountObject.weChat', state.allowRegisterAccountObject.weChat.toString());
        }
        
        if(state.registerCaptcha != null){
            formData.append('registerCaptcha', state.registerCaptcha.toString());
        }
        if(state.login_submitQuantity != null){
            formData.append('login_submitQuantity', state.login_submitQuantity);
        }
        if(state.topic_submitQuantity != null){
            formData.append('topic_submitQuantity', state.topic_submitQuantity);
        }
        if(state.comment_submitQuantity != null){
            formData.append('comment_submitQuantity', state.comment_submitQuantity);
        }
        if(state.question_submitQuantity != null){
            formData.append('question_submitQuantity', state.question_submitQuantity);
        }
        if(state.answer_submitQuantity != null){
            formData.append('answer_submitQuantity', state.answer_submitQuantity);
        }
        if(state.privateMessage_submitQuantity != null){
            formData.append('privateMessage_submitQuantity', state.privateMessage_submitQuantity);
        }
        if(state.report_submitQuantity != null){
            formData.append('report_submitQuantity', state.report_submitQuantity);
        }
        if(state.reportMaxImageUpload != null){
            formData.append('reportMaxImageUpload', state.reportMaxImageUpload);
        }
        if(state.maxQuestionTagQuantity != null){
            formData.append('maxQuestionTagQuantity', state.maxQuestionTagQuantity);
        }
        if(state.topic_rewardPoint != null){
            formData.append('topic_rewardPoint', state.topic_rewardPoint);
        }
        if(state.comment_rewardPoint != null){
            formData.append('comment_rewardPoint', state.comment_rewardPoint);
        }
        if(state.reply_rewardPoint != null){
            formData.append('reply_rewardPoint', state.reply_rewardPoint);
        }
        if(state.question_rewardPoint != null){
            formData.append('question_rewardPoint', state.question_rewardPoint);
        }
        if(state.answer_rewardPoint != null){
            formData.append('answer_rewardPoint', state.answer_rewardPoint);
        }
        if(state.answerReply_rewardPoint != null){
            formData.append('answerReply_rewardPoint', state.answerReply_rewardPoint);
        }
        if(state.topic_review != null){
            formData.append('topic_review', String(state.topic_review));
        }
        if(state.comment_review != null){
            formData.append('comment_review', String(state.comment_review));
        }
        if(state.reply_review != null){
            formData.append('reply_review', String(state.reply_review));
        }
        if(state.question_review != null){
            formData.append('question_review', String(state.question_review));
        }
        if(state.answer_review != null){
            formData.append('answer_review', String(state.answer_review));
        }
        if(state.answerReply_review != null){
            formData.append('answerReply_review', String(state.answerReply_review));
        }
        if(state.allowFeedback != null){
            formData.append('allowFeedback', state.allowFeedback.toString());
        }
        if(state.allowTopic != null){
            formData.append('allowTopic', state.allowTopic.toString());
        }
        if(state.allowComment != null){
            formData.append('allowComment', state.allowComment.toString());
        }
        if(state.allowQuestion != null){
            formData.append('allowQuestion', state.allowQuestion.toString());
        }
        if(state.allowAnswer != null){
            formData.append('allowAnswer', state.allowAnswer.toString());
        }
        if(state.realNameUserAllowTopic != null){
            formData.append('realNameUserAllowTopic', state.realNameUserAllowTopic.toString());
        }
        if(state.realNameUserAllowComment != null){
            formData.append('realNameUserAllowComment', state.realNameUserAllowComment.toString());
        }
        if(state.realNameUserAllowQuestion != null){
            formData.append('realNameUserAllowQuestion', state.realNameUserAllowQuestion.toString());
        }
        if(state.realNameUserAllowAnswer != null){
            formData.append('realNameUserAllowAnswer',state.realNameUserAllowAnswer.toString());
        }
        if(state.allowReport != null){
            formData.append('allowReport', state.allowReport.toString());
        }
        if(state.showIpAddress != null){
            formData.append('showIpAddress', state.showIpAddress.toString());
        }
        if(state.topicHeatFactor != null){
            formData.append('topicHeatFactor', state.topicHeatFactor);
        }
        if(state.topicHotRecommendedTime != null){
            formData.append('topicHotRecommendedTime', state.topicHotRecommendedTime);
        }
        if(state.questionRewardPointMin != null){
            formData.append('questionRewardPointMin', state.questionRewardPointMin);
        }
        if(state.questionRewardPointMax != null){
            formData.append('questionRewardPointMax', state.questionRewardPointMax);
        }
        if(state.questionRewardAmountMin != null){
            formData.append('questionRewardAmountMin', state.questionRewardAmountMin);
        }
        if(state.questionRewardAmountMax != null){
            formData.append('questionRewardAmountMax', state.questionRewardAmountMax);
        }
        
        if(state.topicUnhidePlatformShareProportion != null){
            formData.append('topicUnhidePlatformShareProportion', state.topicUnhidePlatformShareProportion);
        }
        if(state.questionRewardPlatformShareProportion != null){
            formData.append('questionRewardPlatformShareProportion', state.questionRewardPlatformShareProportion);
        }
        if(state.giveRedEnvelopeAmountMin != null){
            formData.append('giveRedEnvelopeAmountMin', state.giveRedEnvelopeAmountMin);
        }
        if(state.giveRedEnvelopeAmountMax != null){
            formData.append('giveRedEnvelopeAmountMax', state.giveRedEnvelopeAmountMax);
        }
        if(state.allowFilterWord != null){
            formData.append('allowFilterWord', state.allowFilterWord.toString());
        }
        if(state.filterWordReplace != null){
            formData.append('filterWordReplace', state.filterWordReplace);
        }
        if(state.fileSecureLinkSecret != null){
            formData.append('fileSecureLinkSecret', state.fileSecureLinkSecret);
        }
        if(state.fileSecureLinkExpire != null){
            formData.append('fileSecureLinkExpire', state.fileSecureLinkExpire);
        }
        if(state.forestagePageNumber != null){
            formData.append('forestagePageNumber', state.forestagePageNumber);
        }
        if(state.backstagePageNumber != null){
            formData.append('backstagePageNumber', state.backstagePageNumber);
        }
        if(state.temporaryFileValidPeriod != null){
            formData.append('temporaryFileValidPeriod', state.temporaryFileValidPeriod);
        }
        if(state.userSentSmsCount != null){
            formData.append('userSentSmsCount', state.userSentSmsCount);
        }
        if(state.allowMentionMaxNumber != null){
            formData.append('allowMentionMaxNumber', state.allowMentionMaxNumber);
        }
        
        
        //话题编辑器
        if(state.topicEditorTagObject.fontname != null){
            formData.append('topicEditorTagObject.fontname', state.topicEditorTagObject.fontname.toString());
        }
        if(state.topicEditorTagObject.fontsize != null){
            formData.append('topicEditorTagObject.fontsize', state.topicEditorTagObject.fontsize.toString());
        }
        if(state.topicEditorTagObject.forecolor != null){
            formData.append('topicEditorTagObject.forecolor', state.topicEditorTagObject.forecolor.toString());
        }
        if(state.topicEditorTagObject.hilitecolor != null){
            formData.append('topicEditorTagObject.hilitecolor', state.topicEditorTagObject.hilitecolor.toString());
        }
        if(state.topicEditorTagObject.bold != null){
            formData.append('topicEditorTagObject.bold', state.topicEditorTagObject.bold.toString());
        }
        if(state.topicEditorTagObject.italic != null){
            formData.append('topicEditorTagObject.italic', state.topicEditorTagObject.italic.toString());
        }
        if(state.topicEditorTagObject.underline != null){
            formData.append('topicEditorTagObject.underline', state.topicEditorTagObject.underline.toString());
        }
        if(state.topicEditorTagObject.removeformat != null){
            formData.append('topicEditorTagObject.removeformat', state.topicEditorTagObject.removeformat.toString());
        }
        if(state.topicEditorTagObject.link != null){
            formData.append('topicEditorTagObject.link', state.topicEditorTagObject.link.toString());
        }
        if(state.topicEditorTagObject.unlink != null){
            formData.append('topicEditorTagObject.unlink', state.topicEditorTagObject.unlink.toString());
        }
        if(state.topicEditorTagObject.justifyleft != null){
            formData.append('topicEditorTagObject.justifyleft', state.topicEditorTagObject.justifyleft.toString());
        }
        if(state.topicEditorTagObject.justifycenter != null){
            formData.append('topicEditorTagObject.justifycenter', state.topicEditorTagObject.justifycenter.toString());
        }
        if(state.topicEditorTagObject.justifyright != null){
            formData.append('topicEditorTagObject.justifyright', state.topicEditorTagObject.justifyright.toString());
        }
        if(state.topicEditorTagObject.insertorderedlist != null){
            formData.append('topicEditorTagObject.insertorderedlist',state.topicEditorTagObject.insertorderedlist.toString());
        }
        if(state.topicEditorTagObject.insertunorderedlist != null){
            formData.append('topicEditorTagObject.insertunorderedlist', state.topicEditorTagObject.insertunorderedlist.toString());
        }
        if(state.topicEditorTagObject.code != null){
            formData.append('topicEditorTagObject.code', state.topicEditorTagObject.code.toString());
        }
        if(state.topicEditorTagObject.emoticons != null){
            formData.append('topicEditorTagObject.emoticons', state.topicEditorTagObject.emoticons.toString());
        }
        if(state.topicEditorTagObject.hidePassword != null){
            formData.append('topicEditorTagObject.hidePassword', state.topicEditorTagObject.hidePassword.toString());
        }
        if(state.topicEditorTagObject.hideComment != null){
            formData.append('topicEditorTagObject.hideComment', state.topicEditorTagObject.hideComment.toString());
        }
        if(state.topicEditorTagObject.hideGrade != null){
            formData.append('topicEditorTagObject.hideGrade', state.topicEditorTagObject.hideGrade.toString());
        }
        if(state.topicEditorTagObject.hidePoint != null){
            formData.append('topicEditorTagObject.hidePoint', state.topicEditorTagObject.hidePoint.toString());
        }
        if(state.topicEditorTagObject.hideAmount != null){
            formData.append('topicEditorTagObject.hideAmount', state.topicEditorTagObject.hideAmount.toString());
        }
        if(state.topicEditorTagObject.mention != null){
            formData.append('topicEditorTagObject.mention', state.topicEditorTagObject.mention.toString());
        }
        if(state.topicEditorTagObject.fullscreen != null){
            formData.append('topicEditorTagObject.fullscreen', state.topicEditorTagObject.fullscreen.toString());
        }
        if(state.topicEditorTagObject.image != null){
            formData.append('topicEditorTagObject.image', state.topicEditorTagObject.image.toString());
        }
        if(state.topicEditorTagObject.imageFormat != null && state.topicEditorTagObject.imageFormat.length >0){
            for(let i=0; i<state.topicEditorTagObject.imageFormat.length; i++){
                let format = state.topicEditorTagObject.imageFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('topicEditorTagObject.imageFormat', format);
                }
            }
        }
        if(state.topicEditorTagObject.imageSize != null){
            formData.append('topicEditorTagObject.imageSize', state.topicEditorTagObject.imageSize);
        }
        if(state.topicEditorTagObject.file != null){
            formData.append('topicEditorTagObject.file', state.topicEditorTagObject.file.toString());
        }
        if(state.topicEditorTagObject.fileFormat != null && state.topicEditorTagObject.fileFormat.length >0){
            for(let i=0; i<state.topicEditorTagObject.fileFormat.length; i++){
                let format = state.topicEditorTagObject.fileFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('topicEditorTagObject.fileFormat', format);
                }
            }
        }
        if(state.topicEditorTagObject.fileSize != null){
            formData.append('topicEditorTagObject.fileSize', state.topicEditorTagObject.fileSize);
        }
        if(state.topicEditorTagObject.embedVideo != null){
            formData.append('topicEditorTagObject.embedVideo', state.topicEditorTagObject.embedVideo.toString());
        }
        if(state.topicEditorTagObject.uploadVideo != null){
            formData.append('topicEditorTagObject.uploadVideo', state.topicEditorTagObject.uploadVideo.toString());
        }
        if(state.topicEditorTagObject.videoFormat != null && state.topicEditorTagObject.videoFormat.length >0){
            for(let i=0; i<state.topicEditorTagObject.videoFormat.length; i++){
                let format = state.topicEditorTagObject.videoFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('topicEditorTagObject.videoFormat', format);
                }
            }
        }
        if(state.topicEditorTagObject.videoSize != null){
            formData.append('topicEditorTagObject.videoSize', state.topicEditorTagObject.videoSize);
        }
        
        
        
        //评论编辑器
        if(state.editorTagObject.fontname != null){
            formData.append('editorTagObject.fontname', state.editorTagObject.fontname.toString());
        }
        if(state.editorTagObject.fontsize != null){
            formData.append('editorTagObject.fontsize', state.editorTagObject.fontsize.toString());
        }
        if(state.editorTagObject.forecolor != null){
            formData.append('editorTagObject.forecolor', state.editorTagObject.forecolor.toString());
        }
        if(state.editorTagObject.hilitecolor != null){
            formData.append('editorTagObject.hilitecolor', state.editorTagObject.hilitecolor.toString());
        }
        if(state.editorTagObject.bold != null){
            formData.append('editorTagObject.bold', state.editorTagObject.bold.toString());
        }
        if(state.editorTagObject.italic != null){
            formData.append('editorTagObject.italic', state.editorTagObject.italic.toString());
        }
        if(state.editorTagObject.underline != null){
            formData.append('editorTagObject.underline', state.editorTagObject.underline.toString());
        }
        if(state.editorTagObject.removeformat != null){
            formData.append('editorTagObject.removeformat', state.editorTagObject.removeformat.toString());
        }
        if(state.editorTagObject.link != null){
            formData.append('editorTagObject.link', state.editorTagObject.link.toString());
        }
        if(state.editorTagObject.unlink != null){
            formData.append('editorTagObject.unlink', state.editorTagObject.unlink.toString());
        }
        if(state.editorTagObject.justifyleft != null){
            formData.append('editorTagObject.justifyleft', state.editorTagObject.justifyleft.toString());
        }
        if(state.editorTagObject.justifycenter != null){
            formData.append('editorTagObject.justifycenter', state.editorTagObject.justifycenter.toString());
        }
        if(state.editorTagObject.justifyright != null){
            formData.append('editorTagObject.justifyright', state.editorTagObject.justifyright.toString());
        }
        if(state.editorTagObject.insertorderedlist != null){
            formData.append('editorTagObject.insertorderedlist', state.editorTagObject.insertorderedlist.toString());
        }
        if(state.editorTagObject.insertunorderedlist != null){
            formData.append('editorTagObject.insertunorderedlist', state.editorTagObject.insertunorderedlist.toString());
        }
        if(state.editorTagObject.code != null){
            formData.append('editorTagObject.code', state.editorTagObject.code.toString());
        }
        if(state.editorTagObject.emoticons != null){
            formData.append('editorTagObject.emoticons', state.editorTagObject.emoticons.toString());
        }
        if(state.editorTagObject.mention != null){
            formData.append('editorTagObject.mention', state.editorTagObject.mention.toString());
        }
        if(state.editorTagObject.fullscreen != null){
            formData.append('editorTagObject.fullscreen', state.editorTagObject.fullscreen.toString());
        }
        if(state.editorTagObject.image != null){
            formData.append('editorTagObject.image', state.editorTagObject.image.toString());
        }
        if(state.editorTagObject.imageFormat != null && state.editorTagObject.imageFormat.length >0){
            for(let i=0; i<state.editorTagObject.imageFormat.length; i++){
                let format = state.editorTagObject.imageFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('editorTagObject.imageFormat', format);
                }
            }
        }
        if(state.editorTagObject.imageSize != null){
            formData.append('editorTagObject.imageSize', state.editorTagObject.imageSize);
        }
        
        
        //问题编辑器
        if(state.questionEditorTagObject.fontname != null){
            formData.append('questionEditorTagObject.fontname', state.questionEditorTagObject.fontname.toString());
        }
        if(state.questionEditorTagObject.fontsize != null){
            formData.append('questionEditorTagObject.fontsize', state.questionEditorTagObject.fontsize.toString());
        }
        if(state.questionEditorTagObject.forecolor != null){
            formData.append('questionEditorTagObject.forecolor', state.questionEditorTagObject.forecolor.toString());
        }
        if(state.questionEditorTagObject.hilitecolor != null){
            formData.append('questionEditorTagObject.hilitecolor', state.questionEditorTagObject.hilitecolor.toString());
        }
        if(state.questionEditorTagObject.bold != null){
            formData.append('questionEditorTagObject.bold', state.questionEditorTagObject.bold.toString());
        }
        if(state.questionEditorTagObject.italic != null){
            formData.append('questionEditorTagObject.italic', state.questionEditorTagObject.italic.toString());
        }
        if(state.questionEditorTagObject.underline != null){
            formData.append('questionEditorTagObject.underline', state.questionEditorTagObject.underline.toString());
        }
        if(state.questionEditorTagObject.removeformat != null){
            formData.append('questionEditorTagObject.removeformat', state.questionEditorTagObject.removeformat.toString());
        }
        if(state.questionEditorTagObject.link != null){
            formData.append('questionEditorTagObject.link', state.questionEditorTagObject.link.toString());
        }
        if(state.questionEditorTagObject.unlink != null){
            formData.append('questionEditorTagObject.unlink', state.questionEditorTagObject.unlink.toString());
        }
        if(state.questionEditorTagObject.justifyleft != null){
            formData.append('questionEditorTagObject.justifyleft', state.questionEditorTagObject.justifyleft.toString());
        }
        if(state.questionEditorTagObject.justifycenter != null){
            formData.append('questionEditorTagObject.justifycenter', state.questionEditorTagObject.justifycenter.toString());
        }
        if(state.questionEditorTagObject.justifyright != null){
            formData.append('questionEditorTagObject.justifyright', state.questionEditorTagObject.justifyright.toString());
        }
        if(state.questionEditorTagObject.insertorderedlist != null){
            formData.append('questionEditorTagObject.insertorderedlist', state.questionEditorTagObject.insertorderedlist.toString());
        }
        if(state.questionEditorTagObject.insertunorderedlist != null){
            formData.append('questionEditorTagObject.insertunorderedlist', state.questionEditorTagObject.insertunorderedlist.toString());
        }
        if(state.questionEditorTagObject.code != null){
            formData.append('questionEditorTagObject.code', state.questionEditorTagObject.code.toString());
        }
        if(state.questionEditorTagObject.emoticons != null){
            formData.append('questionEditorTagObject.emoticons', state.questionEditorTagObject.emoticons.toString());
        }
        if(state.questionEditorTagObject.mention != null){
            formData.append('questionEditorTagObject.mention', state.questionEditorTagObject.mention.toString());
        }
        if(state.questionEditorTagObject.fullscreen != null){
            formData.append('questionEditorTagObject.fullscreen', state.questionEditorTagObject.fullscreen.toString());
        }
        if(state.questionEditorTagObject.image != null){
            formData.append('questionEditorTagObject.image', state.questionEditorTagObject.image.toString());
        }
        if(state.questionEditorTagObject.imageFormat != null && state.questionEditorTagObject.imageFormat.length >0){
            for(let i=0; i<state.questionEditorTagObject.imageFormat.length; i++){
                let format = state.questionEditorTagObject.imageFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('questionEditorTagObject.imageFormat', format);
                }
            }
        }
        if(state.questionEditorTagObject.imageSize != null){
            formData.append('questionEditorTagObject.imageSize', state.questionEditorTagObject.imageSize);
        }
        
        //答案编辑器
        if(state.answerEditorTagObject.fontname != null){
            formData.append('answerEditorTagObject.fontname', state.answerEditorTagObject.fontname.toString());
        }
        if(state.answerEditorTagObject.fontsize != null){
            formData.append('answerEditorTagObject.fontsize', state.answerEditorTagObject.fontsize.toString());
        }
        if(state.answerEditorTagObject.forecolor != null){
            formData.append('answerEditorTagObject.forecolor', state.answerEditorTagObject.forecolor.toString());
        }
        if(state.answerEditorTagObject.hilitecolor != null){
            formData.append('answerEditorTagObject.hilitecolor', state.answerEditorTagObject.hilitecolor.toString());
        }
        if(state.answerEditorTagObject.bold != null){
            formData.append('answerEditorTagObject.bold', state.answerEditorTagObject.bold.toString());
        }
        if(state.answerEditorTagObject.italic != null){
            formData.append('answerEditorTagObject.italic', state.answerEditorTagObject.italic.toString());
        }
        if(state.answerEditorTagObject.underline != null){
            formData.append('answerEditorTagObject.underline', state.answerEditorTagObject.underline.toString());
        }
        if(state.answerEditorTagObject.removeformat != null){
            formData.append('answerEditorTagObject.removeformat', state.answerEditorTagObject.removeformat.toString());
        }
        if(state.answerEditorTagObject.link != null){
            formData.append('answerEditorTagObject.link', state.answerEditorTagObject.link.toString());
        }
        if(state.answerEditorTagObject.unlink != null){
            formData.append('answerEditorTagObject.unlink', state.answerEditorTagObject.unlink.toString());
        }
        if(state.answerEditorTagObject.justifyleft != null){
            formData.append('answerEditorTagObject.justifyleft', state.answerEditorTagObject.justifyleft.toString());
        }
        if(state.answerEditorTagObject.justifycenter != null){
            formData.append('answerEditorTagObject.justifycenter', state.answerEditorTagObject.justifycenter.toString());
        }
        if(state.answerEditorTagObject.justifyright != null){
            formData.append('answerEditorTagObject.justifyright', state.answerEditorTagObject.justifyright.toString());
        }
        if(state.answerEditorTagObject.insertorderedlist != null){
            formData.append('answerEditorTagObject.insertorderedlist', state.answerEditorTagObject.insertorderedlist.toString());
        }
        if(state.answerEditorTagObject.insertunorderedlist != null){
            formData.append('answerEditorTagObject.insertunorderedlist', state.answerEditorTagObject.insertunorderedlist.toString());
        }
        if(state.answerEditorTagObject.code != null){
            formData.append('answerEditorTagObject.code', state.answerEditorTagObject.code.toString());
        }
        if(state.answerEditorTagObject.emoticons != null){
            formData.append('answerEditorTagObject.emoticons', state.answerEditorTagObject.emoticons.toString());
        }
        if(state.answerEditorTagObject.mention != null){
            formData.append('answerEditorTagObject.mention', state.answerEditorTagObject.mention.toString());
        }
        if(state.answerEditorTagObject.fullscreen != null){
            formData.append('answerEditorTagObject.fullscreen', state.answerEditorTagObject.fullscreen.toString());
        }
        if(state.answerEditorTagObject.image != null){
            formData.append('answerEditorTagObject.image', state.answerEditorTagObject.image.toString());
        }
        if(state.answerEditorTagObject.imageFormat != null && state.answerEditorTagObject.imageFormat.length >0){
            for(let i=0; i<state.answerEditorTagObject.imageFormat.length; i++){
                let format = state.answerEditorTagObject.imageFormat[i];
                if(format != null && format != "-"){//横杆由前面设置，代表空值
                    formData.append('answerEditorTagObject.imageFormat', format);
                }
            }
        }
        if(state.answerEditorTagObject.imageSize != null){
            formData.append('answerEditorTagObject.imageSize', state.answerEditorTagObject.imageSize);
        }


        proxy?.$axios({
            url: '/control/systemSetting/manage/edit',
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
			    		queryEditSystemSetting();
			    	}else if(returnValue.code === 500){//错误
			    		//处理错误信息
                        processErrorInfo_object(returnValue.data as Map<string,string> , error,()=>{});

			    		
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

		queryEditSystemSetting();
    }) 
</script>
<style scoped lang="scss">
.systemSettingModule{
    .radioPosition{
        margin-left: 20px;
    }
    .singColumnPlaceholder{/*单列占位*/
        margin-left: 35px !important;
    }
    .multipleColumnPlaceholder{/*多列占位*/
        margin-left: 34px !important;
    }
}
</style>