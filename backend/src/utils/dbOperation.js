import ApiError from "./ApiError.js";

const dbErrorMap = [
  {
    match: (error) =>
      error?.cause?.code === "SQLITE_CONSTRAINT" &&
      error?.cause?.message?.includes("UNIQUE constraint failed: users.email"),

    statusCode: 409,
    message: "The email is already in use.",
  },
  {
    match: (error) =>
      error?.cause?.code === "SQLITE_CONSTRAINT" &&
      error?.cause?.message?.includes("UNIQUE constraint failed"),

    statusCode: 409,
    message: "This information is already in use.",
  },
  {
    match: (error) =>
      error?.cause?.code === "SQLITE_CONSTRAINT" &&
      error?.cause?.message?.includes("NOT NULL constraint failed"),

    statusCode: 400,
    message:
      "Some required information is missing. Please check your details and try again.",
  },

  {
    match: (error) =>
      error?.cause?.code === "SQLITE_CONSTRAINT" &&
      error?.cause?.message?.includes("FOREIGN KEY constraint failed"),

    statusCode: 400,
    message:
      "We couldn't complete that request. Please check the information and try again.",
  },

  {
    match: (error) =>
      error?.cause?.code === "SQLITE_CONSTRAINT" &&
      error?.cause?.message?.includes("CHECK constraint failed"),

    statusCode: 400,
    message:
      "Some of the information provided isn't valid. Please check your details and try again.",
  },
];

const dbOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    const mappedError = dbErrorMap.find((entry) => entry.match(error));

    if (mappedError) {
      throw new ApiError(mappedError.statusCode, mappedError.message);
    }

    throw error;
  }
};

export default dbOperation;
