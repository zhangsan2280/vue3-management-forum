import escape from "lodash/escape";
/**
 * 转义html
 * @param html
 * @returns 
 */
 export let escapeHtml = (html:string) =>{
    return escape(html);//引入lodash.js
};  
/**
 * vue文本转义
 * @param html
 * @returns 
 */
export let escapeVueHtml = (html:string) =>{
	return html.replace(/{{/g, "&#123;&#123;").replace(/}}/g, "&#125;&#125;");//{{}}大括号转义
}
