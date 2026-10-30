//components
import InputField from "../../components/input/InputField";
import { toast } from "sonner";

//hook
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//icon
import {
  IconMailFilled,
  IconLockFilled,
  IconDoorEnter,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import logo from "../../assets/Logo.svg";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isAdmin, loading: authLoading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAdmin) navigate("/admin/dashboard", { replace: true });
  }, [authLoading, isAdmin, navigate]);

  function handleEmailChange(e) {
    let value = e.target.value;
    setEmail("");
    if (!value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
      setEmail(value);
    }
  }

  async function handleLogin(e) {
    e.preventDefault(); 
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const tokenResult = await userCredential.user.getIdTokenResult(true);

      if(tokenResult.claims.admin !== true){
        await auth.signOut();
        toast.error("You do not have admin privileges.");
        return;
      }

      toast.success("Login successful!", {
        description: `Welcome back, ${userCredential.user.email}!`,
      });

      navigate("/admin/dashboard"); 

    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        toast.error("Account temporarily locked", {
          description: "Too many failed login attempts. Please wait a few minutes and try again.",
        });
      } 
      else if (error.code === "auth/invalid-login-credentials" || error.code === "auth/invalid-credential") {
        toast.error("Login failed", {
          description: "Incorrect email or password.",
        });
      } 
      else {
        toast.error("Login failed", {
          description: "Please check your connection and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return <main className="page-container flex items-center justify-center text-green-800">Checking account…</main>;
  }
  if (isAdmin) return null;

  return (
    <main className="page-container login-page">
      <form onSubmit={handleLogin} className="flex flex-col items-center justify-center gap-4 shadow-2xl rounded-2xl p-8 w-full max-w-md bg-white/80 border border-gray-200">
        <img src={logo} alt="Logo" className="w-32 h-32" />
        <h1 className="text-2xl font-bold text-green-800">Login</h1>
        <p className="text-sm text-gray-600">
          Please enter your credentials to login.
        </p>
        <hr className="border-gray-300 w-full" />
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<IconMailFilled size={24} className="text-green-800" />}
          onChange={handleEmailChange}
          errorMessage={emailError}
          isAutoComplete={true}
        />
        <div className="flex w-full flex-col items-start justify-center gap-1 px-2">
          <label className="text-sm font-semibold text-gray-700" htmlFor="password">Password</label>
          <div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all focus-within:border-transparent focus-within:ring-1 focus-within:ring-green-800">
            <IconLockFilled size={24} className="shrink-0 text-green-800" />
            <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full flex-1 bg-transparent text-gray-700 outline-none placeholder:text-gray-400" />
            <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800">
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || emailError !== "" || email === "" || password === ""}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green-800 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <IconDoorEnter size={22} /> {isLoading ? "Signing in…" : "Login"}
        </button>
      </form>
    </main>
  );
}
