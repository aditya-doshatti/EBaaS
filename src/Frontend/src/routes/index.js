import React from "react";
import { Redirect } from "react-router-dom";

// Pages Component

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/FogetPassword";

import Dashboard from "../pages/Dashboard";

import Connecttodatabase from "../pages/ConnectToDatabase/index";

import Addnewtable from "../pages/ModifyDatabase/AddNewTable";
import Addnewcolumn from "../pages/ModifyDatabase/AddNewColumn";
import Modifycolumn from "../pages/ModifyDatabase/ModifyColumn";
import Createrelationships from "../pages/ModifyDatabase/CreateRelationships";
import DeleteColumn from "../pages/ModifyDatabase/DeleteColumn";
import DeleteTable from "../pages/ModifyDatabase/DeleteTable";



// Extra Pages
import PagesLogin2 from "../pages/ExtraPages/PagesLogin2";
import PagesRegister2 from "../pages/ExtraPages/PagesRegister2";
import PagesRecoverpw2 from "../pages/ExtraPages/PagesRecoverpw2";
import PagesLockScreen2 from "../pages/ExtraPages/PagesLockScreen2";

// Extra Pages
import PagesTimeline from "../pages/ExtraPages/PagesTimeline";
import PagesInvoice from "../pages/ExtraPages/PagesInvoice";
import PagesDirectory from "../pages/ExtraPages/PagesDirectory";
import PagesBlank from "../pages/ExtraPages/PagesBlank";
import PagesPricing from "../pages/ExtraPages/PagesPricing";
import PagesGallery from "../pages/ExtraPages/PagesGallery";
import PagesFaq from "../pages/ExtraPages/PagesFaq";
import Pages404 from "../pages/ExtraPages/Pages404";
import Pages500 from "../pages/ExtraPages/Pages500";
import PagesMaintenance from "../pages/ExtraPages/PagesMaintenance";
import PagesComingsoon from "../pages/ExtraPages/PagesComingsoon";
import ViewDatabase from "../pages/ViewDatabase";
import Home from "../pages/Home";
import Application from "../pages/Application";
import ManageDatabase from "../pages/ManageDatabase";

const authProtectedRoutes = [

  // Connect to database
  { path: "/connecttodatabase", component: Connecttodatabase },

  // Manage databases
  { path: "/manageDatabase", component: ManageDatabase },

  // View Database
  { path: "/viewDatabase", component: ViewDatabase },

  // Modify Database
  { path: "/addnewtable", component: Addnewtable },
  { path: "/addnewcolumn", component: Addnewcolumn },
  { path: "/modifycolumn", component: Modifycolumn },
  { path: "/createrelationships", component: Createrelationships },
  { path: "/deletecolumn", component: DeleteColumn },
  { path: "/deletetable", component: DeleteTable },
  

  // Extra Pages
  { path: "/pages-timeline", component: PagesTimeline },
  { path: "/pages-invoice", component: PagesInvoice },
  { path: "/pages-directory", component: PagesDirectory },
  { path: "/pages-blank", component: PagesBlank },
  { path: "/pages-pricing", component: PagesPricing },
  { path: "/pages-gallery", component: PagesGallery },
  { path: "/pages-faq", component: PagesFaq },

  { path: "/dashboard", component: Dashboard },

  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forget-password", component: ForgetPwd },
  { path: "/pages-register", component: Register },

  // Extra Pages
  { path: "/pages-login-2", component: PagesLogin2 },
  { path: "/pages-register-2", component: PagesRegister2 },
  { path: "/pages-recoverpw-2", component: PagesRecoverpw2 },
  { path: "/pages-lock-screen-2", component: PagesLockScreen2 },

  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
  { path: "/pages-Maintenance", component: PagesMaintenance },
  { path: "/pages-comingsoon", component: PagesComingsoon },
  { path: "/home", component: Home },
  { path: "/addapplication", component: Application }
];

export { authProtectedRoutes, publicRoutes };
