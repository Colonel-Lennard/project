import React, {Component} from 'react';

class Login extends Component{
    render(){
        return(
            <div className="login">
                <h1>Sign In</h1>  
                <form onSubmit={this.handleSumbit}>
                    <input type="text" onChange={this.handleChange}/>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

export default Login