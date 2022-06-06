import Taro from '@tarojs/taro'
import { useDispatch, useSelector } from 'react-redux'
import {  useEffect } from 'react'
import { View } from '@tarojs/components'
import Header from '../../components/marketComponent/header'
import DisplayContent from '../../components/marketComponent/displayContent'
import Login from '../../components/login'
import { selectVerifyState,storageVerifyState } from '../../components/login/verifySlice'

export default function Market() {
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
        complete:()=>{
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

