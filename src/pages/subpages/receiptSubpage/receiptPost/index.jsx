import React from 'react'
import { View,Image,Input,Textarea } from '@tarojs/components'
import './index.scss'
import { AtForm,AtButton,AtTextarea,AtImagePicker } from 'taro-ui'
import { useState } from 'react'
import { useRef } from 'react'
import Taro from '@tarojs/taro'
import api from '../../../../service/api'
export default function ReceiptPost() {
    const [allImgs,setAllImgs] = useState([])
    const iptTitle = useRef('')
    const iptPrice = useRef('')
    const [iptDetail,setIptDetail] = useState('')

    const chooseImg = (files,operationType)=>{
        setAllImgs([...files])
        console.log(files )
    }

    const submit = ()=>{
        console.log(iptTitle.current.value)
        console.log(iptPrice.current.value)
        console.log(iptDetail)
        console.log(allImgs);
        if(iptTitle.current.value.length===0){
            Taro.showToast({
                title:'标题必填',
                icon:'none'
            })
            return 
        }
        Taro.showLoading({
            mask:true,
            title:"图片上传中"
        });
        (async()=>{
            const imgUrlArr = [];
            // 上传图床
            for(let i=0;i<allImgs.length;i++){
                const token = await api.get('/picture/upload-token')
                    .then(res=>{
                            const token = res.data.data.token
                            console.log(token)
                            return token
                        })
                await Taro.uploadFile({
                    url:'https://up-z2.qiniup.com',
                    name:'file',
                    filePath:allImgs[i].url,
                    formData:{
                        token:token,
                        file:allImgs[i].url
                    },
                    success:(res)=>{
                        const hashString = JSON.parse(res.data).hash
                        console.log(hashString)
                        imgUrlArr.push({
                            large:`http://cdn.chongyouyizhan.xyz/${hashString}`,
                            medium:`http://cdn.chongyouyizhan.xyz/${hashString}`,
                            tiny:`http://cdn.chongyouyizhan.xyz/${hashString}`,
                        })
                        return imgUrlArr
                    }
                })
            }
            const option = {title:iptTitle.current.value,description:iptDetail,price:iptPrice.current.value,images:imgUrlArr}
            // console.log(JSON.stringify(option))
            await api.post('/order/send',option)
                .then(res=>{
                    Taro.hideLoading({
                        success:()=>{
                            Taro.navigateBack()
                        }
                    })
                    console.log(res)
                })
        })()
    }
    // 受控组件
    const detailChange = (value)=>{
        setIptDetail(value)
    }
    return (
        <View>
            <View className="receiptPost-header">
                发单
            </View>
            <View className="receiptPost-content">
                <Image src='https://s1.ax1x.com/2022/03/29/qcK3KP.png' className='receiptPost-formdata-content-shadow'></Image>
                <View className="receiptPost-formdata">
                    <View className="receiptPost-formdata-content">
                        <View className="receiptPost-formdata-content-item">标题 <Image src='https://s1.ax1x.com/2022/03/29/qcug1I.png' className='receiptPost-formdata-content-item-required'></Image></View>
                        <View className="receiptPost-formdata-content-item"><Input ref={iptTitle}></Input></View>
                        <View className="receiptPost-formdata-content-item">预估价格</View>
                        <View className="receiptPost-formdata-content-item">￥<Input ref={iptPrice}></Input></View>
                        <View className="receiptPost-formdata-content-item">详情</View>
                        <View className="receiptPost-formdata-content-item">
                            <AtTextarea
                                placeholder='请填写发单详情'
                                height='220'
                                onChange={detailChange}
                                value={iptDetail}
                            ></AtTextarea>
                        </View>
                    </View>
                    <View className="receiptPost-formdata-images">
                        <AtImagePicker
                            files={allImgs}
                            onChange={chooseImg}
                            length={3}
                            count={3-allImgs.length}
                            multiple
                        />
                    </View>

                {/* <AtForm
                    onSubmit={submit}
                >
                    <AtInput 
                        name='value' 
                        title='标题' 
                        type='text' 
                        required
                    />
                    <AtInput 
                    name='value' 
                    title='预估价格' 
                    type='text' 
                    placeholder='￥' 
                    />
                    <AtInput 
                    name='value' 
                    title='详情' 
                    type='text' 
                    />
                </AtForm> */}
                </View>
                <View formType='submit' onClick={submit} className="receiptPost-addPhotos">发送</View>
                {/* <View className="receiptPost-addPhotos" onClick={submit}>
                    发送
                </View> */}
            </View>
            
        </View>
    )
}
