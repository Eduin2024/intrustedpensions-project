import { format } from "date-fns";

export const formatDate = (date: string) => {
  try {
    return format(new Date(date), "dd-MM-yyyy");
  } catch {
    return date;
  }
};

export const validateDate = (date: string) => {
  const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  return regex.test(date);
};

export const formatCurrency = (amount: number | string) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(num);
};

export const parseCurrency = (value: string) => {
  return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

export const formatPhoneNumber = (number: string) => {
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, "");
  // Format as +44 XXXX XXXXXX
  return cleaned.replace(/(\d{2})(\d{4})(\d{6})/, "+$1 $2 $3");
};

export const formatMobileNumber = (number: string) => {
  // Remove all non-digit characters
  const cleaned = number.replace(/\D/g, "");
  // Format as XXXX XXXXXX
  return cleaned.replace(/(\d{4})(\d{6})/, "$1 $2");
}; 