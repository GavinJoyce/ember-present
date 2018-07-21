import colors from './colors';

/*
|-----------------------------------------------------------------------------
| Text colors                         https://tailwindcss.com/docs/text-color
|-----------------------------------------------------------------------------
|
| Here is where you define your text colors. By default these use the
| color palette we defined above, however you're welcome to set these
| independently if that makes sense for your project.
|
| Class name: .text-{color}
|
*/

export default Object.assign({}, colors, {
  'primary': colors['text-primary'],
  'secondary': colors['text-secondary'],
  'default': colors['text-default'],
  'default-soft': colors['text-default-soft'],
  'inverse': colors['text-inverse'],
  'inverse-soft': colors['text-inverse-soft'],
});
