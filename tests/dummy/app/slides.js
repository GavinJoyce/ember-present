export default {
  roles: [
    'screen',
    'presenter',
    'notes',
    'audience'
  ],
  slides: [
    { name: 'slide-1' },
    {
      name: 'slide-2',
      roles: {
        screen: {
          background: {
            type: 'video',
            mp4: '/backgrounds/Head-or-Tails.mp4',
            webm: '/backgrounds/Head-or-Tails.webm'
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
    }
  ]
}
