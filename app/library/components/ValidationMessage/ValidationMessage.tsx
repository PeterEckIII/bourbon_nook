import { useEffect, useState } from "react";

interface ValidationMessageProps {
  isSubmitting: boolean;
  error?: string | string[];
}

export default function ValidationMessage({
  isSubmitting,
  error,
}: ValidationMessageProps) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });
    return () => clearTimeout(id);
  }, [error, isSubmitting]);
  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        height: show ? "1rem" : 0,
        color: "red",
        transition: "all 300ms ease-in-out",
      }}
    >
      <span className="text-red-500">{error}</span>
    </div>
  );
}
