import React, { useEffect, useRef, useState } from 'react';
import { View,Text,Editor,Image,Input } from '@tarojs/components';
import Taro,{ useDidShow } from '@tarojs/taro';
import { AtImagePicker } from 'taro-ui'
import './index.scss'
import api from '../../../../service/api';
export default function GoodPost() {
    const [editorCtx,setEditorCtx] = useState({})
    const [textLength,setTextLength] = useState(0)
    const [iptHtml,setIptHtml] = useState('')
    const [iptContent,setIptContent] = useState('')
    const [allImgs,setAllImgs] = useState([])
    const [eventValve,setEventValve] = useState(0)
    const [judgeResArr,setJudgeResArr] = useState([])
    const [goodPrice,setgoodPrice] = useState()
    const editorReady = () =>{
        Taro.createSelectorQuery().select('#editor').context((res) => {
            setEditorCtx(res.context)
            // editorCtx = res.context
        }).exec()
    }
    useEffect(()=>{
        if(eventValve===0){
            setEventValve(1)
        }
    },[judgeResArr])
    // 已重构
    // const addPhoto = ()=>{
    //     // 选择照片
    //     Taro.chooseImage({
    //         count:9,
    //         sourceType: ['album', 'camera'],
    //         success:(res)=>{
    //             // 先判断图片宽高，设置状态数组，实现图片为正方形的需求
    //             // 临时数组用解决传多张图片无法及时更新judgeResArr数据的bug
    //             // const temporaryArr = []
    //             // for(let i = 0;i<res.tempFilePaths.length;i++){
    //             //     (async()=>{
    //             //         await Taro.getImageInfo({
    //             //             src:res.tempFilePaths[i],
    //             //             success:(res)=>{
    //             //                 console.log(res)
    //             //                 let width = res.width
    //             //                 let height = res.height
    //             //                 if(width>height){
    //             //                     temporaryArr.push(true)
    //             //                     setJudgeResArr([...judgeResArr,...temporaryArr])
    //             //                 }
    //             //                 else{
    //             //                     temporaryArr.push(false)
    //             //                     setJudgeResArr([...judgeResArr,...temporaryArr])
    //             //                 }
    //             //             }
    //             //         })
    //             //     })()
    //             // }
    //             // 修改图片数组
    //             const temporaryArr = []
    //             for(let i = 0;i<res.tempFilePaths.length;i++){
    //                 temporaryArr.push({url:res.tempFilePaths[i]})
    //             }
    //             console.log(temporaryArr)
    //             setAllImgs([...allImgs,...temporaryArr])
                
    //         }
    //     })
    // }
    useEffect(()=>{
        
    },[allImgs])
    // 获取html和title
    const setValue = (event)=>{
        // 可控的获取输入的html
        setIptHtml(event.detail.html)
        // 获取输入文字
        setIptContent(event.detail.text)
        // 实时修改字数
        setTextLength(event.detail.text.length-1)
    }
    useEffect(()=>{
        console.log(allImgs)
    },[allImgs])
    // 删除图片（已重构）
    // const cancelImg = (index)=>{
    //     return(()=>{
    //         console.log('hello')
    //         allImgs.splice(index,1)
    //         judgeResArr.splice(index,1)
    //         setAllImgs([...allImgs])
    //         setJudgeResArr([...judgeResArr])
    //     })
    // }
    const setPrice = (event)=>{
        setgoodPrice(event.detail.value)
    }
    const post = ()=>{
        console.log(iptHtml);
        console.log(allImgs);
        console.log(goodPrice);
        console.log(iptContent);
        console.log(title);
        const title = iptContent.substring(0,16);
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
            const option = {title:title,description:iptContent,price:goodPrice,images:imgUrlArr}
            // console.log(JSON.stringify(option))
            await api.post('/market/goods',option)
                .then(res=>{
                    Taro.hideLoading({
                        success:()=>{
                            Taro.navigateBack()
                        }
                    })
                    console.log(res)
                })
        })()
        
        // const temporaryArr = []
        // for(let i = 0;i<allImgs.length;i++){
        //     Taro.saveFile({
        //         tempFilePath:allImgs[i].url,
        //         success:(res)=>{
        //             temporaryArr.push(res.savedFilePath)
        //             console.log(res.savedFilePath)
        //             return res.savedFilePath
        //         }
        //     })
        //     .then(res=>{
        //         Taro.uploadFile({ 
        //             url:'https://api.superbed.cn/upload',
        //             filePath:res.savedFilePath,
        //             name:'test',
        //             success:res=>{
        //                 console.log(res)
        //             }
        //         })
                
        //     })
        // }
    }
    // const judgeFn=(index)=>{
    //     return((event)=>{
    //         if(event.detail.width>=event.detail.height){
    //             setJudgeResArr([...judgeResArr,true])
    //             console.log(judgeResArr)
    //             // setAdaptivePostImgClassname('good-post-img-outer-width-adaptive')
    //             // setAdaptivePostImgMode('widthFix')
    //         }
    //         else{
    //             setJudgeResArr([...judgeResArr,false])
    //             console.log(judgeResArr)
    //             // setAdaptivePostImgClassname('good-post-img-outer-height-adaptive')
    //             // setAdaptivePostImgMode('heightHeight')
    //         }
    //     })
    // }
    useEffect(()=>{
        
    },[judgeResArr])
    // 选择图片
    const chooseImg = (files,operationType)=>{
        setAllImgs([...files])
        console.log(files )
    }
    
    return (
    <View>
        <View className='good-post-outer'>
            <View className='good-post-header-outer'>
                <View className='good-post-header'>
                    <View className='good-post-header-btn' onClick={post}>
                        <Text>发布</Text>
                    </View>
                </View>
            </View>
            <View className='good-post-content-background' />
            <View className='good-post-content'>
                <View className='good-post-price-outer'>
                    <View className='good-post-price'>
                        <View className='price'>
                            <Text>价格</Text>
                            <View className='good-post-price-right'>
                                <Text>￥</Text>
                                <Input type='digit' onInput={setPrice}></Input>
                            </View>
                        </View>
                    </View>
                    <View className='splitLine' />
                </View>
                <View className='good-post-textarea'>
                    <Editor id='editor' className='editor' onReady={editorReady} onInput={setValue}></Editor>
                    <Text>{textLength}/200</Text>
                </View>
                <View className='good-post-imgs-outer'>

                    <View className='good-post-imgs'>
                        {
                            // allImgs.map((item,index)=>{
                            //     return(
                            //         judgeResArr[index]?
                            //         <View className='good-post-img-outer-height-adaptive'>
                            //                 {/* <View className='good-post-close-btn'> */}
                            //                 <Image src='https://s4.ax1x.com/2022/02/09/HJyrI1.png' className='good-post-close-btn' onClick={cancelImg(index)}></Image>
                            //                 {/* </View> */}
                            //                 <Image src={item} className='good-post-img' mode='heightFix'></Image>
                            //         </View>
                            //         :
                            //         <View className='good-post-img-outer-width-adaptive'>
                            //                 {/* <View className='good-post-close-btn'> */}
                            //                 <Image src='https://s4.ax1x.com/2022/02/09/HJyrI1.png' className='good-post-close-btn' onClick={cancelImg(index)}></Image>
                            //                 {/* </View> */}
                            //                 <Image src={item} className='good-post-img' mode='widthFix'></Image>
                            //         </View>
                                    
                            //     )
                            // })
                        }
                        <AtImagePicker
                                files={allImgs}
                                onChange={chooseImg}
                                length={3}
                                count={9-allImgs.length}
                                multiple
                            />
                        {
                            // allImgs.length===0?
                            // <AtImagePicker
                            //     files={allImgs}
                            //     onChange={chooseImg}
                            //     onImageClick={test}
                            //     length={3}
                            //     count={9}
                            //     multiple
                            // />
                            // :
                            // <></>
                        }
                        
                        {/* <View className='good-post-btn' onClick={addPhoto}>
                            <Image className='good-post-btn-icon' src='https://s4.ax1x.com/2022/02/08/H1zqFx.png'></Image>
                            <Text>点击添加</Text>
                        </View> */}
                    </View>
                </View>
                
            </View>
        </View>
    </View>
    );
}
