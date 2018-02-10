
export default {
  roles: [
    'screen',
    'presenter',
    'notes',
    'audience'
  ],
  slides: [
    { name: 'slide-1' },
    { name: 'slide-2' },
    { name: 'slide-3' },
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
