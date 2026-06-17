export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function authErrorMessage(error: unknown, mode: "login" | "register") {
  const message = errorMessage(error);
  if (mode === "login" && /invalid credentials|forbidden|403/i.test(message)) {
    return "Login failed: email or password is incorrect, or the account has not been registered yet.";
  }
  return message;
}
