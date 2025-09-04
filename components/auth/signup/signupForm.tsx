"use client";
import ThemeInput from "@/components/ui/themeInput";
import ThemeButton from "@/components/ui/button";

interface SignupFormProps {
  role: "tester" | "developer";
  onSubmit?: (formData: Record<string, string>) => void;
}

// 👇 Central config for both roles
const formConfig = {
  tester: [
    { label: "Full Name", placeholder: "Enter your full name", type: "text", name: "fullName" },
    { label: "Email", placeholder: "Enter your email", type: "email", name: "email" },
    { label: "Password", placeholder: "Enter your password", type: "password", name: "password" },
    { label: "Confirm Password", placeholder: "Confirm your password", type: "password", name: "confirmPassword" },
  ],
  developer: [
    { label: "Full Name", placeholder: "Enter your full name", type: "text", name: "fullName" },
    { label: "GitHub", placeholder: "Enter your GitHub username", type: "text", name: "github" },
    { label: "Email", placeholder: "Enter your email", type: "email", name: "email" },
    { label: "Password", placeholder: "Enter your password", type: "password", name: "password" },
  ],
};

export default function SignupForm({ role, onSubmit }: SignupFormProps) {
  const inputs = formConfig[role];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    onSubmit?.(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {inputs.map((field, index) => (
        <ThemeInput
          key={index}
          label={field.label}
          placeHolder={field.placeholder}
          type={field.type}
          variant="transparent"
        />
      ))}

      <ThemeButton variant="primary" type="submit">
        Signup
      </ThemeButton>


    </form>
  );
}
