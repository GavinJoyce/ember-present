import colors from './colors';

/*
|-----------------------------------------------------------------------------
| Background colors             https://tailwindcss.com/docs/background-color
|-----------------------------------------------------------------------------
|
| Here is where you define your background colors. By default these use
| the color palette we defined above, however you're welcome to set
| these independently if that makes sense for your project.
|
| Class name: .bg-{color}
|
*/

export default Object.assign({}, colors, {
  'primary': colors['bg-primary'],
  'secondary': colors['bg-secondary'],
  'default': colors['bg-default'],
  'inverse': colors['bg-inverse'],
});
