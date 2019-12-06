import React from "react";

const icons = require.context("@/assets/icon", true, /\.svg$/);
icons.keys().forEach(icons);

interface Props {
  name?: string;
}

const Svg = (props: Props) => {
  const { name = "" } = props;
  const link = `#modis-${name}`;

  return (
    <svg className="modis-svg">
      <use xlinkHref={link} />
    </svg>
  );
};

export default Svg;
