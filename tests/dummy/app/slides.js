
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
    {
      name: 'slide-3',
      roles: {
        screen: {
          type: 'video',
          src: 'http://vs-mobile-client.gavinjoyce.com.s3-website-eu-west-1.amazonaws.com/videos/final_intro.mp4'
        }
      }
    },
    { name: 'slide-4' },
  ]
}
