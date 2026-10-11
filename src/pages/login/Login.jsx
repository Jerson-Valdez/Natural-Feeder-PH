//components
import PrimaryButton from "../../components/buttons/PrimaryButton";
import InputField from "../../components/input/InputField";
import { toast } from "sonner";

//hook
import { useState } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//icon
import {
  IconMailFilled,
  IconLockFilled,
  IconDoorEnter,
} from "@tabler/icons-react";
import logo from "../../assets/Logo.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  return (
    <main className="page-container login-page">
      <div className="flex flex-col items-center justify-center gap-4 shadow-2xl rounded-2xl p-8 w-full max-w-md bg-white/80 border border-gray-200">
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
        <InputField
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<IconLockFilled size={24} className="text-green-800" />}
          onChange={(e) => setPassword(e.target.value)}
        />
        <PrimaryButton
          text="Login"
          icon={<IconDoorEnter size={24} className="text-white" />}
          action={handleLogin}
          isDisabled={emailError !== "" || email === "" || password === ""}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
