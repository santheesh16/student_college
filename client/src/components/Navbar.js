import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuth, removeCookie, isStudlog } from "../auth/helpers";
import axios from "axios";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/js/src/collapse.js";
import "../App.css";
import "./style.css";
import { Navbar, Nav } from "react-bootstrap";
import KPR_LOGO from "../assets/icons/logo.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopHouse,faUserGraduate, faUserShield, faListAlt ,faAddressBook, faHandsHelping ,
  faUserPlus, faUserEdit, faUserLock, faPowerOff} from "@fortawesome/free-solid-svg-icons";

const LaptopHouse = <FontAwesomeIcon icon={faLaptopHouse} />;
const UserGraduate = <FontAwesomeIcon icon={faUserGraduate} />;
const UserShield = <FontAwesomeIcon icon={faUserShield} />;
const ListAlt = <FontAwesomeIcon icon={faListAlt} />;
const AddressBook = <FontAwesomeIcon icon={faAddressBook} />;
const HandsHelping = <FontAwesomeIcon icon={faHandsHelping} />;
const UserPlus = <FontAwesomeIcon icon={faUserPlus} />;
const UserEdit = <FontAwesomeIcon icon={faUserEdit} />;
const UserLock = <FontAwesomeIcon icon={faUserLock} />;
const PowerOff= <FontAwesomeIcon icon={faPowerOff} />;

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "blue" };
    } else {
      return { color: "#fff" };
    }
  };

  const signoutime = (event) => {
    if (isAuth() && isAuth().role === "admin") {
      history.push("/");
      localStorage.clear();
      removeCookie("token");
    } else {
      event.preventDefault();
      axios({
        method: "PUT",
        url: `/api/user/student/signout/${
          isStudlog().roll_number
        }`,
      })
        .then((response) => {
          history.push("/");
          localStorage.clear();
          removeCookie("token");
          console.log("SIGNOUT SUCCESS", response);
        })
        .catch((error) => {
          console.log("SIGNOUT ERROR", error.response.data);
        });
    }
  };

  const nav = () => (
    <Navbar bg="primary" expand="lg" className="navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <ul className="navbar-nav mr-auto">
            <a href="https://kpriet.ac.in/"><img src={KPR_LOGO} alt="clg-logo" width="70px" height="60px"/></a>
            {isAuth() && isAuth().role === "admin" && (
              <Fragment>

                <li className="nav-item dropdown">
                <Link
                    to="/"
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    style={isActive("/lab")}
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {LaptopHouse} 
                    Lab
                    
                    </Link>
                    <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/lab-attendance" className="dropdown-item">
                      {ListAlt}
                      Attendance
                    </Link>
                    <Link to="/lab-details" className="dropdown-item">
                      {AddressBook} 
                      Details
                    </Link>
                    
                    <Link to="/lab-preference" className="dropdown-item">
                      {HandsHelping}
                      Preference
                    </Link>
                  </div>
                </li>
                
                <li className="nav-item dropdown">
                  <Link
                    to="/"
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    style={isActive("/signup")}
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {UserGraduate}
                    Student 
                    
                  </Link>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/add" className="dropdown-item">
                      {UserPlus}
                      Add
                    </Link>
                    <Link to="/update" className="dropdown-item">
                      {UserEdit}
                      Update
                    </Link>
                    <Link to="/delete" className="dropdown-item">
                      {UserLock}
                      Block
                    </Link>
                  </div>
                </li>
              </Fragment>
            )}

            {/* {isStudlog() && isStudlog().role === "student" && (
              <Fragment>
                <li className="nav-item">
                  <Link
                    to="/home"
                    className="nav-link "
                    style={isActive("/home")}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    style={isActive("/private")}
                    to="/private"
                  >
                    {isStudlog().name}
                  </Link>
                </li>
              </Fragment>
            )}  */}
            {isAuth() && isAuth().role === "admin" && (
              <li>
                <Link
                  className="nav-link d-flex justify-content-end"
                  style={isActive("/admin-reset")}
                  to="/admin-reset"
                >
                  {UserShield }
                  Admin Reset
                </Link>
              </li>
            )}
          </ul>
          {
            <li className="nav-link ">
              <button
                className="btn btn-outline-danger"
                style={{ cursor: "pointer", color: "#fff" }}
                onClick={signoutime}
              >
                {PowerOff}
                Signout
              </button>
            </li>
          }
         
          
          
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);

