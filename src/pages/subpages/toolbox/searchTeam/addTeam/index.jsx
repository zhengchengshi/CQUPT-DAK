import { useState,useRef } from 'react'
import { AtTextarea,AtImagePicker } from 'taro-ui'
import { View,Image,Input,Text } from '@tarojs/components'
import './index.scss'

export default function AddTeam() {
    const [allImgs,setAllImgs] = useState([])
    const iptTitle = useRef('')
    const [iptDetail,setIptDetail] = useState('')
    const iptQqNum = useRef('')
    const iptWxNum = useRef('')
    const [connectionsNum,setConnectionsNum] = useState(1)
    const chooseImg = (files)=>{
        setAllImgs([...files])
        console.log(files)
    }

    const submit = ()=>{
        console.log(iptTitle.current.value)
        console.log(iptDetail)
        console.log(allImgs);
        console.log(iptQqNum.current.value);
        console.log(iptWxNum.current.value)
        // if(iptTitle.current.value.length===0){
        //     Taro.showToast({
        //         title:'标题必填',
        //         icon:'none'
        //     })
        //     return 
        // }
        // Taro.showLoading({
        //     mask:true,
        //     title:'图片上传中'
        // });
        // (async()=>{
        //     const imgUrlArr = [];
        //     // 上传图床
        //     for(let i=0;i<allImgs.length;i++){
        //         const token = await api.get('/picture/upload-token')
        //             .then(res=>{
        //                     const token = res.data.data.token
        //                     console.log(token)
        //                     return token
        //                 })
        //         await Taro.uploadFile({
        //             url:'https://up-z2.qiniup.com',
        //             name:'file',
        //             filePath:allImgs[i].url,
        //             formData:{
        //                 token:token,
        //                 file:allImgs[i].url
        //             },
        //             success:(res)=>{
        //                 const hashString = JSON.parse(res.data).hash
        //                 console.log(hashString)
        //                 imgUrlArr.push({
        //                     large:`http://r72tb2g5n.hn-bkt.clouddn.com/${hashString}`,
        //                     medium:`http://r72tb2g5n.hn-bkt.clouddn.com/${hashString}`,
        //                     tiny:`http://r72tb2g5n.hn-bkt.clouddn.com/${hashString}`,
        //                 })
        //                 return imgUrlArr
        //             }
        //         })
        //     }
        //     const option = {title:iptTitle.current.value,description:iptDetail,images:imgUrlArr}
        //     // console.log(JSON.stringify(option))
        //     await api.post('/order/send',option)
        //         .then(res=>{
        //             Taro.hideLoading({
        //                 success:()=>{
        //                     Taro.navigateBack()
        //                 }
        //             })
        //             console.log(res)
        //         })
        // })()
    }
    // 受控组件
    const detailChange = (value)=>{
        setIptDetail(value)
    }
    const addConnection = ()=>{
        setConnectionsNum(connectionsNum+1)
    }
    return (
        <View>
            <View className='addTeam-header'>
                欢迎入驻!
            </View>
            <View className='addTeam-content'>
                <Image src='https://s1.ax1x.com/2022/03/29/qcK3KP.png' className='addTeam-formdata-content-shadow'></Image>
                <View className='addTeam-first-formdata'>
                    <View className='addTeam-formdata-content'>
                        <View className='addTeam-formdata-content-item'>团队名称<Image src='https://s1.ax1x.com/2022/03/29/qcug1I.png' className='addTeam-formdata-content-item-required'></Image></View>
                        <View className='addTeam-formdata-content-item'><Input ref={iptTitle}></Input></View>
                        
                        <View className='addTeam-formdata-content-item'>团队简介</View>
                        <View className='addTeam-formdata-content-item'>
                            <AtTextarea
                              placeholder='请填写团队简介'
                              height='220'
                              onChange={detailChange}
                              value={iptDetail}
                            ></AtTextarea>
                        </View>
                    </View>
                    <View className='addTeam-formdata-images'>
                        <AtImagePicker
                          files={allImgs}
                          onChange={chooseImg}
                          length={3}
                          count={9-allImgs.length}
                          multiple
                          width='210'
                          height='210'
                        />
                    </View>
                </View>
                <View className='addTeam-second-formdata'>
                    <View className='addTeam-connection'>
                        <View className='addTeam-connection-title'>联系方式</View>
                        <View className='addTeam-connection-item'><Text>QQ</Text><Input placeholder='请填写QQ联系方式' ref={iptQqNum}></Input></View>
                        <View className='addTeam-connection-item'><Text>微信</Text><Input placeholder='请填写微信联系方式' ref={iptWxNum}></Input></View>
                    </View>
                    <View className='addTeam-others-connection'>
                        <View className='addTeam-others-connection-title'>
                            <Text>其他联系方式</Text>
                            <Text className='addTeam-others-connection-add-connection-btn' onClick={addConnection}>添加</Text>
                        </View>
                        {
                            new Array(connectionsNum).fill(true).map((_,index)=>{
                                return(
                                    <View className='addTeam-others-connection-addItem' key={index}>
                                        <View className='addTeam-others-connection-addItem-btn'>
                                            <Image src='https://s1.ax1x.com/2022/04/11/LZdikT.png' className='addTeam-others-connection-addItem-icon'></Image>
                                        </View>
                                        <Input width='168' placeholder='其他平台名称'></Input>
                                        <Input width='260' placeholder='请填写联系方式'></Input>
                                    </View>
                                )
                            })
                        
                        }
                    </View>
                </View>
                <View formType='submit' onClick={submit} className='addTeam-btn'>发送</View>
            </View>
        </View>
    )
}
