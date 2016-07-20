import React from 'react'

export default class Chatbox extends React.Component {

  constructor(){
    super();
    this.state = {
      text: '',
      messages: []
    }
  }

  componentDidMount () {
    var self = this
		socket.on('Chatbox message', function(msg){
			console.log("socket.on: ", msg)
  		self.setState({messages: self.state.messages.concat(msg) })
		});
  }

  _handleSubmit(event) {

    event.preventDefault();
    socket.emit('Chatbox message', {name: this.state.name  || 'Anon', message: this.state.text})
    // send request to the socket.io

   }


  render() {
    return (
      <div>
        <Messages messages={this.state.messages}/>
        <form onSubmit={this._handleSubmit.bind(this)}>
           <input
             type="text"
             value={this.state.text}
             className="u-full-width"
             placeholder="chat..."
             id="chatInput"
             onChange={event => this.setState({text: event.target.value})}
           />
           <input type="submit" style={{visibility: 'hidden'}} ></input>
        </form>
      </div>
    )
  }
}

class Messages extends React.Component {

  _createMessages() {
    return this.props.messages.map((msg, index) => {
      return <Message key={index} name={msg.name} message={msg.message}/>
    });
  }

  render() {
    return (
      <div className="messages">
          <table className="u-full-width">
            <tbody>
              {this._createMessages()}
            </tbody>
          </table>
      </div>
    )
  }
}

class Message extends React.Component {
  render() {
    return (

          <tr className="message">
            <td>{this.props.name}</td>
            <td>{this.props.message}</td>
          </tr>

    )
  }
}