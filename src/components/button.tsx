import React, { ReactNode, MouseEvent } from "react";
import Svg from "@/components/svg";

interface Props {
  className?: string;
  icon?: boolean;
  flat?: boolean;
  round?: boolean;
  active?: boolean;
  color?: string;
  size?: string;
  load?: boolean;
  children?: ReactNode;
  onClick?: () => void;
}

const Button = (props: Props) => {
  const {
    className = "",
    icon = false,
    flat = false,
    round = false,
    active = false,
    color = "",
    size = "",
    load = false,
    onClick = () => {},
    children
  } = props;

  return (
    <button
      className={`modis-button ${icon ? "modis-button--icon" : ""} ${
        flat ? "modis-button--flat" : ""
      } ${round ? "modis-button--round" : ""}
        ${active ? "modis-button--active" : ""}
        ${color ? `modis-button--${color}` : ""}
        ${size ? `modis-button--${size}` : ""}
        ${className}
        `}
      disabled={load}
      onClick={onClick}
    >
      <div className="modis-container">
        {load ? <Svg name="three-dots" /> : children}
      </div>
    </button>
  );
};

export default Button;
