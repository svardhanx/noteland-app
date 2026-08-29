import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../ui/button";
import { apiEndPoints } from "../../utils/apiEndpoints";
import { Modal } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import FieldError from "../Common/FieldError";
import { useMutation } from "../../hooks/use-mutation";
import { useAuthStore } from "../../store/authStore";
import { useNotesStore } from "../../store/notesStore";

const defaultValues = {
  email: "",
  password: "",
};

export default function LoginComponent() {
  const openLoginComponent = useAuthStore((s) => s.openLoginComponent);
  const setOpenLoginComponent = useAuthStore((s) => s.setOpenLoginComponent);
  const setOpenSignUpComponent = useAuthStore((s) => s.setOpenSignUpComponent);
  const setUser = useAuthStore((s) => s.setUser);
  const setUserLoggedIn = useAuthStore((s) => s.setUserLoggedIn);
  const fetchNotes = useNotesStore((s) => s.fetchNotes);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, error: mutationError, isLoading } = useMutation();

  async function handleFormSubmit(payload) {
    try {
      const url = apiEndPoints.LOGIN;

      const result = await mutate(url, payload, "POST");

      toast.success(result?.message);
      fetchNotes();
      setUser(result?.user);
      setUserLoggedIn(true);
      setOpenLoginComponent(false);
      reset();
    } catch (error) {
      console.error("Error occurred when submitting login request:", error);
      toast.error(
        error.message || mutationError || "Login failed. Please try again...",
      );
    }
  }

  function handleClose() {
    setOpenLoginComponent(false);
  }

  useEffect(() => {
    return () => {
      reset(defaultValues);
    };
  }, [reset]);

  return (
    <Modal
      open={openLoginComponent}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <form
        className="bg-white flex flex-col items-center justify-center p-3 md:p-4 gap-3 rounded-md w-full mx-3 md:mx-0 md:w-1/2 lg:w-2/5"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <h2 className="text-heading text-xl font-bold">Login to continue</h2>

        <Controller
          control={control}
          name="email"
          rules={{
            required: "email is required",
          }}
          render={({ field }) => {
            return (
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="email" className="text-base">
                  Email address:
                </label>
                <input
                  {...field}
                  type="email"
                  id="email"
                  className="w-full outline-0 p-2 md:p-4 rounded-md border-2 border-black"
                  placeholder="Enter email address"
                  autoComplete="on"
                />
                {errors?.email?.message && (
                  <FieldError message={errors?.email?.message} />
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "password is required",
            minLength: {
              value: 8,
              message: "Password must be greater than 8 characters",
            },
          }}
          render={({ field }) => {
            return (
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="password" className="text-base">
                  Password:
                </label>
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full outline-0 p-2 md:p-4 rounded-md border-2 border-black"
                  placeholder="Enter password"
                  minLength={8}
                />
                {errors?.password?.message && (
                  <FieldError message={errors?.password?.message} />
                )}
              </div>
            );
          }}
        />

        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            name="checkbox"
            id="show-password"
            onChange={() => setShowPassword((prev) => !prev)}
            className="w-4 h-4"
          />
          <label htmlFor="show-password">Show password</label>
        </div>

        <p className="flex items-center gap-1">
          <span>Need an account?</span>
          <span
            className="cursor-pointer underline text-info"
            onClick={() => {
              setOpenLoginComponent(false);
              setOpenSignUpComponent(true);
            }}
          >
            Signup!
          </span>
        </p>

        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-info"
        >
          Login
        </Button>
      </form>
    </Modal>
  );
}
