import React, { useEffect, useState } from "react";
import { AiOutlineBug } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button/Button";
import { Form } from "../../components/common/Form/Form";
import { FormInput } from "../../components/common/FormInput/FormInput";
import { useUserLoginMutation } from "../../features/auth/userAuthApi";
import { setTitle } from "../../utils/setTitle";
import { toast } from "react-hot-toast";
import { Error } from "../../components/ui/Error";
import axios from 'axios';

export const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [{ isLoading, isSuccess, error: resError }] =
    useUserLoginMutation();

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast.success("Login Successfull");
      navigate("/home");
    }
    if (!isLoading && !isSuccess && resError) {
        setError(resError.data?.message);
        console.log(resError)
    }
  }, [isLoading, isSuccess, navigate, resError]);

  //user Login Handler
  const userLoginHandler = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      // Send a POST request to the Strapi login interface
      const response = await axios.post('https://vivid-bloom-0edc0dd8df.strapiapp.com/api/auth/local', {
        identifier: email, // Strapi requires the 'identifier' field, which can be a username or email address
        password: password,
      });
  
      // Store JWT to localStorage for subsequent request authentication
      localStorage.setItem('jwt', response.data.jwt);
      localStorage.setItem('user', JSON.stringify(response.data.user));
  
      toast.success("Login Successful");
      navigate("/home");
    } catch (error) {
      // deal with error
      setError("Login Failed");
      console.log(error);
    }
  };

  //set page title
  setTitle("User Login");
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="mx-2 sm:mx-0 sm:w-[350px] bg-slate-100 px-2 py-4 rounded-md">
        <div className="flex flex-col items-center justify-center pb-4">
          <span className="text-green-600 text-5xl pb-1">
            <AiOutlineBug />
          </span>
          <h3 className="text-2xl font-semibold">Login Your Account</h3>
        </div>
        <Form onSubmit={userLoginHandler}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            placeholder="your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button name="Login" className="w-full" />
              </Form>
              {error !== "" && <Error error={error} />}
      </div>
    </div>
  );
};
