import React from "react";
import Layout from './components/Navbar'
import { isStudlog} from './auth/helpers';
import COLLEGE_LOGO from "./assets/img/Collegelogo.webp";
import './App.css';




class App extends React.Component {
  
  componentDidMount() {
    if( isStudlog().role === 'student' ) {
      setTimeout(() => {
        this.props.history.push('/lab')
      }, 2000) // render for 5 seconds and then push to home 
    }
  }
  render() {
    return  ( 
      <Layout>
    <div className="text-center">
    <div>
      <p >
          <h1 className="font-weight-bolder text-center p-5">Welcome <br/> To <br/> KPR Institute Of Engineering And Technology</h1>
      </p>
      
      <div className="col-md-2 rounded mx-auto d-block">
      <img src={COLLEGE_LOGO} alt="clg-logo" width="180px" height="180px"/>
      </div>
      <div className=" text-center col-auto p-2"> 
      <button onClick= {() => {
          localStorage.clear();
          this.props.history.push('/');
      }} className=" btn btn-outline-primary form-group"> Logout</button>
      </div>
    </div>
      </div>
      </Layout>
    )
  }
  
};
export default App;