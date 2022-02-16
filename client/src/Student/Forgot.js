import React, { useState } from 'react';
import Layout from '../components/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';




const Forgot = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    buttonText: 'Request password link'
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (event) => {

    setValues({ ...values, [name]: event.target.value })
  }


  const clickSubmit = event => {
    event.preventDefault()
    setValues({ ...values, buttonText: 'Submitting' })

    axios({
      method: 'POST',
      url: `/api/forget-password`,
      data: { email }
    })
      .then(response => {
        console.log('FORGOT PASSWORD', response);
        toast.success(response.data.message)
        setValues({ ...values, buttonText: 'Requested' })
      })
      .catch(error => {
        console.log('FORGOT PASSWORD ERROR', error.response.data)
        toast.error(error.response.data.error);
        setValues({ ...values, buttonText: 'Request password link' });

      });
  };

  const passwordFrgotForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
      </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>{buttonText}</button>
      </div>


    </form>
  )


  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="p-5 text-center">Forgot password</h1>
        {passwordFrgotForm()}
      </div>

    </Layout>
  );
};

export default Forgot;