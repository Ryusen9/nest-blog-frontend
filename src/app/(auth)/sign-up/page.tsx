"use client";
import {
  Box,
  Button,
  Divider,
  Fieldset,
  FileInput,
  PasswordInput,
  Popover,
  Progress,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ArrowRight, Check, Image as ImageIcon, X } from "lucide-react";
import authAnimation from "../../../../public/lottie/auth-animation.json";
import Lottie from "lottie-react";
import { useState } from "react";
import Image from "next/image";
import googleIcon from "../../../../public/icons/google.svg";
import Link from "next/link";
import Swal from "sweetalert2";
import axios from "axios";

const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      component="div"
      c={meets ? "teal" : "red"}
      style={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <Check size={14} /> : <X size={14} />}
      <Box component="span" ml={10}>
        {label}
      </Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const SignUp = () => {
  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      profilePicture: null as File | null,
      password: "",
      confirmPassword: "",
    },
    validate: {
      firstName: (value) =>
        value.trim().length >= 2
          ? null
          : "First name must be at least 2 characters",
      lastName: (value) =>
        value.trim().length >= 2
          ? null
          : "Last name must be at least 2 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      bio: (value) =>
        value.trim().length >= 10
          ? null
          : "Bio should be at least 10 characters",
      profilePicture: (value) => (value ? null : "Profile picture is required"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordValue = form.values.password;
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(passwordValue)}
    />
  ));

  const strength = getStrength(passwordValue);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const passwordsMatch =
    form.values.password.length > 0 &&
    form.values.confirmPassword.length > 0 &&
    form.values.password === form.values.confirmPassword;

  const uploadToImgbb = async (file: File) => {
    if (!imgbbKey) {
      throw new Error("Missing Imgbb API key");
    }

    const imageData = new FormData();
    imageData.append("key", imgbbKey);
    imageData.append("image", file);

    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data?.data?.url as string | undefined;
  };
  return (
    <Box className="py-24">
      <Box className="max-w-7xl flex flex-col mx-auto px-4">
        <p className="uppercase font-russo-one text-4xl tracking-widest">
          sign up
        </p>
        <Box className="flex gap-10 pt-5">
          <Box className="w-2/6 h-125 items-center justify-center hidden md:flex">
            <Lottie animationData={authAnimation} loop={true} />
          </Box>
          <form
            action="#"
            className="flex-1"
            onSubmit={form.onSubmit(async (values) => {
              if (values.password !== values.confirmPassword) {
                form.setFieldError("confirmPassword", "Passwords do not match");
                return;
              }

              if (!values.profilePicture) {
                form.setFieldError(
                  "profilePicture",
                  "Profile picture is required",
                );
                return;
              }

              if (!imgbbKey) {
                Swal.fire({
                  icon: "error",
                  title: "Missing Imgbb API key",
                  text: "Add NEXT_PUBLIC_IMGBB_API_KEY to your environment.",
                });
                return;
              }

              setIsSubmitting(true);
              try {
                const avatarUrl = await uploadToImgbb(values.profilePicture);
                if (!avatarUrl) {
                  throw new Error("Imgbb upload failed");
                }

                await axios.post("http://localhost:8000/user", {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  bio: values.bio,
                  password: values.password,
                  avatarUrl,
                  role: "reader",
                });
                Swal.fire({
                  icon: "success",
                  title: "Account created",
                  text: "Your account has been created successfully.",
                });
                form.reset();
              } catch (error) {
                Swal.fire({
                  icon: "error",
                  title: "Sign up failed",
                  text: "Please try again in a moment.",
                });
              } finally {
                setIsSubmitting(false);
              }
            })}
          >
            <Fieldset
              legend="Personal Information"
              className="bg-transparent! grid! grid-cols-1! md:grid-cols-2! gap-5! border-black!"
            >
              <TextInput
                label="First Name"
                placeholder="John"
                required
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                required
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="Email"
                placeholder="john.doe@example.com"
                required
                {...form.getInputProps("email")}
              />
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself..."
                minRows={3}
                required
                {...form.getInputProps("bio")}
              />
              <FileInput
                clearable
                accept="image/png,image/jpeg"
                radius="xl"
                label="Profile Picture"
                placeholder="Upload your profile picture"
                className="md:col-span-2 max-w-93"
                value={form.values.profilePicture}
                onChange={(file) => form.setFieldValue("profilePicture", file)}
                error={form.errors.profilePicture}
                required
                rightSection={<ImageIcon size={16} />}
              />
            </Fieldset>

            <Fieldset
              legend="Password"
              className="bg-transparent! mt-5! border-black! grid! grid-cols-1! md:grid-cols-2 gap-5!"
            >
              <Box>
                <Popover
                  opened={popoverOpened}
                  position="bottom"
                  width="target"
                  transitionProps={{ transition: "pop" }}
                >
                  <Popover.Target>
                    <div
                      onFocusCapture={() => setPopoverOpened(true)}
                      onBlurCapture={() => setPopoverOpened(false)}
                    >
                      <PasswordInput
                        withAsterisk
                        label="Your password"
                        placeholder="Your password"
                        {...form.getInputProps("password")}
                      />
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Progress color={color} value={strength} size={5} mb="xs" />
                    <PasswordRequirement
                      label="Includes at least 6 characters"
                      meets={passwordValue.length > 5}
                    />
                    {checks}
                  </Popover.Dropdown>
                </Popover>
              </Box>

              <PasswordInput
                withAsterisk
                label="Re-enter password"
                placeholder="Re-enter password"
                {...form.getInputProps("confirmPassword")}
              />
            </Fieldset>
            <Box className="w-full flex items-center justify-end">
              <Button
                rightSection={<ArrowRight size={16} />}
                type="submit"
                disabled={!passwordsMatch || isSubmitting}
                loading={isSubmitting}
                className="mt-5 bg-black! rounded-full! font-sn-pro! uppercase! tracking-widest!"
              >
                Create Account
              </Button>
            </Box>
            <Divider
              my="xl"
              label="Already have an account?"
              labelPosition="center"
            />
            <Box className="w-full flex flex-col md:flex-row items-center justify-between">
              <Box className="text-sm font-sn-pro uppercase tracking-widest">
                <p>Sign in using </p>
                <Box className="mt-3">
                  <button className="bg-black! rounded-full! p-2">
                    <Image
                      src={googleIcon}
                      alt="Google Icon"
                      width={16}
                      height={16}
                    />
                  </button>
                </Box>
              </Box>
              <Box>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold font-sn-pro uppercase tracking-widest text-blue-400 hover:underline"
                >
                  Or sign in using email
                </Link>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
export default SignUp;
