const React = require('react')
const ReactDOM = require('react-dom')

const styles = {
  bg: {
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  inner: {
    background: 'white',
    height: '500px',
    width: '500px',
    padding: '20px',
    margin: '20px auto'
  },
  btn: {
    zIndex: 3,
    position: 'absolute'
  }
}

class HelloMessage extends React.Component {
  constructor () {
    super()
    this.state = { open: true }
  }
  render () {
    const opened = (
      <div style={styles.bg}>
        <div style={styles.inner}>
          Hello {this.props.name}
        </div>
      </div>
    )
    const closed = <div />
    return (
      <div>
        {this.state.open ? opened : closed}
        <button style={styles.btn} onClick={() => this.toggleModalOpen()}>
          {this.state.open ? 'Close' : 'Open'}
        </button>
      </div>
    )
  }
  toggleModalOpen () {
    this.setState({ open: !this.state.open })
  }
}

ReactDOM.render(<HelloMessage open name='Taylor' />, document.body)
