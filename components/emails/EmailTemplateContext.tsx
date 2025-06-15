import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the EmailTemplateContext
interface EmailTemplateContextType {
  emailTemplate: any; // Replace `any` with the specific type of your email template if available
  setEmailTemplate: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with a default value of `null`
export const EmailTemplateContext = createContext<EmailTemplateContextType | null>(null);

// Custom hook to use the EmailTemplateContext
export const useEmailTemplateContext = () => {
  const context = useContext(EmailTemplateContext);
  if (!context) {
    throw new Error("useEmailTemplateContext must be used within an EmailTemplateContext.Provider");
  }
  return context;
};

// Create the EmailTemplateProvider component
interface EmailTemplateProviderProps {
  children: ReactNode;
}

export const EmailTemplateProvider = ({ children }: EmailTemplateProviderProps) => {
  const [emailTemplate, setEmailTemplate] = useState<any>([]);
  
  return (
    <EmailTemplateContext.Provider value={{ emailTemplate, setEmailTemplate }}>
      {children}
    </EmailTemplateContext.Provider>
  );
};
