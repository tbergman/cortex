/**
 * Wrapping code necessary to get MUI rendering properly in Next, copied from:
 * https://github.com/mui-org/material-ui/tree/master/examples/nextjs
 */
import React from 'react'
import App, { Container } from 'next/app'
import PropTypes from 'prop-types'
import flush from 'styled-jsx/server'
import JssProvider from 'react-jss/lib/JssProvider'
import { SheetsRegistry } from 'jss'
import {
  createMuiTheme,
  createGenerateClassName,
  MuiThemeProvider
} from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import { colors, apercuFontFamily } from 'styles'

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  typography: {
    fontFamily: apercuFontFamily,
    fontSize: 16,
    textTransform: 'capitalize'
  },
  palette: {
    primary: {
      light: colors.secondaryDarkBlue,
      main: colors.secondaryDarkBlue,
      dark: colors.secondaryDarkBlue
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700]
    }
  }
})

function createPageContext () {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  }
}

const getPageContext = () => {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext()
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext()
  }

  return global.__INIT_MATERIAL_UI__
}

export const initialProps = ctx => {
  // Render app and page and get the context of the page with collected side effects.
  let pageContext
  const page = ctx.renderPage(Component => {
    const WrappedComponent = props => {
      pageContext = props.pageContext
      return <Component {...props} />
    }
    WrappedComponent.propTypes = {
      pageContext: PropTypes.object.isRequired
    }
    return WrappedComponent
  })
  return {
    ...page,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: (
      <React.Fragment>
        <style
          id='jss-server-side'
          dangerouslySetInnerHTML={{
            __html: pageContext.sheetsRegistry.toString()
          }}
        />
        {flush() || null}
      </React.Fragment>
    )
  }
}

export class AppWrapper extends App {
  constructor (props) {
    super(props)
    this.pageContext = getPageContext()
  }

  pageContext = null

  componentDidMount () {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server side. */}
            <Component pageContext={this.pageContext} {...pageProps} />
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    )
  }
}

export const onComponentDidMount = () => {
  // Remove the server-side injected CSS.
  const jssStyles = document.querySelector('#jss-server-side')
  if (jssStyles && jssStyles.parentNode) {
    jssStyles.parentNode.removeChild(jssStyles)
  }
}
