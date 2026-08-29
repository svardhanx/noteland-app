import PropTypes from "prop-types";

export default function FieldError({ message }) {
  return <p className="text-error text-sm font-semibold">{message}</p>;
}

FieldError.propTypes = {
  message: PropTypes.string,
};
