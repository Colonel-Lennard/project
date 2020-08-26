import React, {Component} from 'react';
import Login from './Login';

class App extends Component {
  render(){
    return (
      <div className="App">
        <h1>My first React App</h1>
        <p>Welcome</p>
        <Login />
      </div>
    );
  }
}

export default App;
