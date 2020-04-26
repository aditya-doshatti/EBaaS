import React from 'react';

const Footer = () => {

  return (
    <React.Fragment>
      <footer className="footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
               {new Date().getFullYear()} EBaaS
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Footer;