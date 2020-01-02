import React from "react";
import { EditableText } from "react-easy-editables";


export default (props) => {
  return (
    <h2>
      <EditableText { ...props } classes={"my-4"} />
    </h2>
  );
};
