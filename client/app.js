import React from 'react'
import {Navbar} from './components'
import Routes from './routes'
import {connect} from 'react-redux'

//MUI
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const App = props => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#24497A'
      },
      secondary: {
        main: '#3B79CC'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Routes />
    </ThemeProvider>
  )
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

export default connect(mapState)(App)
