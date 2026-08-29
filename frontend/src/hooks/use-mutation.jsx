import { useCallback, useState } from "react";

const headers = { "Content-Type": "application/json" };

export function useMutation() {
  const [state, setState] = useState({
    result: null,
    error: null,
    isLoading: false,
    isSuccess: false,
  });

  function reset() {
    setState({
      result: null,
      error: null,
      isLoading: false,
      isSuccess: false,
    });
  }

  const mutate = useCallback(
    async (url = "", body = null, method, otherConfig) => {
      if (url === "") {
        throw new Error("url was empty");
      }

      if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
        throw new Error("Invalid method");
      }

      const controller = new AbortController();

      const TIMEOUT = 5000;

      const timer = setTimeout(
        () => controller.abort(),
        otherConfig?.timeout || TIMEOUT,
      );

      const options = {
        method,
        credentials: "include",
        signal: controller.signal,
        ...otherConfig,
      };

      if (body) {
        options.body = JSON.stringify(body);
        options.headers = { ...headers, ...otherConfig?.headers };
      }

      setState({
        result: null,
        error: null,
        isLoading: true,
        isSuccess: false,
      });

      try {
        const response = await fetch(url, options);

        clearTimeout(timer);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }

        const data = await response.json();

        setState({
          result: data,
          error: null,
          isLoading: false,
          isSuccess: true,
        });

        return data;
      } catch (error) {
        clearTimeout(timer);

        let message = error.message || "Something went wrong";

        if (error.name === "AbortError") {
          message = "Request timed out";
        }

        setState({
          result: null,
          error: message,
          isLoading: false,
          isSuccess: false,
        });
        throw error;
      }
    },
    [],
  );

  return { mutate, ...state, reset };
}
