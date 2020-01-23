import React from "react";
import T from "../common/Translation"

const NavigationModule = ({ page, order }) => {
  return (
    <div className="navigation-module">
      <div className="title">
        <a href={page.slug}><span><T id="module" />{order && ` ${order}: `}</span><span>{page.title}</span></a>
      </div>
    </div>
  );
};

export default NavigationModule;
