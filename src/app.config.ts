export default defineAppConfig({
  pages: [
    'pages/templates/index',
    'pages/materials/index',
    'pages/canvas/index',
    'pages/works/index',
    'pages/mine/index',
    'pages/brand-assets/index',
    'pages/collaboration/index',
    'pages/export/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '创意设计',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F7F8FA'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#7B61FF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/templates/index',
        text: '模板'
      },
      {
        pagePath: 'pages/materials/index',
        text: '素材'
      },
      {
        pagePath: 'pages/canvas/index',
        text: '画布'
      },
      {
        pagePath: 'pages/works/index',
        text: '作品'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
