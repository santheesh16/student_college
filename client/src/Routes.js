import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import App from "./App";
import Add from "./Admin/Add";
import Login from "./components/Login";
import Update from "./Admin/Update";
import Delete from "./Admin/Block";
import AdminReset from "./Admin/PasswordReset";
import Forgot from "./Student/Forgot";
import Private from "./Student/Profle";
import PrivateRoute from "./auth/main-auth/PrivateRoute";
import Attendance from "./Admin/Attendance";
import AdminRoute from "./auth/main-auth/AdminRoute";
import Reset from "./Student/Reset";
import Lab from "./Student/Lab";
import LabPreference from "./Admin/LabPreference";
import LabDetails from "./Admin/LabDetails";
const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/home" exact component={App} />
        <Route path="/" exact component={Login} />
        <PrivateRoute path="/private" exact component={Private} />
        <AdminRoute path="/lab-attendance" exact component={Attendance} />
        <AdminRoute path="/admin-reset" exact component={AdminReset} />
        <Route path="/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:token" exact component={Reset} />
        {/* Student Modification */}
        <Route path="/lab-preference" exact component={LabPreference} />
        <Route path="/lab-details" exact component={LabDetails} />
        <Route path="/add" exact component={Add} />
        <Route path="/delete" exact component={Delete} />
        <Route path="/update" exact component={Update} />
        <PrivateRoute path="/lab" exact component={Lab} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
