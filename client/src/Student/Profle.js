import React, { useState, useEffect } from 'react';
import Layout from '../components/Navbar';
import axios from 'axios';
import {  isStudlog, getCookie, signout, updateUser } from '../auth/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Private = ({ history }) => {
    const [values, setValues] = useState({
        roll_number: '',
        register_number: '',
        name: '',
        department: '',
        year: '',
        email: '',
        password: '',
        buttonText: 'Submit'
    });

    const token = getCookie('token');

    useEffect(() => {
        loadProfile();
    });

    const loadProfile = () => {
        axios({
            method: 'GET',
            url: `http://localhost:8000/api/user/${isStudlog().roll_number}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE', response);
                const { roll_number, register_number ,department ,year, name, email } = response.data;
                setValues({ ...values, roll_number, register_number ,department ,year, name, email });
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

    const { roll_number, register_number, department , year, name, email, password, buttonText } = values;

    const handleChange = name => event => {
        // console.log(event.target.value);
        setValues({ ...values, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, buttonText: 'Submitting' });
        axios({
            method: 'PUT',
            url: "http://localhost:8000/api/user/update",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {  roll_number, register_number, department , year, name, email, password}
        })
            .then(response => {
                console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
                updateUser(response, () => {
                    setValues({ ...values, buttonText: 'Submitted' });
                    toast.success('Profile updated successfully');
                });
            })
            .catch(error => {
                console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
                setValues({ ...values, buttonText: 'Submit' });
                toast.error(error.response.data.error);
            });
    };

    const updateForm = () => (
        <form className="container col-md-10 border border-dark rounded mx-auto ">
      <div class="form-row">
        <div className="form-group col-md-6">
          <label className="col-sm-5 col-form-label font-weight-bold">
            Name
          </label>
          <input
            onChange={handleChange("name")}
            type="text"
            value={name}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-6">
          <label className="col-form-label font-weight-bold">Roll Number</label>
          <input
            onChange={handleChange("roll_number")}
            value={roll_number}
            type="text"
            className="form-control"
          />
        </div>
      </div>
      <div className="form-group">
        <label className="col-sm-5 col-form-label font-weight-bold">
          Register Number
        </label>
        <input
          onChange={handleChange("register_number")}
          value={register_number}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="col-sm-2 col-form-label font-weight-bold">
            Department
          </label>
          <select id="inputState"  onChange={handleChange("department")}
            type="text"
            value={department}
            className="form-control">
            <option selected>Choose</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>BIOMED</option>
          </select>
        </div>
        <div className="form-group col-md-6">
          <label className="col-sm-5 col-form-label font-weight-bold">
            Year
          </label>
          <select id="inputState" onChange={handleChange("year")}
            type="text"
            value={year}
            className="form-control">
          <option selected>Choose...</option>
          <option>I</option>
          <option>II</option>
          <option>III</option>
          <option>IV</option>
        </select>
        </div>
      </div>
      <div className="form-group">
        <label className="col-sm-5 col-form-label font-weight-bold">
          Password
        </label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
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
                <p className="lead text-center">Profile update</p>
                {updateForm()}
            </div>
        </Layout>
    );
};

export default Private;