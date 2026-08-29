/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import Spinner from "./spinner";
import { cn } from "../utils/cn";

const variantClasses = {
  success: "bg-success",
  info: "bg-info",
  error: "bg-error",
  warning: "bg-warning",
  primary: "bg-primary",
};

export default function Button({
  children,
  isLoading,
  disabled,
  variant = "primary",
  onClick,
  type,
  leftSection,
  className,
}) {
  const background = variantClasses[variant] || variantClasses.primary;

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      type={type ? type : "button"}
      className={cn(
        "relative border-none outline-none shrink-0 rounded-md py-2 px-4 flex items-center justify-center min-w-30 min-h-10",
        "text-white cursor-pointer justify-self-center transition-colors duration-200",
        background,
        (disabled || isLoading) && "opacity-70 cursor-not-allowed",
        isLoading && "text-transparent",
        className,
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
