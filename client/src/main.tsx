import React from "react";
import "./index.css";
import RoutingConfig from "./config/routing.config";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./index.css"

const htmlRoot: HTMLElement = document.getElementById('root') as HTMLElement;
const RootElement = ReactDOM.createRoot(htmlRoot);
RootElement.render(
  <React.StrictMode>
     <BrowserRouter>
    <RoutingConfig/>
    </BrowserRouter>
  </React.StrictMode>
);

