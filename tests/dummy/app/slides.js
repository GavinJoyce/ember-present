export default {
  roles: [
    'screen',
    'presenter',
    'notes',
    'audience'
  ],
  slides: [
    {
      name: 'slide-1',
      roles: {
        screen: {
          background: {
            type: 'gradient',
            linearGradient: '-15deg, #e7e33c, #e7e33c, #d52362, #d523ba'
          }
        }
      }
    },
    {
      name: 'slide-2',
      roles: {
        screen: {
          background: {
            type: 'video',
            mp4: '/backgrounds/Holiday lights.mp4',
            webm: '/backgrounds/Holiday lights.webm'
          }
        }
      }
    },
    {
      name: 'slide-3',
      roles: {
        screen: {
          background: {
            type: 'gradient'
          }
        }
      }
    },
    { name: 'slide-4' },
    {
      name: 'slide-5',
      roles: {
        screen: {
          componentPath: 'slides/declarative-slide',
          componentData: {
            title: 'This is the title',
            content: 'This is the content...'
          }
        }
      }
    },
    { name: 'realtime-drums' }
  ]
}
