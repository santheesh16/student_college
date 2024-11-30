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
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import KPR_LOGO from "../assets/icons/KPR_Logo.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptopHouse,
  faUserGraduate,
  faUserShield,
  faListAlt,
  faAddressBook,
  faHandsHelping,
  faUserPlus,
  faUserEdit,
  faUserLock,
  faPowerOff,
} from "@fortawesome/free-solid-svg-icons";

const LaptopHouse = <FontAwesomeIcon icon={faLaptopHouse} />;
const UserGraduate = <FontAwesomeIcon icon={faUserGraduate} />;
const UserShield = <FontAwesomeIcon icon={faUserShield} />;
const ListAlt = <FontAwesomeIcon icon={faListAlt} />;
const AddressBook = <FontAwesomeIcon icon={faAddressBook} />;
const HandsHelping = <FontAwesomeIcon icon={faHandsHelping} />;
const UserPlus = <FontAwesomeIcon icon={faUserPlus} />;
const UserEdit = <FontAwesomeIcon icon={faUserEdit} />;
const UserLock = <FontAwesomeIcon icon={faUserLock} />;
const PowerOff = <FontAwesomeIcon icon={faPowerOff} />;

const Layout = ({ children, match, history }) => {
  const isActive = (path) => {
    if (match.path === path) {
      return { color: "#1B924B" };
    } else {
      return { color: "#fff" };
    }
  };

  const isDropDown = (path) => {
    if (match.path === path) {
      return { background: "#1C5092" };
    } else {
      return { background: "#fff" };
    }
  };

  window.onunload = ((ev) => {
    ev.preventDefault();
    axios({
      method: "PUT",
      url: `/api/user/student/signout/${isStudlog().roll_number}`,
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
  });

  window.onbeforeunload = ((ev) => {
    ev.preventDefault();
    axios({
      method: "PUT",
      url: `/api/user/student/signout/${isStudlog().roll_number}`,
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
  });

  const signoutime = (event) => {
    if (isAuth() && isAuth().role === "admin") {
      history.push("/");
      localStorage.clear();
      removeCookie("token");
    } else {
      event.preventDefault();
      axios({
        method: "PUT",
        url: `/api/user/student/signout/${isStudlog().roll_number}`,
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
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand href="https://kpriet.ac.in/">
          <img src={KPR_LOGO} alt="clg-logo" width="70px" height="60px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <ul className="navbar-nav mr-auto">
              {isAuth() && isAuth().role === "admin" && (
                <Fragment>
                  <li className="nav-item dropdown">
                    <Link
                      to="/"
                      className="nav-link dropdown-toggle"
                      id="navbarDropdown"
                      data-toggle="dropdown"
                      style={isActive("/lab")}
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {LaptopHouse}
                      Section
                    </Link>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link
                        to="/lab-attendance"
                        style={isDropDown("/lab-attendance")}
                        className="dropdown-item"
                      >
                        {ListAlt}
                        Attendance
                      </Link>
                      <Link
                        to="/lab-details"
                        style={isDropDown("/lab-details")}
                        className="dropdown-item"
                      >
                        {AddressBook}
                        Details
                      </Link>

                      <Link
                        to="/lab-preference"
                        style={isDropDown("/lab-preference")}
                        className="dropdown-item"
                      >
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
                      data-toggle="dropdown"
                      style={isActive("/signup")}
                      aria-haspopup="true"
                    >
                      {UserGraduate}
                      Employee
                    </Link>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <Link
                        to="/add"
                        style={isDropDown("/add")}
                        className="dropdown-item"
                      >
                        {UserPlus}
                        Add
                      </Link>
                      <Link
                        to="/update"
                        style={isDropDown("/update")}
                        className="dropdown-item"
                      >
                        {UserEdit}
                        Update
                      </Link>
                      <Link
                        to="/delete"
                        style={isDropDown("/delete")}
                        className="dropdown-item"
                      >
                        {UserLock}
                        Block
                      </Link>
                    </div>
                  </li>
                </Fragment>
              )}
            </ul>
          </Nav>
          <Nav>
            <div className="nav-link">
              {isAuth() && isAuth().role === "admin" && (
                <Link
                  className="nav-link"
                  style={isActive("/admin-reset")}
                  to="/admin-reset"
                >
                  {UserShield}
                  Admin Reset
                </Link>
              )}
            </div>
            {
              <div className="nav-link">
                <button
                  className="btn btn-outline-danger"
                  style={{ cursor: "pointer", color: "#fff" }}
                  onClick={signoutime}
                >
                  {PowerOff}
                  Signout
                </button>
              </div>
            }
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  const footerNav = () => (
    <div className="navbar footer">
      <p>Learn Beyond</p>
    </div>
  );

  return (
    <Fragment>
      {nav()}
      <div className="container">{children}</div>
    </Fragment>
  );
};

export default withRouter(Layout);
