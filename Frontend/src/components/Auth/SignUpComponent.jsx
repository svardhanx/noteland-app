import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import Button from "../../ui/button";
import { useAuthStore } from "../../store/authStore";
import { Controller, useForm } from "react-hook-form";
import FieldError from "../Common/FieldError";
import { useMutation } from "../../hooks/use-mutation";
import { toast } from "react-toastify";
import { apiEndPoints } from "../../utils/apiEndpoints";

const defaultValues = {
  name: "",
  email: "",
  password: "",
};

export default function SignUpComponent() {
  const openSignUpComponent = useAuthStore((s) => s.openSignUpComponent);

  const setOpenSignUpComponent = useAuthStore((s) => s.setOpenSignUpComponent);

  const setOpenLoginComponent = useAuthStore((s) => s.setOpenLoginComponent);

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, error: mutationError, isLoading } = useMutation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  async function handleRegister(payload) {
    try {
      const url = apiEndPoints.REGISTER;

      const result = await mutate(url, payload, "POST");

      toast.success(result?.message);

      setOpenSignUpComponent(false);

      setOpenLoginComponent(true);

      reset();
    } catch (error) {
      console.error("Error occurred when submitting register request:", error);
      toast.error(
        error.message ||
          mutationError ||
          "Registration failed. Please try again...",
      );
    }
  }

  function handleClose() {
    setOpenSignUpComponent(false);
    reset(defaultValues);
  }

  useEffect(() => {
    return () => {
      reset(defaultValues);
    };
  }, [reset]);

  return (
    <Modal
      open={openSignUpComponent}
      onClose={handleClose}
      className="flex items-center justify-center"
    >
      <form
        className="bg-white flex flex-col items-center justify-center p-3 md:p-4 gap-3 rounded-md mx-3 md:mx-0 w-full md:w-1/2 lg:w-2/5"
        onSubmit={handleSubmit(handleRegister)}
      >
        <h2 className="text-heading text-xl font-bold">Register</h2>

        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
          }}
          render={({ field }) => {
            return (
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name" className="text-base">
                  Name:
                </label>
                <input
                  {...field}
                  type="text"
                  id="name"
                  className="w-full outline-0 p-2 md:p-4 rounded-md border-2 border-black"
                  placeholder="Enter your name"
                />
                {errors?.name?.message && (
                  <FieldError message={errors?.name?.message} />
                )}
              </div>
            );
          }}
        />

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

        <p className="text-sm">
          Already have an account?{" "}
          <span
            className="cursor-pointer underline text-info"
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
          disabled={isLoading}
          isLoading={isLoading}
          className="bg-info"
        >
          Register
        </Button>
      </form>
    </Modal>
  );
}
