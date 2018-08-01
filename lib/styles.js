export const apercuFontFamily = `Apercu, Roboto, Work Sans, Helvetica, Arial, sans-serif`
export const estebanFontFamily = `'Esteban', Georgia, serif`

export const navHeight = 72

export const colors = {
  mostlyBlack: '#232323',
  coffee: '#ca9673',
  olive: '#6d604f',
  darkEvergreen: '#26391f',
  cream: '#f9eecf',
  dustyLeaf: '#727d6d',
  dustyRose: '#f0c9bc',
  secondaryDarkBlue: '#1d24c1',
  secondaryDarkBrown: '#741c1f',
  secondaryDarkGreen: '#11702f',
  secondaryDarkOrange: '#e37223',
  secondaryDarkPink: '#d9508a',
  secondaryDarkPurple: '#432e6c',
  secondaryDarkRed: '#e50d43',
  secondaryLightBlue: '#5da1d6',
  secondaryLightGreen: '#23a53e',
  secondaryLightOrange: '#eb991b',
  secondaryLightPink: '#f07694',
  secondaryLightRed: '#e5382f'
}

export const type = {
  apercuXS: `
    font-family: ${apercuFontFamily};
    font-size: 12px;
    line-height: 16px;
    -webkit-font-smoothing: initial;
    -moz-osx-font-smoothing: initial;
  `,
  apercuS: `
    font-family: ${apercuFontFamily};
    font-size: 16px;
    line-height: 24px;
    -webkit-font-smoothing: initial;
    -moz-osx-font-smoothing: initial;
  `,
  apercuM: `
    font-family: ${apercuFontFamily};
    font-size: 20px;
    line-height: 32px;
    -webkit-font-smoothing: initial;
    -moz-osx-font-smoothing: initial;
  `,
  estebanM: `
    font-family: ${estebanFontFamily};
    font-size: 20px;
    line-height: 32px;
  `,
  estebanL: `
    font-family: ${estebanFontFamily};
    font-size: 36px;
    line-height: 54px;
  `
}

export const margins = {
  xs: 8,
  s: 16,
  m: 24,
  l: 64
}

export const reset = `
  /* http://meyerweb.com/eric/tools/css/reset/
    v4.0 | 20180602
    License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
    color: ${colors.mostlyBlack};
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  * {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  img {
    max-width: 100%;
  }
`
