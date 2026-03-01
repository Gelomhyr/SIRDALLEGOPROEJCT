import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, ArrowRight, ArrowLeft, Mail, MapPin, Phone, Upload, X } from "lucide-react";

type ViewState = "login" | "forgot" | "create";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Login State
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: ""
  });

  // Register State
  const [registerData, setRegisterData] = useState({
    username: "",
    firstName: "",
    middleName: "",
    lastName: "",
    address: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (view === "login") {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          identifier: loginData.identifier,
          password: loginData.password,
        });
        localStorage.setItem("token", res.data.token);
        
        if (res.data.role === 'admin') {
          navigate("/admin-dashboard");
        } else if (res.data.role === 'superadmin') {
          navigate("/super-admin-dashboard");
        } else {
          navigate("/home");
        }
      } catch (err: any) {
        alert(err.response?.data?.msg || "Login Failed");
      }
    } else if (view === "create") {
      if (!agreeTerms) {
        alert("You must agree to the Terms and Conditions");
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!/^\d{11}$/.test(registerData.contactNumber)) {
        alert("Contact number must be exactly 11 digits");
        return;
      }

      try {
        await axios.post("http://localhost:5000/api/auth/send-otp", { email: registerData.email });
        setShowOtpModal(true);
        alert("OTP sent to your email!");
      } catch (err: any) {
        alert(err.response?.data?.msg || "Failed to send OTP");
      }
    } else {
      alert("Password reset functionality coming soon!");
    }
  };

  const handleVerifyAndRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { ...registerData, otp });
      alert("Registration Successful! You can now login.");
      setShowOtpModal(false);
      setView("login");
    } catch (err: any) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
      <div className={`flex w-full max-w-6xl items-start gap-12 ${view === "create" ? "lg:flex-row-reverse" : "lg:flex-row"}`}>
        
        {/* LEFT SIDE: Branding (Hidden on mobile) */}
        <motion.div layout transition={{ type: "spring", stiffness: 100, damping: 20 }} className="hidden flex-1 flex-col gap-6 lg:flex sticky top-20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1e293b] text-white font-bold text-xl">
              BT
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">BAYANTRACK +</h1>
              <p className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Mambog II, Bacoor</p>
            </div>
          </div>
          <h2 className="text-6xl font-extrabold text-[#2563eb] leading-tight">
            Digital Governance <br /> Made Simple.
          </h2>
          <p className="max-w-md text-lg text-slate-600 leading-relaxed">
            Access barangay services, stay updated with news, and report community issues all in one secure platform.
          </p>
        </motion.div>

        {/* RIGHT SIDE: Dynamic Card */}
        <motion.div layout transition={{ type: "spring", stiffness: 100, damping: 20 }} className="w-full max-w-[500px] rounded-[40px] bg-white p-10 shadow-2xl shadow-slate-200 border border-slate-100">
          
          {/* --- LOGIN VIEW --- */}
          {view === "login" && (
            <>
              <h3 className="text-3xl font-bold text-slate-900">Resident Login</h3>
              <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the resident portal.</p>
              <form className="mt-8 flex flex-col gap-5" onSubmit={handleAction}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Username / Email / Phone</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={18} /></span>
                    <input type="text" required placeholder="Username, Email, or Phone" name="identifier" value={loginData.identifier} onChange={handleLoginChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                    <button type="button" onClick={() => setView("forgot")} className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:underline">Forgot?</button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></span>
                    <input type={showPassword ? "text" : "password"} required placeholder="••••••••" name="password" value={loginData.password} onChange={handleLoginChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] py-4 text-sm font-bold text-white transition hover:bg-slate-800">
                  Login to Portal <ArrowRight size={18} />
                </button>
              </form>
              <div className="mt-10 text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">No Account Yet?</p>
                <button onClick={() => setView("create")} className="mt-4 w-full rounded-xl border border-slate-200 py-4 text-sm font-bold text-slate-900 transition hover:bg-slate-50">Create Resident Account</button>
              </div>
            </>
          )}

          {/* --- FORGOT PASSWORD VIEW --- */}
          {view === "forgot" && (
            <>
              <button onClick={() => setView("login")} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to Login</button>
              <h3 className="mt-6 text-4xl font-extrabold text-slate-900">Forgot Password</h3>
              <p className="mt-3 text-slate-500">Enter your email address to reset your password.</p>
              <form className="mt-10 flex flex-col gap-6" onSubmit={handleAction}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></span>
                    <input type="email" placeholder="your@email.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-5 pl-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                  </div>
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-[#1e293b] py-5 text-sm font-bold text-white transition hover:bg-slate-800">Get OTP</button>
              </form>
            </>
          )}

          {/* --- CREATE ACCOUNT VIEW --- */}
          {view === "create" && (
            <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
              <button onClick={() => setView("login")} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-blue-600 transition"><ArrowLeft size={16} /> Back to Login</button>
              <h3 className="mt-6 text-3xl font-bold text-slate-900">Create Account</h3>
              <p className="mt-2 text-sm text-slate-500">Register to join the Mambog II community portal.</p>
              
              <form className="mt-8 flex flex-col gap-5 pb-4" onSubmit={handleAction}>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Username</label>
                  <input type="text" placeholder="Username" name="username" value={registerData.username} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">First Name</label>
                    <input type="text" placeholder="First Name" name="firstName" value={registerData.firstName} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Middle Name</label>
                    <input type="text" placeholder="Optional" name="middleName" value={registerData.middleName} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Last Name</label>
                  <input type="text" placeholder="Last Name" name="lastName" value={registerData.lastName} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Complete Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={14} /></span>
                    <input type="text" placeholder="Address" name="address" value={registerData.address} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pl-9 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone No.</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                      <input type="text" placeholder="09XX XXX XXXX" name="contactNumber" value={registerData.contactNumber} onChange={handleRegisterChange} maxLength={11} className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pl-9 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                      <input type="email" placeholder="your@email.com" name="email" value={registerData.email} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3 pl-9 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                    </div>
                  </div>
                </div>

                {/* ✅ Added Valid ID Upload Field */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Upload Valid ID (Barangay ID, Voter's, etc.)</label>
                  <div className="relative flex items-center justify-center w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 hover:bg-slate-100 cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Upload size={20} />
                      <span className="text-[10px]">Click or drag to upload image</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password</label>
                    <div className="relative">
                      <input type={showRegisterPassword ? "text" : "password"} placeholder="••••••••" name="password" value={registerData.password} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 pr-10 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                      <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showRegisterPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterChange} className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 pr-10 text-xs outline-none focus:border-blue-500 focus:bg-white" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 rounded border-slate-200" />
                  <p className="text-[10px] text-slate-500">I accept the <span className="text-blue-600 underline">Terms & Conditions</span> and <span className="text-blue-600 underline">Privacy Policy</span>.</p>
                </div>

                <button type="submit" className="mt-2 rounded-xl bg-[#1e293b] py-4 text-sm font-bold text-white transition hover:bg-slate-800">
                  Register Account
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Enter OTP</h3>
              <button onClick={() => setShowOtpModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <p className="mt-2 text-sm text-slate-500">We sent a 6-digit code to <span className="font-bold text-slate-700">{registerData.email}</span></p>
            
            <div className="mt-6">
              <input type="text" placeholder="123456" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-2xl font-bold tracking-widest outline-none focus:border-blue-500 focus:bg-white" />
            </div>

            <button onClick={handleVerifyAndRegister} className="mt-6 w-full rounded-xl bg-[#1e293b] py-4 text-sm font-bold text-white transition hover:bg-slate-800">
              Verify & Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;