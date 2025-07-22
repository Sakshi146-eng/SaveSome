import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Authstyles.module.css";

const Auth = () => {
  const [tab, setTab] = useState("signup");
  const [signupData, setSignupData] = useState({ username: "", mobno: "", password: "" });
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupError, setSignupError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5555/user";
      await axios.post(url, signupData);
      setTab("login");
      setSignupError("");
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setSignupError(error.response.data.message);
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5555/user/login";
      const { data: res } = await axios.post(url, loginData);
      localStorage.setItem("token", res.data);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setLoginError(error.response.data.message);
      }
    }
  };

  return (
    <div className={styles.auth_card_center}>
      <div className={styles.auth_card}>
        <div className={styles.auth_split_container}>
          <div className={styles.left_image_half}>
            <img src="/Water.jpg" alt="Water" className={styles.full_bg_img} />
            <div className={styles.image_overlay}></div>
            <div className={styles.image_text}>SAVESOME</div>
          </div>
          <div className={styles.right_form_half}>
            <div className={styles.tabs_row}>
              <button
                className={tab === "signup" ? styles.active_tab : styles.tab}
                onClick={() => setTab("signup")}
              >
                Sign Up
              </button>
              <button
                className={tab === "login" ? styles.active_tab : styles.tab}
                onClick={() => setTab("login")}
              >
                Sign In
              </button>
            </div>
            <div className={styles.form_area}>
              {tab === "signup" ? (
                <form className={styles.form} onSubmit={handleSignupSubmit}>
                  <label className={styles.label}>User Name</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={signupData.username}
                    onChange={handleSignupChange}
                    className={styles.input}
                    required
                  />
                  <label className={styles.label}>Mobile Number</label>
                  <input
                    type="number"
                    name="mobno"
                    placeholder="Mobile Number"
                    value={signupData.mobno}
                    onChange={handleSignupChange}
                    className={styles.input}
                    required
                  />
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className={styles.input}
                    required
                  />
                  {signupError && <div className={styles.error}>{signupError}</div>}
                  <button type="submit" className={styles.submit_btn}>Sign Up</button>
                  <div className={styles.switch_text}>
                    Have an account?{' '}
                    <span className={styles.switch_link} onClick={() => setTab("login")}>SIGN IN</span>
                  </div>
                </form>
              ) : (
                <form className={styles.form} onSubmit={handleLoginSubmit}>
                  <label className={styles.label}>User Name</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={loginData.username}
                    onChange={handleLoginChange}
                    className={styles.input}
                    required
                  />
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className={styles.input}
                    required
                  />
                  {loginError && <div className={styles.error}>{loginError}</div>}
                  <button type="submit" className={styles.submit_btn}>Sign In</button>
                  <div className={styles.switch_text}>
                    New here?{' '}
                    <span className={styles.switch_link} onClick={() => setTab("signup")}>SIGN UP</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 