import React from 'react'
import { View } from '@tarojs/components'
import './index.scss'
export default function Notice() {
    return (
        <View>
            <View className='global-notice-outer'>
                <View className='global-notice'>
                    <View className='global-notice-title'>
                        提示
                    </View>
                    <View className='global-notice-content'>
                        确定取消收藏我是很长很长很长很长很长很长
                    </View>
                    <View className='global-notice-btns'>
                        <View className='global-notice-sure-btn'>
                            确定
                        </View>
                        <View className='global-notice-cancel-btn'>
                            取消
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
