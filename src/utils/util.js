import { Notification } from 'element-ui';
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import { Loading } from 'element-ui';

const util = {}

let loadingInstance = null

/**
 * 成功弹窗
 * @param message 描述
 * @param title 标题：默认成功
 * @param duration 时间: 默认3000毫秒
 */
util.success = function (message, title = '成功', duration = 3000) {
    Notification.success({
        showClose: true,
        message,
        title,
        duration,
        type: 'success',
    })
}

/**
 * 提示弹窗
 * @param message 描述
 * @param title 标题
 * @param duration 时间
 */
util.info = function (message, title = '提示', duration = 3000) {
    Notification.success({
        showClose: true,
        message,
        title,
        duration,
        type: 'info',
    })
}

/**
 * 失败弹窗
 * @param message
 * @param title
 * @param duration
 */
util.error = function (message, title = '失败', duration = 3000) {
    Notification.error({
        showClose: true,
        message,
        title,
        duration,
        type: 'error',
    })
}

/**
 * 警告弹窗
 * @param message
 * @param title
 * @param duration
 */
util.warning = function (message, title = '警告', duration = 3000) {
    Notification.warning({
        showClose: true,
        message,
        title,
        duration,
        type: 'warning',
    })
}

util.success2 = function(message,duration = 3000){
    Message.success({
        showClose: true,
        message,
        duration,
        type: 'success'
    })
}

util.info2 = function(message,duration = 3000){
    Message.info({
        showClose: true,
        message,
        duration,
        type: 'info'
    })
}
util.warning2 = function(message,duration = 3000){
    Message.warning({
        showClose: true,
        message,
        duration,
        type: 'warning'
    })
}
util.error2 = function(message,duration = 3000,offset = 20){
    Message.error({
        showClose: true,
        message,
        duration,
        offset,
        type: 'error'
    })
}

util.openLoading = function(text){
    loadingInstance = Loading.service({
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

util.openTagLoading = function(text,target){
    loadingInstance = Loading.service({
        text,
        spinner: 'el-icon-loading',
        target : document.querySelector(target),
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

util.openNoMessageLoading = function(target){
    loadingInstance = Loading.service({
        spinner: 'el-icon-loading',
        target : document.querySelector(target),
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

util.closeLoading = function(){
    if(loadingInstance){
        loadingInstance.close()
    }
}

util.confirmSuccess = function (message='是否执行此操作',title = '提示',okBtn='确定',cancelBtn='取消'){
    return MessageBox.confirm(message, title, {
        confirmButtonText: okBtn,
        cancelButtonText: cancelBtn,
        type: 'success'})
}

util.confirmWarning = function (message='是否执行此操作',title = '提示',okBtn='确定',cancelBtn='取消'){
    return MessageBox.confirm(message, title, {
        confirmButtonText: okBtn,
        cancelButtonText: cancelBtn,
        type: 'warning'})
}

util.confirmInfo = function (message='是否执行此操作',title = '提示',okBtn='确定',cancelBtn='取消'){
    return MessageBox.confirm(message, title, {
        confirmButtonText: okBtn,
        cancelButtonText: cancelBtn,
        type: 'info '})
}

util.confirmError = function (message='是否执行此操作',title = '提示',okBtn='确定',cancelBtn='取消'){
    return MessageBox.confirm(message, title, {
        confirmButtonText: okBtn,
        cancelButtonText: cancelBtn,
        type: 'error'})
}



/**
 * 设置缓存
 * @param key
 * @param value
 */
util.setStorage = function (key,value) {
    localStorage.setItem(key,value)
}

/**
 * 获取缓存
 * @param key
 * @returns {string|null}
 */
util.getStorage = function (key) {
    if(localStorage.getItem(key)){
        return localStorage.getItem(key)
    }
    return null;
}

/**
 * 删除缓存
 * @param key
 */
util.delStorage = function (key) {
    if(!key) return
    if(localStorage.getItem(key)){
        localStorage.removeItem(key)
    }
}

/**
 * 清空缓存
 */
util.clearStorage = function () {
    localStorage.clear()
}

/**
 * 数组去重
 * @param arr
 * @returns {any[]}
 */
util.unique = function (arr) {
    return Array.from(new Set(arr))
}

export default util