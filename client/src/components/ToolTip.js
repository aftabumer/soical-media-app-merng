import React from "react";
import { Popup } from "semantic-ui-react";

const ToolTip = ({ content, children }) => (
  <Popup inverted content={content} trigger={children} />
);

export default ToolTip;
