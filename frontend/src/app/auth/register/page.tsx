import React from "react";
import { RegisterForm } from "./_components";

const RegisterPage = () => {
  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
