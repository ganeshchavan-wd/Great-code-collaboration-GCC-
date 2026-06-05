import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
const navigate = useNavigate();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const registerUser = async (e) => {
e.preventDefault();

try {
  await API.post("/auth/register", {
    name,
    email,
    password,
  });

  alert("Registration Successful");
  navigate("/");
} catch (err) {
  alert(
    err.response?.data?.message ||
      "Registration Failed"
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
          Great Code Collaboration
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
        onSubmit={registerUser}
        style={styles.form}
      >
        <h2 style={styles.formTitle}>
          Create Account
        </h2>

        <p style={styles.formSubtitle}>
          Join GCC and start collaborating
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={styles.input}
        />

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
          Create Account
        </button>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link
            to="/"
            style={styles.loginLink}
          >
            Login
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
position: "relative",
background:
"linear-gradient(135deg,#2563EB,#06B6D4)",
display: "flex",
justifyContent: "center",
alignItems: "center",
overflow: "hidden",
padding: "80px",
},

leftContent: {
zIndex: 2,
display: "flex",
flexDirection: "column",
alignItems: "center",
color: "white",
},

logoGlow: {
width: "300px",
height: "300px",
borderRadius: "50%",
background: "white",
position: "absolute",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
filter: "blur(120px)",
opacity: 0.15,
},

logo: {
fontSize: "120px",
fontWeight: "900",
letterSpacing: "10px",
margin: 0,
},

divider: {
width: "90px",
height: "4px",
borderRadius: "20px",
background: "rgba(255,255,255,0.8)",
marginTop: "15px",
marginBottom: "20px",
},

heading: {
fontSize: "38px",
textAlign: "center",
marginTop: "10px",
},

tagline: {
textAlign: "center",
fontSize: "20px",
lineHeight: "2",
marginTop: "25px",
maxWidth: "420px",
},

status: {
marginTop: "35px",
display: "flex",
alignItems: "center",
gap: "10px",
fontSize: "15px",
},

dot: {
width: "12px",
height: "12px",
borderRadius: "50%",
background: "#22C55E",
boxShadow: "0 0 15px #22C55E",
},

right: {
flex: 1,
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
fontSize: "15px",
},

input: {
width: "100%",
padding: "18px 22px",
marginBottom: "20px",
borderRadius: "14px",
border: "1px solid #334155",
background: "#1E293B",
color: "white",
outline: "none",
fontSize: "16px",
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

