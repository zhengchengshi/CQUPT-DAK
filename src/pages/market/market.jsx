import { Component, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Header from '../../components/marketComponent/header'
import DisplayContent from '../../components/marketComponent/displayContent'
import BookHouse from '../../components/marketComponent/bookhouse'
import React from 'react';
import Taro,{Events} from '@tarojs/taro'
import Login from '../../components/login'
import { selectVerifyState,storageVerifyState } from '../../components/login/verifySlice'
import { useDispatch, useSelector } from 'react-redux'
export default function Market() {
    const [controlLogin,setControlLogin] = useState(false)
    const veryfy = useSelector(selectVerifyState)
    const dispatch = useDispatch()
    useEffect(()=>{
      // token校验，refreshtoken过期时会清空所有信息
      if(!Taro.getStorageSync('access_token')){
        Taro.hideTabBar()
        // 进入登录界面
        dispatch(storageVerifyState(true))
      }
      else{
        Taro.showTabBar()
      }
      Taro.checkSession({
        complete:(res)=>{
          setControlLogin(false)
          console.log('session未过期')
        },
        fail:()=>{
          // session_key 已经失效，需要重新执行登录流程
          // Taro.login() //重新登录
          dispatch(storageVerifyState(true))
          Taro.hideTabBar()
        }
      })
      // Taro.hideTabBar()
    },[veryfy])
    return (
    <View>
      {
        veryfy?
        <Login></Login>
        :
        <View>
          <Header></Header>
          <DisplayContent></DisplayContent>
        </View>
      }
    </View>
  );
}

