import React, { useState } from "react";
// import LoginForm from "./components/LoginForm";
import LoginForm from "./LoginForm";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (credentials) => {
    const res = await fetch("http://localhost:9000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token); // Save JWT
    setUser(data.user);
  };

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.name} 🎉</h2>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
