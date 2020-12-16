import React, { Component } from 'react';
import '../css/App.css';

class Dialog extends Component {
  render() {
    return (
      <div id='windowContainer'>
        <div className='window' style={{width: this.props.width, height: this.props.height}}>
          {React.cloneElement(this.props.children)}
        </div>
      </div>
    )
  }
}

export default Dialog;