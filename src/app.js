import React,{ Component, useEffect } from 'react'
import './app.scss'
import Taro from '@tarojs/taro'
import api from './service/api'
import { Provider } from 'react-redux'
import store from './redux/store'
import MessageHook from './messageHook'
export const UrlContext = React.createContext('')

export default function App(props) {
  // uid3
  // uid5
  // Taro.setStorageSync('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJ1aWQiOiI1In0.ndEvHshzGrSIv_rJKZU95XE25o1M-vTr4vzV_zUMmsI')
  // 字体加载
  // Taro.loadFontFace({
  //   global:true,
  //   family:'PingFang-regular',
  //   source:'url(https://zhengchengshi.top/PingFang-regular.ttf)'
  // })
  
  return (
    <Provider store={store}>
      {props.children}
      {/* 通讯专用hook */}
      <MessageHook></MessageHook>
    </Provider>
  )
}
