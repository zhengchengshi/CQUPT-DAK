import  { useState } from 'react';
import Taro,{ useDidShow } from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components'
import './receipt.scss'
import api from '../../service/api';

export default function Receipt() {
  const [allReceipts,setAllReceipts] = useState([])
  const postReceipt = ()=>{
    Taro.navigateTo({url:'../subpages/receiptSubpage/receiptPost/index'})
  }
  useDidShow(async()=>{
    try{
      const res = await api.get('/order/search?keyword=&page=1').catch(err=>Promise.reject(err))
      setAllReceipts([...res.data.data])
      console.log(res)
    }
    catch(err){
      console.log(err)
    }
  })

  const goSearch = ()=>{
    Taro.navigateTo({url:'../subpages/receiptSubpage/receiptSearch/index'})
  }

  const goDetail = (item)=>{
    return(()=>{
      Taro.navigateTo({
        url:'../subpages/receiptSubpage/receiptDetail/index',
        success:(res)=>{
          res.eventChannel.emit('orderId', { item })
        }
      })
    })
  }
  return (
    <View>
      <View className='receipt-outer'>
        <View className='receipt-homepage-header' onClick={goSearch}>
          <View className='receipt-homepage-searchbox-outer'>
            <View className='receipt-homepage-searchbox'>
                <Image src='https://s1.ax1x.com/2022/03/28/qrLnL4.png' className='receipt-homepage-searchbox-search-icon'></Image>
                <View className='receipt-homepage-searchbox-splitline'></View>
              <View className='receipt-homepage-searchbox-input'>
                <Text>校内搜索</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='receipt-homepage-content-outer'>
          <View className='receipt-homepage-content'>
            {
              allReceipts.map((item,index)=>{
                return(
                  <View className='receipt-homepage-content-item' key={index} onClick={goDetail(item)}>
                    <Text className='receipt-homepage-content-item-left'>{item.title}</Text>
                    <View className='receipt-homepage-content-item-right'>
                        <Text>预估价格:￥</Text>
                        <Text>{item.price}</Text>
                        <Image src='https://s1.ax1x.com/2022/03/22/qQmo8g.png'></Image>
                    </View>
                  </View>
                )
              })
            }
            <Image src='https://s4.ax1x.com/2022/02/06/HKSHG4.png' className='fixed-btn' onClick={postReceipt}></Image>
            </View>
        </View>
      </View>
    </View>
  );
}