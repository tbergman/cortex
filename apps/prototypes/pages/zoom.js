import React from 'react'
import Head from 'next/head'
import initZoom from '../lib/init-zoom'

export default class Zoom extends React.Component {
  constructor () {
    super()
    if (typeof window !== 'undefined') initZoom()
  }
  render () {
    return (
      <div>
        <nav className='navbar navbar-inverse navbar-fixed-top'>
          <div className='container'>
            <div className='navbar-header'>
              <a className='navbar-brand' href='#'>MyMeetingApp</a>
            </div>
            <div id='navbar'>
              <form className='navbar-form navbar-right' id='meeting_form'>
                <div className='form-group'>
                  <input
                    type='text'
                    name='display_name'
                    id='display_name'
                    value=''
                    placeholder='Name'
                    className='form-control'
                    required
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='text'
                    name='meeting_number'
                    id='meeting_number'
                    value=''
                    placeholder='Meeting Number'
                    className='form-control'
                    required
                  />
                </div>
                <button
                  type='submit'
                  className='btn btn-primary'
                  id='join_meeting'
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </nav>
        <Head>
          <script
            crossorigin
            src='https://unpkg.com/react@16/umd/react.development.js'
          />
          <script
            crossorigin
            src='https://unpkg.com/react-dom@16/umd/react-dom.development.js'
          />
          <script src='static/redux.min.js' />
          <script src='static/redux-thunk.min.js' />
          <script src='static/jquery.min.js' />
          <script src='static/jquery.i18n.js' />
          <script src='https://source.zoom.us/zoom-meeting-1.2.4.min.js' />
        </Head>
      </div>
    )
  }
}
