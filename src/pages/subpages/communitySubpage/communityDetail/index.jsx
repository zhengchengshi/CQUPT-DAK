import Taro,{ useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { View, Text,Image,Button, Input } from '@tarojs/components'
import './index.scss'

export default function CommunityDetail() {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    const [allComment,setallComment] = useState({hot:[{comment:'',commentRes:[]}],time:[{comment:'',commentRes:[]}]})
    const [communityItem,setCommunityItem] = useState({owner:{realName:'',name:''},images:[{large:'',medium:'',tiny:''}],description:'',title:'',price:0,})    
    const [flag,setFlag] =useState('hot')
    
    const [isLike, setIsLike] = useState(false);
    const [comment, setComment] = useState(123);
    const [isShare, setIsShare] = useState(false); 
    const [share, setShare] = useState(123);    
    const [isShadow, setIsShadow] = useState(false);
    const [moreCommentRes,setMoreCommentRes] =useState(-1)

    
    
    // 监听父页面传来内容
    useDidShow(()=>{
        // 监听搜索页传过来的搜索内容
        eventChannel.on('communityId',(res)=>{
            console.log('communityDetail-res',res)
            setallComment({
                hot:[{
                        comment:'hot1',
                        commentRes:["hotRes1","hotRes2","hotRes3","hotRes4"]
                    },
                    {
                        comment:'hot2',
                        commentRes:["hotRes1","hotRes2","hotRes3","hotRes4"]
                    },
                    {
                        comment:'hot3',
                        commentRes:["hotRes1","hotRes2","hotRes3","hotRes4"]
                    }],
                time:[{
                    comment:'time1',
                    commentRes:["time-Res1","time-Res2","time-Res3","time-Res4"]
                },
                {
                    comment:'time2',
                    commentRes:["time-Res1","time-Res2","time-Res3","time-Res4"]
                },
                {
                    comment:'time3',
                    commentRes:["time-Res1","time-Res2","time-Res3","time-Res4"]
                }]}) 
            setCommunityItem(res.item) 
            })
        return(()=>{
            eventChannel.off('communityId')
        })
    })
     //添加喜欢（再次点击则取消喜欢
  const addLike = (index)=>{ 
    if(!isLike)
    {
      communityItem.price ++
    }
    else{
        communityItem.price --
    } 
     setIsLike(!isLike)
  }
  //评论
  const addComment = (e)=>{
    console.log('comment----')
  }
  //分享
  const addShare = (e)=>{
    if(!isShare)
    {
      setShare(share + 1)
    }
}
  //。。。按钮
  const getMore = (e)=>{
    setIsShadow(!isShadow)  
    // console.log('isShadow', isShadow)  
  } 
  //。。。中的取消按钮
  const cancel = (e)=>{
    setIsShadow(!isShadow)  
    // console.log('isShadow', isShadow) 
  }
  const checkHot =()=>{
      setFlag('hot')
  }
  const checkTime =()=>{
      setFlag('time')

  }
  const getMoreCommentRes =(index)=>{
      setMoreCommentRes(index)
      console.log('getMoreCommentRes-index',index)
  }


    return (
        <View>
            <View className={isShadow ? 'shadow' : 'shadow_hide'} >
                <View className='moreButton'>
                    <Button>屏蔽话题</Button>
                    <Button>举报</Button>
                    <Button onClick={cancel}>取消</Button>
                </View>
            </View>
            <View className='communityDetail-outer'>
                <View className='communityDetail-header'>
                    <View className='communityDetail-header-left'>
                        <Text className='communityDetail-header-title'>{communityItem?.title}</Text>
                    </View>
                    <View className='communityDetail-header-right' >
                        <Image src='https://s1.ax1x.com/2022/04/12/LnViIx.png' onClick={getMore} className='communityDetail-header-right-icon'></Image>
                    </View>
                </View>
                <View className='communityDetail-content'>

                    <View className='communityDetail-content-item' >
                        <View className='communityDetail-content-item-header'>
                        <View className='communityDetail-content-item-header-left'>
                        <Image src={communityItem?.images[0].tiny}></Image>
                        <View className='communityDetail-content-item-header-left-postinfo'>
                            <Text>{communityItem?.owner.realName}</Text>
                            <Text>测试文本</Text>
                        </View>
                    </View>
                    </View>
                    <View className='communityDetail-content-item-main'>
                    <View className='communityDetail-content-item-main-text'>
                        {communityItem?.description}{communityItem?.description}{communityItem?.description}{communityItem?.description}{communityItem?.description}
                    </View>
                    <View className='communityDetail-content-item-main-images'>
                        {communityItem?.images.map((i, id)=>{
                            return(
                                <Image src={i.medium} mode='aspectFill'></Image>
                            )
                        })}                        
                    </View>
                    <View className='communityDetail-content-item-operation-bar-outer'>
                        <View className='communityDetail-content-item-operation-date'>2022年6月11日</View>
                        <View className='communityDetail-content-item-operation-bar'>
                            <Image onClick={e => e.stopPropagation(addLike())}  src={isLike ?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='communityDetail-content-item-operation-bar-like'></Image><Text>{communityItem?.price}</Text>                  
                            <Image onClick={e => e.stopPropagation(addComment())} src='https://s1.ax1x.com/2022/04/12/Ln1DHO.png' className='communityDetail-content-item-operation-bar-remark'></Image><Text>1</Text>                  
                            <Image onClick={e => e.stopPropagation(addShare())} src={isShare ?(require('../../../../assets/images/btn_share(1).svg')) : 'https://s1.ax1x.com/2022/04/12/Ln1u3n.png'} className='communityDetail-content-item-operation-bar-forward'></Image><Text>{share}</Text>           
                        </View>
                    </View>
                    {/* <View className='communityDetail-content-item-comment'>
                        <Text className='communityDetail-content-item-comment-username'>清香白莲素还真</Text>
                        <Text className='communityDetail-content-item-comment-content'>:你喜欢好看的那就是没找到比他好看的，你喜欢对你好的那就是没找到比她对好的，其余以此推断</Text>
                    </View> */}
                    </View>
                    </View>
                    



                    <View className='comment-content'>
                        <View>
                            <Text onClick={checkHot} className={flag=='hot'?'comment-content-check-hot':'comment-content-check-hot-f'}>热门评论<Text></Text></Text>
                            <Text onClick={checkTime} className={flag=='time'?'comment-content-check-time':'comment-content-check-time-f'}>时间顺序<Text></Text></Text>
                        </View>
                        {
                            allComment.time!==null&&flag==='time'?
                            (allComment.time.map((item, index)=>{
                                return(
                                    <View className='comment-content-item'>
                                        <View className='comment-content-item-header'>
                                            <View className='comment-content-item-header-left'>
                                                <Image src={communityItem.images[0].tiny}></Image>
                                            <View className='comment-content-item-header-left-postinfo'>
                                                <Text>{communityItem.owner.realName}</Text>
                                                <Text>{index}小时前</Text>
                                            </View>
                                            </View>
                                            <View className='comment-content-item-header-btn' onClick={addLike}>
                                                <Image onClick={e => e.stopPropagation(addLike(index))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='comment-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                            </View>
                                        </View>
                                        <View className='comment-content-item-main'>
                                            <View className='comment-content-item-main-text'>
                                                {item.comment}{item.comment}{item.comment}{item.comment}{item.comment}
                                                {                                                    
                                                    item.commentRes.length > 2 && moreCommentRes ==index ?
                                                    (item.commentRes.map((i, ind)=>{
                                                        return(
                                                            <View className='commentRes-content-item'>
                                                                <View className='commentRes-content-item-header'>
                                                                    <View className='commentRes-content-item-header-left'>
                                                                        <Image src={communityItem.images[0].tiny}></Image>
                                                                        <View className='commentRes-content-item-header-left-postinfo'>
                                                                            <Text>{communityItem.owner.realName}</Text>
                                                                            <Text>{index}小时前</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View className='commentRes-content-item-header-btn' onClick={addLike}>
                                                                        <Image onClick={e => e.stopPropagation(addLike(ind))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='commentRes-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                                                    </View>
                                                                </View>
                                                                <View className='commentRes-content-item-main'>
                                                                    <View className='commentRes-content-item-main-text'>
                                                                        {i}{i}{i}{i}
                                                                    </View>                                               
                                                                </View>
                                                            </View>
                                                        )
                                                    }))
                                                    :
                                                    (item.commentRes.slice(0,2).map((i, ind)=>{
                                                        return(
                                                            <View className='commentRes-content-item'>
                                                                <View className='commentRes-content-item-header'>
                                                                    <View className='commentRes-content-item-header-left'>
                                                                        <Image src={communityItem.images[0].tiny}></Image>
                                                                        <View className='commentRes-content-item-header-left-postinfo'>
                                                                            <Text>{communityItem.owner.realName}</Text>
                                                                            <Text>{index}小时前</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View className='commentRes-content-item-header-btn' onClick={addLike}>
                                                                        <Image onClick={e => e.stopPropagation(addLike(ind))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='commentRes-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                                                    </View>
                                                                </View>
                                                                <View className='commentRes-content-item-main'>
                                                                    <View className='commentRes-content-item-main-text'>
                                                                        {i}{i}{i}{i}
                                                                    </View>                                               
                                                                </View>
                                                            </View>
                                                        )
                                                    }))
                                                }
                                                <View className='comment-content-item-main-text-getMoreCommentRes' onClick={e => e.stopPropagation(getMoreCommentRes(index))}>点击查看全部{item.commentRes.length}条评论</View>
                                            </View>
                                        </View>
                                    </View>
                                    
                                )
                            }))
                            :
                            (allComment.hot?.map((item, index)=>{
                                return(
                                    // <View>{hotItem.comment}</View>
                                    <View className='comment-content-item'>
                                        <View className='comment-content-item-header'>
                                            <View className='comment-content-item-header-left'>
                                                <Image src={communityItem.images[0].tiny}></Image>
                                            <View className='comment-content-item-header-left-postinfo'>
                                                <Text>{communityItem.owner.realName}</Text>
                                                <Text>{index}小时前</Text>
                                            </View>
                                            </View>
                                            <View className='comment-content-item-header-btn' onClick={addLike}>
                                                <Image onClick={e => e.stopPropagation(addLike(index))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='comment-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                            </View>
                                        </View>
                                        <View className='comment-content-item-main'>
                                            <View className='comment-content-item-main-text'>
                                                {item.comment}{item.comment}{item.comment}{item.comment}{item.comment}
                                                {                                                    
                                                    item.commentRes.length > 2 && moreCommentRes == index ?
                                                    (item.commentRes.map((i, ind)=>{
                                                        return(
                                                            // <View>{hotI}</View>
                                                            <View className='commentRes-content-item'>
                                                                <View className='commentRes-content-item-header'>
                                                                    <View className='commentRes-content-item-header-left'>
                                                                        <Image src={communityItem.images[0].tiny}></Image>
                                                                        <View className='commentRes-content-item-header-left-postinfo'>
                                                                            <Text>{communityItem.owner.realName}</Text>
                                                                            <Text>{index}小时前</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View className='commentRes-content-item-header-btn' onClick={addLike}>
                                                                        <Image onClick={e => e.stopPropagation(addLike(ind))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='commentRes-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                                                    </View>
                                                                </View>
                                                                <View className='commentRes-content-item-main'>
                                                                    <View className='commentRes-content-item-main-text'>
                                                                        {i}{i}{i}{i}
                                                                    </View>                                               
                                                                </View>
                                                            </View>
                                                        )
                                                    }))
                                                    :                                                    
                                                    (item.commentRes.slice(0,2).map((i, ind)=>{
                                                        return(
                                                            <View className='commentRes-content-item'>
                                                                <View className='commentRes-content-item-header'>
                                                                    <View className='commentRes-content-item-header-left'>
                                                                        <Image src={communityItem.images[0].tiny}></Image>
                                                                        <View className='commentRes-content-item-header-left-postinfo'>
                                                                            <Text>{communityItem.owner.realName}</Text>
                                                                            <Text>{index}小时前</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View className='commentRes-content-item-header-btn' onClick={addLike}>
                                                                        <Image onClick={e => e.stopPropagation(addLike(ind))}  src={isLike?(require('../../../../assets/images/btn_like(1).svg')) : 'https://s1.ax1x.com/2022/04/12/LnKJS0.png'} className='commentRes-content-item-header-like'></Image><Text>{communityItem.price}</Text>
                                                                    </View>
                                                                </View>
                                                                <View className='commentRes-content-item-main'>
                                                                    <View className='commentRes-content-item-main-text'>
                                                                        {i}{i}{i}{i}
                                                                    </View>                                               
                                                                </View>
                                                            </View>
                                                        )
                                                    })
                                                    )
                                                    
                                                }
                                                <View className='comment-content-item-main-text-getMoreCommentRes' onClick={e => e.stopPropagation(getMoreCommentRes(index))}>点击查看全部{item.commentRes.length}条评论</View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }))
                        }
                    </View>


                </View>
                <View className='receiptDetail-footer'>
                    <Image src={(require('../../../../assets/images/ic_camera.svg')) } className='receiptDetail-footer-camera'></Image>
                    <Input placeholder='我说的好，我来说' className='receiptDetail-footer-input'></Input>
                    <View className='receiptDetail-footer-comment-btn'>发送</View>
                </View>
            </View>
        </View>
    )
}
