/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import Spinner from "./spinner";
import { cn } from "../utils/cn";

export default function Button({
  children,
  isLoading,
  disabled,
  variant,
  onClick,
  type,
  leftSection,
  className,
}) {
  function getBackground() {
    let background = "";

    switch (variant) {
      case "success":
        background = "bg-success";
        break;

      case "info":
        background = "bg-info";
        break;

      case "error":
        background = "bg-error";
        break;

      case "warning":
        background = "bg-warning";
        break;

      default:
        background = "bg-primary";
        break;
    }

    return background;
  }

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type ? type : "button"}
      className={cn(
        `border-none outline-none ${getBackground()} rounded-md py-2 px-4 flex items-center justify-center min-w-30 max-w-40 text-white cursor-pointer  ${
          disabled && !isLoading ? "bg-gray-400 cursor-not-allowed!" : ""
        }
    ${isLoading ? "cursor-not-allowed!" : ""}`,
        className
      )}
    >
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="flex items-center gap-2">
          {leftSection}
          {children}
        </div>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "error", "warning", "info", "success"]),
  onClick: PropTypes.func,
};
