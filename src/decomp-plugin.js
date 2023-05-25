import decomp from 'poly-decomp'

export default function decompPlugin () {
  return {
    name: 'decomp-plugin', // this name will show up in warnings and errors
    plugins: [
    // load ( options ) {
    //   console.log('heya')
    //   window.decomp = decomp
    // },
    ]
  };
}