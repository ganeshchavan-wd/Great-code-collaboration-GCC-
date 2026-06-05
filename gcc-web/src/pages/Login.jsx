import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const loginUser = async (e) => {
e.preventDefault();

try {
  const res = await API.post("/auth/login", {
    email,
    password,
  });

  localStorage.setItem(
    "token",
    res.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
  );

  navigate("/dashboard");
} catch (err) {
  alert(
    err.response?.data?.message ||
      "Login Failed"
  );
}


};

return ( <div style={styles.container}> <div style={styles.mainCard}>
{/* LEFT SIDE */}

    <div style={styles.left}>
      <div style={styles.logoGlow}></div>

      <div style={styles.leftContent}>
        <h1 style={styles.logo}>GCC</h1>

        <div style={styles.divider}></div>

        <h2 style={styles.heading}>
          Welcome Back
        </h2>

        <p style={styles.tagline}>
          Collaborate seamlessly,
          <br />
          code in real-time,
          <br />
          and build amazing projects together.
        </p>

        <div style={styles.status}>
          <span style={styles.dot}></span>
          Real-Time Collaboration Platform
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}

    <div style={styles.right}>
      <form
        onSubmit={loginUser}
        style={styles.form}
      >
        <h2 style={styles.formTitle}>
          Login
        </h2>

        <p style={styles.formSubtitle}>
          Access your GCC workspace
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
        >
          Login
        </button>

        <p style={styles.loginText}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={styles.loginLink}
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  </div>
</div>


);
}

const styles = {
container: {
minHeight: "100vh",
background:
"linear-gradient(135deg,#020617,#0F172A,#1E293B)",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "30px",
},

mainCard: {
width: "100%",
maxWidth: "1250px",
minHeight: "720px",
display: "flex",
borderRadius: "30px",
overflow: "hidden",
background: "#111827",
boxShadow:
"0 30px 80px rgba(0,0,0,0.5)",
},

left: {
flex: 1,
background:
"linear-gradient(135deg,#2563EB,#06B6D4)",
display: "flex",
justifyContent: "center",
alignItems: "center",
position: "relative",
padding: "80px",
},

leftContent: {
color: "white",
textAlign: "center",
zIndex: 2,
},

logoGlow: {
width: "350px",
height: "350px",
borderRadius: "50%",
background: "white",
position: "absolute",
filter: "blur(140px)",
opacity: 0.15,
},

logo: {
fontSize: "130px",
fontWeight: "900",
letterSpacing: "10px",
margin: 0,
},

divider: {
width: "90px",
height: "4px",
borderRadius: "20px",
background: "rgba(255,255,255,0.8)",
margin: "20px auto",
},

heading: {
fontSize: "40px",
marginBottom: "20px",
},

tagline: {
fontSize: "20px",
lineHeight: "2",
},

status: {
marginTop: "35px",
display: "flex",
justifyContent: "center",
alignItems: "center",
gap: "10px",
},

dot: {
width: "12px",
height: "12px",
borderRadius: "50%",
background: "#22C55E",
},

right: {
flex: 1,
background: "#0F172A",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "80px",
},

form: {
width: "100%",
maxWidth: "450px",
},

formTitle: {
color: "white",
fontSize: "42px",
textAlign: "center",
marginBottom: "10px",
},

formSubtitle: {
color: "#94A3B8",
textAlign: "center",
marginBottom: "35px",
},

input: {
width: "100%",
padding: "18px 22px",
marginBottom: "20px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#1E293B",
color: "white",
fontSize: "16px",
outline: "none",
boxSizing: "border-box",
},

button: {
width: "100%",
padding: "18px",
borderRadius: "14px",
border: "none",
background:
"linear-gradient(135deg,#38BDF8,#2563EB)",
color: "white",
fontWeight: "700",
fontSize: "16px",
cursor: "pointer",
marginTop: "10px",
boxShadow:
"0 15px 30px rgba(37,99,235,0.4)",
},

loginText: {
textAlign: "center",
marginTop: "25px",
color: "#CBD5E1",
},

loginLink: {
color: "#38BDF8",
textDecoration: "none",
fontWeight: "bold",
},
};
