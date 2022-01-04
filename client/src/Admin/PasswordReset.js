import React, { useState, useEffect} from 'react';
import Layout from '../components/Navbar';
import axios from 'axios';
import { isAuth, getCookie, signout, updateAdminReset } from '../auth/helpers';
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.min.css';




const AdminReset = ({ history }) => {
    const [values, setValues] = useState({
        roll_number: '',
        oldPassword: '',
        newPassword: '',
        showPassword: false,
        buttonText: 'Submit'
    });
    

    const token = getCookie('token');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/admin/${isAuth().id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE', response);
                const { role, name, roll_number } = response.data;
                setValues({ ...values, role, name, roll_number });
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
                if (error.response.status === 401) {
                    signout(() => {
                        history.push('/');
                    });
                }
            });
    };

    const {roll_number, newPassword, oldPassword, showPassword, buttonText } = values;

    const handleChange = name => event => {
        // console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: 'PUT',
            url: `http://localhost:8000/api/admin/adminUpdate`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { oldPassword, newPassword }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
                updateAdminReset(response, () => {
                    setValues({ ...values, oldPassword:'', newPassword: '', buttonText: 'Submitted' });
                    toast.success(' Password Successfully Updated ');
                });
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
                setValues({ ...values, buttonText: 'Submit' });
                toast.error(error.response.data.error);
            });
    };

    const updateForm = () => (
        <form>
            
            <div className="form-group">
                <label className="text-muted">Staff Id</label>
                <input defaultValue={roll_number} type="roll_number" className="form-control" disabled />

            </div>
            
            <div className="form-group">
                <label className="text-muted">Old Password</label>
                <input onChange={handleChange('oldPassword')} value={oldPassword} type={showPassword ? 'text' : 'password'} className="form-control" />
                
            </div>
            
            <div className="form-group">
                <label className="text-muted">New Password</label>
                <input onChange={handleChange('newPassword')} value={newPassword} type={showPassword ? 'text' : 'password'}  className="form-control" />
            </div>
            <div className="form-group">
            <input onChange={() => setValues({ ...values, showPassword : !showPassword})} type="checkbox" checked={showPassword}/> Show Password
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
                <p className="lead text-center">Change Password</p>
                {updateForm()}
            </div>
        </Layout>
    );
};

export default AdminReset;