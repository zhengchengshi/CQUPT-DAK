import { Component } from 'react'
import { View, Text,Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import './toolbox.scss'

import React from 'react';

export default function market() {
    const goToolbox = (info)=>{
      return(()=>{
        if(info==='searchTeam'){
          Taro.navigateTo({
            url:`../subpages/toolbox/${info}/index`
          })
        }
        else{
          Taro.showToast({
            title:'开发中',
            icon:'none'
          })
        }
      })
    }
    return (
    <View>
      <View className='toolbox-outer'>
        <View className="toolbox-header">
          <Text>工具箱</Text>
        </View>
        <View className="toolbox-btns">
          <Image src="https://s1.ax1x.com/2022/03/08/bgfJfI.png" alt="err" onClick={goToolbox('searchTeam')}></Image>
          <Image src="https://s1.ax1x.com/2022/03/08/bgfB7Q.png" alt="err" onClick={goToolbox('buySnack')}></Image>
          <Image src="https://s1.ax1x.com/2022/03/08/bgfRXT.png" alt="err" onClick={goToolbox('delivery')}></Image>
        </View>
      </View>
    </View>
  );
}