import { Modal } from "@mui/material";
import { useContext } from "react";
import { NotesContext } from "../../context/NotesContext";
import { useState } from "react";
import Button from "../../ui/button";

export default function SignUpComponent() {
  const {
    openSignUpComponent,
    setOpenSignUpComponent,
    setOpenLoginComponent,
    authenticating,
  } = useContext(NotesContext);

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");

  function handleClose() {
    setOpenSignUpComponent(false);
  }

  return (
    <Modal
      open={openSignUpComponent}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <form
        className="bg-white flex flex-col items-center justify-center p-4 gap-3 rounded-md w-2/5"
        // onSubmit={handleFormSubmit}
      >
        <h2 className="text-heading text-xl font-bold">Register</h2>

        <div className="flex flex-col w-full gap-1">
          <label htmlFor="name" className="text-base">
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full outline-0 p-4 rounded-md border-2 border-black"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label htmlFor="email" className="text-base">
            Email address:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-full outline-0 p-4 rounded-md border-2 border-black"
            placeholder="Enter email address"
            autoComplete="on"
            required
          />
        </div>

        <div className="flex flex-col w-full gap-1">
          <label htmlFor="password" className="text-base">
            Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            className="w-full outline-0 p-4 rounded-md border-2 border-black"
            placeholder="Enter password"
            required
            minLength={8}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        {password?.length > 1 && password?.length < 8 && (
          <span className="password-err-msg">
            Password must be greater than 8 characters!
          </span>
        )}
        <div className="password-checkbox">
          <input
            type="checkbox"
            name="checkbox"
            id="show-password"
            onChange={() => setShowPassword((prev) => !prev)}
          />
          <label htmlFor="show-password">Show password</label>
        </div>

        <p>
          Already have an account?{" "}
          <span
            className="here-text"
            onClick={() => {
              setOpenSignUpComponent(false);
              setOpenLoginComponent(true);
            }}
          >
            Login!
          </span>
        </p>

        <Button
          type="submit"
          disabled={authenticating}
          isLoading={authenticating}
          className="bg-info"
        >
          Register
        </Button>
      </form>
    </Modal>
  );
}
