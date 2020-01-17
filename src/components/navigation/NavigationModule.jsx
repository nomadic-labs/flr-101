import React from "react";

const NavigationModule = ({ page, order }) => {
  return (
    <div className="navigation-module">
      <div className="title">
        <a href={page.slug}><span>{order && `Module ${order}: `}</span><span>{page.title}</span></a>
      </div>
    </div>
  );
};

export default NavigationModule;
