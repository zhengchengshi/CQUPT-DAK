export default {
  pages: [
    'pages/market/market',
    'pages/receipt/receipt',
    'pages/user/user',
    'pages/community/community',
    'pages/toolbox/toolbox',
  ],
  subPackages:[
    {
      "root":"pages/subpages/search",
      "pages":["index","search-result/index"]
    },
    {
      "root":"pages/subpages/goods",
      "pages":["good-detail/index","good-post/index"]
    },
    {
      "root":"pages/subpages/myCollect",
      "pages":["index"]
    },
    {
      "root":"pages/subpages/bookhouse",
      "pages":["book-detail/index","cart/index"]
    },
    {
      "root":"pages/subpages/chat",
      "pages":["index"]
    },
    {
      "root":"pages/subpages/toolbox",
      "pages":["searchTeam/index","delivery/index","searchTeam/addTeam/index","searchTeam/teamDetail/index"]
    },
    {
      "root":"pages/subpages/receiptSubpage",
      "pages":["receiptSearch/index","receiptDetail/index","receiptPost/index"]
    },
    {
      "root":"pages/subpages/communitySubpage",
      "pages":["communitySearch/index","communityDetail/index","communityIssue/index"]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#B0B0B0',
    selectedColor: '#333333',
    backgroundColor: 'white',
    list: [
      {
        pagePath: 'pages/market/market',
        text: '市场',
        iconPath: './assets/images/icon_market.png',
        selectedIconPath: './assets/images/icon_market_selected.png'
      },
      {
        pagePath: 'pages/receipt/receipt',
        text: '接单发单',
        iconPath: './assets/images/icon_receipt.png',
        selectedIconPath: './assets/images/icon_receipt_selected.png'
      },
      {
        pagePath: 'pages/community/community',
        text: '社区',
        iconPath: './assets/images/icon_community.png',
        selectedIconPath: './assets/images/icon_community_selected.png'
      },
      {
        pagePath: 'pages/toolbox/toolbox',
        text: '工具箱',
        iconPath: './assets/images/icon_toolbox.png',
        selectedIconPath: './assets/images/icon_toolbox_selected.png'
      },
      {
        pagePath: 'pages/user/user',
        text: '我的',
        iconPath: './assets/images/icon_user.png',
        selectedIconPath: './assets/images/icon_user_selected.png'
      }
    ]
  }
}
