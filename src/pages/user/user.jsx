import { View, Text,Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import './user.scss'

export default function market() {
    return (
    <View>
      <View className='user-outer'>
        <View className='user-background'><Image src='https://s1.ax1x.com/2022/04/16/LYGTBT.png' className='user-background-img'></Image></View>
        <View className='user-userinfo'>
          <AtAvatar
            image='https://jdc.jd.com/img/200'
            circle
            size='large'
          ></AtAvatar>
          <View className='user-userinfo-right'>
            <View className='user-userinfo-firstline'>
              <View className='user-userinfo-username'>John Speed</View>
              <View className='user-userinfo-usergender'><Image src='https://s1.ax1x.com/2022/03/09/bWhCQI.png'></Image></View>
            </View>
            <View className='user-userinfo-secondline'>
              <Text className='user-userinfo-usersign'>欢迎你来看我呀陌生人</Text>
            </View>
          </View>
        </View>
        <View className='user-userinfo-notice'>
          <View className='user-userinfo-massage'>
            <Text>系统通知</Text>
            <Image src='https://s1.ax1x.com/2022/03/09/bWIchF.png'></Image>
          </View>
          <View className='user-userinfo-massage'>
            <Text>私聊消息</Text>
            <Image src='https://s1.ax1x.com/2022/03/09/bWoVun.png'></Image>
          </View>
        </View>
        <View className='user-userinfo-operate'>
            <View className='user-userinfo-operate-item'>
              <View className='user-userinfo-operate-item-left'>
                <Image src='https://s1.ax1x.com/2022/03/09/bWTxFf.png'></Image>
                <Text>我的在售商品</Text>
              </View>
              <View className='user-userinfo-operate-item-right'>
                <Image src='https://s1.ax1x.com/2022/03/09/bW7Jk6.png'></Image>
              </View>
            </View>
            <View className='user-userinfo-operate-item'>
              <View className='user-userinfo-operate-item-left'>
                <Image src='https://s1.ax1x.com/2022/03/09/bWHDv4.png'></Image>
                <Text>我的团队</Text>
              </View>
              <View className='user-userinfo-operate-item-right'>
                <Image src='https://s1.ax1x.com/2022/03/09/bW7Jk6.png'></Image>
              </View>
            </View>
            <View className='user-userinfo-operate-item'>
              <View className='user-userinfo-operate-item-left'>
                <Image src='https://s1.ax1x.com/2022/03/09/bWHgV1.png'></Image>
                <Text>我的单子</Text>
              </View>
              <View className='user-userinfo-operate-item-right'>
                <Image src='https://s1.ax1x.com/2022/03/09/bW7Jk6.png'></Image>
              </View>
            </View>
            <View className='user-userinfo-operate-item'>
              <View className='user-userinfo-operate-item-left'>
                <Image src='https://s1.ax1x.com/2022/03/09/bWTxFf.png'></Image>
                <Text>设置</Text>
              </View>
              <View className='user-userinfo-operate-item-right'>
                <Image src='https://s1.ax1x.com/2022/03/09/bWH42D.png'></Image>
              </View>
            </View>
        </View>
        <View className='user-userinfo-quitbtn'>
          退出登陆
        </View>
      </View>
    </View>
  );
}