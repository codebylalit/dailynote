import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

 const handleRegister = async () => {
   if (!username) {
     alert("Username is required");
     return;
   }

   try {
     const userCredential = await createUserWithEmailAndPassword(
       auth,
       email,
       password
     );
     const user = userCredential.user;

     await addDoc(collection(db, "users"), {
       uid: user.uid,
       username: username,
       email: user.email,
     });

     if (user) {
       navigate("/dashboard");
     } else {
       alert("Error: User authentication failed.");
     }

     setEmail("");
     setPassword("");
     setUsername("");
   } catch (error) {
     console.error(error);
     alert(error.message);
   }
 };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center w-full max-w-xs">
        <h1 className="text-3xl font-bold text-white mb-8">Start for free</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-3 text-white bg-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-3 text-white bg-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 text-white bg-gray-800 placeholder-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-200"
        >
          Sign Up
        </button>
        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
