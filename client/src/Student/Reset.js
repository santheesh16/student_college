import React, { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../components/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.min.css';

const Reset = ({ match, history }) => {
    // props.match from react router dom
    const [values, setValues] = useState({
        rollNumber: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset password'
    });

    useEffect(() => {

        let token = match.params.token;
        let { rollNumber } = jwt.decode(token);
        console.log(rollNumber);
        if (token) {
            setValues({ ...values, rollNumber, token });
        }
    },[]);

    const { rollNumber, token, newPassword, buttonText } = values;

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });    };

    const clickSubmit = event => {
        event.preventDefault();
        
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: 'PUT',
            url: `/api/reset-password/${rollNumber}/${token}`,
            data: { newPassword}
        })
            .then(response => {
                console.log('RESET PASSWORD SUCCESS', response);
                toast.success(response.data.message);
                setValues({ ...values, buttonText: 'Done' });
                setTimeout(() => {
                  history.push("/");
                }, 2000)
                
            })
            .catch(error => {
                console.log('RESET PASSWORD ERROR', error.response.data);
                toast.error(error.response.data.error);
                setValues({ ...values, buttonText: 'Reset password' });
            });
    };

    const passwordResetForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={handleChange('newPassword')}
                    value={newPassword}
                    type="text"
                    className="form-control"
                    placeholder="Type new password"
                />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="col-md-6 offset-md-3">
                <ToastContainer />
                <h1 className="p-5 text-center">Type your new password</h1>
                {passwordResetForm()}
            </div>
        </Layout>
    );
};

export default Reset;