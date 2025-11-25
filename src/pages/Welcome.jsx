import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div className="bg-light py-5">
      <div className="container">


        <div className="text-center p-5 rounded shadow bg-white">

       
          <h1 className="fw-bold mb-3" style={{ color: "#0d6efd" }}>
            Wechi Gebi (ወጪ ገቢ)
          </h1>

       
          <h4 className="text-muted mb-4">
            Simple & Powerful Personal Finance Manager
          </h4>

     
          <p className="lead mb-4">
            Track your income, control spending, plan budgets, and take control of your financial life.
          </p>

        
          <p className="mb-4" style={{ fontSize: "1.1rem" }}>
            ገቢዎትንና ወጪዎትን በቀላሉ ይቆጣጠሩ፣ በጀት ያቋቋሙ፣ የፋይናንስዎንም ሁኔታ በቀላሉ ይመልከቱ።
          </p>

        
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/register" className="btn btn-primary btn-lg px-4">
              Create Account
            </Link>

            <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
              Login
            </Link>
          </div>

      
          <small className="d-block mt-4 text-muted">
            Your money. Your control. Your future.
          </small>

        </div>
      </div>
    </div>
  );
}

export default Welcome;
