import { View,Image,Input, Button,Text } from '@tarojs/components'
import { useState,useRef } from 'react'
import { AtTextarea,AtImagePicker } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../../../service/api'
import './index.scss'

export default function CommunityIssue() {
    const [allImgs,setAllImgs] = useState([])
    const comTitle = useRef('')
    const comPrice = useRef('123')
    const [comDetail,setComDetail] = useState('')
    const [isCommunity,setIsCommunity] =useState(true)

    const chooseImg = (files)=>{
        setAllImgs([...files])
        console.log(files )
    }

    const submit = ()=>{
        console.log(comTitle.current.value)
        console.log(comPrice.current.value)
        console.log(comDetail)
        console.log(allImgs);
        if(comDetail.length===0){
            Taro.showToast({
                title:'至少写点东西吧',
                icon:'none'
            })
            return 
        }
        Taro.showLoading({
            mask:true,
            title:'图片上传中'
        });
        (async()=>{
            const imgUrlArr = [];
            // 上传图床
            for(let i=0;i<allImgs.length;i++){
                const token = await api.get('/picture/upload-token')
                    .then(res=>{
                            const innertoken = res.data.data.token
                            console.log(innertoken)
                            return innertoken
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
            const option = {title:comTitle.current.value,description:comDetail,price:'123',images:imgUrlArr}
            // console.log(JSON.stringify(option))
            await api.post('/order/send',option)
                .then(res=>{
                    Taro.hideLoading({
                        success:()=>{
                            console.log('post-data',option)
                            Taro.navigateBack()
                        }
                    })
                    console.log(res)
                })
        })()
    }
    // 受控组件
    const detailChange = (value)=>{
        setComDetail(value)
    }
    const goReceiptPost =()=>{
        Taro.navigateTo({url:'../../../subpages/receiptSubpage/receiptPost/index'})
    }
    const cancel =()=>{
        setIsCommunity(!isCommunity)
    }
    return (
        <View>
            
            <View className='communityIssue-header'>
                <Button formType='submit' onClick={submit} className='communityIssue-submitCommunity'>发送</Button>
            </View>
            <View className={isCommunity?'communityIssue-mask':'communityIssue-mask-hide'}>
                <View className='communityIssue-mask-msgBox'>
                    <Text>提示</Text>
                    <Text>检测到您发的可能是单子，是否跳转到发单页面</Text>
                    <View className='communityIssue-mask-msgBox-btn'>
                        <Button onClick={goReceiptPost} className='communityIssue-mask-msgBox-btn-yes'>是</Button>
                        <Button onClick={cancel} className='communityIssue-mask-msgBox-btn-no'>否</Button>
                    </View>                    
                </View>
            </View>        
            <View className='communityIssue-content'>
                <Image src='https://s1.ax1x.com/2022/03/29/qcK3KP.png' className='communityIssue-formdata-content-shadow'></Image>
                <View className='communityIssue-formdata'>
                    <View className='communityIssue-formdata-content'>
                        <View className='communityIssue-formdata-content-title'>
                            <Text>文章标题（选填）</Text>
                            <Input ref={comTitle}></Input>
                        </View>
                        <View >
                            <AtTextarea className='communityIssue-formdata-content-detail'
                              placeholder='写点什么呢'
                              onChange={detailChange}
                              value={comDetail}
                              maxLength='200'
                              height={350}
                            ></AtTextarea>
                        </View>
                        <View className='communityIssue-formdata-images'>
                            <AtImagePicker 
                                files={allImgs}
                                onChange={chooseImg}
                                length={3}
                                count={3-allImgs.length}
                                multiple
                            />
                            {/* <Text>点击添加</Text> */}
                        </View>
                    </View>
                    

                
                </View>
                <View formType='submit' onClick={submit} className='communityIssue-addPhotos'>发送</View>
                
            </View>
            
        </View>
    )
}
