export async function login(username: string, password: string) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 201) {
      const json: any = await res.json();
      // after 24 hours, the token will expire
      let expires = new Date();
      expires.setDate(expires.getDate() + 1);

      localStorage.setItem("userId", json.userId);
      localStorage.setItem("token", json.token);
      localStorage.setItem("expires", expires.toString());

      return json;
    } else {
      if (res.status === 404) {
        throw new Error("Username not found. Create an account first.");
      } else {
        throw new Error("Incorrect password.");
      }
    }
  });
}

export async function register(
  username: string,
  password: string,
  first_name: string,
  last_name: string,
  email: string,
  birthdate: Date
) {
  return await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      first_name,
      last_name,
      email,
      birthdate,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    if (res.status === 201) {
      const json: any = await res.json();
      return json;
    } else {
      const json: any = await res.json();
      throw new Error(json.error);
    }
  });
}

export function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("expires");
}

export function isLoggedIn() {
  return localStorage.getItem("token") &&
    localStorage.getItem("expires") &&
    new Date(localStorage.getItem("expires") as string) > new Date()
    ? true
    : false;
}
