import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { storageMessageList,selectMessageList } from './messageListSlice'
import { useDispatch,useSelector } from 'react-redux'
import { storageCurrentMessage } from './currentMessageSlice'
import { useEffect } from 'react'
import { useState } from 'react'
export default function messageHook() {
    const dispatch = useDispatch()
    useEffect(()=>{
        
        // socket连接
        Taro.connectSocket({
            url: 'wss://be-prod.chongyouyizhan.xyz/chat',
            protocols: [Taro.getStorageSync('access_token')]
        })
        .then(res=>{
            console.log(res)
        })

        Taro.onSocketOpen((res)=>{
            console.log(res)
        })
        
        Taro.onSocketError(function (res){
            console.log('WebSocket连接打开失败，请检查！')
        })
        // 接收到服务器的消息有三种
        // 第一种是所有发送给用户的消息概览列表（包含商品信息和会话id且仅在第一次服务器返回消息时返回）
        // 第二种是收到的所有消息
        // 第三种是用户发送消息给他人，返回的消息（对象）
        Taro.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data))
            const messageObj = JSON.parse(res.data)
            // 判断服务器返回的是数组还是对象，防止报错
            if(Array.isArray(messageObj)){
                // 接收第一种消息
                if(messageObj[0].entityInfo){
                    console.log(messageObj)
                    dispatch(storageMessageList(messageObj))
                }
            }
            else{
                dispatch(storageCurrentMessage(messageObj))
            }
        })
        Taro.onSocketClose(()=>{
            console.log('socket closed')
        })
    },[])
    return (
        <View></View>
    )
}
