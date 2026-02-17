"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import Image from "next/image";
import Link from "next/link";
import authAnimation from "../../../../public/lottie/auth-animation.json";
import googleIcon from "../../../../public/icons/google.svg";
import Swal from "sweetalert2";
import { useAuth } from "@/components/Auth/AuthContext";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const { login } = useAuth();
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
    },
  });
  const handleLogin = async (values: typeof form.values) => {
    const result = await login({
      email: values.email,
      password: values.password,
      remember: values.remember,
    });

    if (!result.ok) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.message || "An error occurred during login.",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Welcome back",
      text: "You are now signed in.",
    });
    router.push("/");
  };
  return (
    <Box className="py-24">
      <Box className="max-w-7xl flex flex-col mx-auto px-4">
        <p className="uppercase font-russo-one text-4xl tracking-widest">
          sign in
        </p>
        <Box className="flex gap-10 pt-5">
          <Box className="w-2/6 h-125 items-center justify-center hidden md:flex">
            <Lottie animationData={authAnimation} loop={true} />
          </Box>
          <form
            className="flex-1"
            onSubmit={form.onSubmit(handleLogin)}
            action="#"
          >
            <Paper radius="lg" shadow="lg" className="bg-transparent! p-10!">
              <Text className="mt-2 font-sn-pro text-sm uppercase tracking-widest">
                Sign in to continue
              </Text>
              <Box className="grid gap-4 mt-6">
                <TextInput
                  label="Email"
                  placeholder="john.doe@example.com"
                  required
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  {...form.getInputProps("password")}
                />
                <Box className="w-full flex items-center justify-end">
                  <Link
                    href="#"
                    className="text-xs font-semibold font-sn-pro uppercase tracking-widest text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Box className="flex items-center justify-between">
                  <Checkbox
                    label="Remember me"
                    {...form.getInputProps("remember", { type: "checkbox" })}
                  />
                </Box>
              </Box>
              <Button
                rightSection={<ArrowRight size={16} />}
                type="submit"
                className="mt-6 bg-black! rounded-full! font-sn-pro! uppercase! tracking-widest!"
                fullWidth
              >
                Sign In
              </Button>
              <Divider
                my="xl"
                label="Or continue with"
                labelPosition="center"
              />
              <Box className="w-full flex items-center justify-between">
                <button className="bg-black! rounded-full! p-2">
                  <Image
                    src={googleIcon}
                    alt="Google Icon"
                    width={16}
                    height={16}
                  />
                </button>
                <Link
                  href="/sign-up"
                  className="text-sm font-semibold font-sn-pro uppercase tracking-widest text-blue-400 hover:underline"
                >
                  Create account
                </Link>
              </Box>
            </Paper>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
export default SignIn;
