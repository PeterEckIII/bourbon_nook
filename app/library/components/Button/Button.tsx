import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  primary: boolean;
  onClick: () => void;
  loading?: boolean;
  loadingText?: string;
  error?: string;
  type: "button" | "submit" | "reset";
}

export default function Button({
  label,
  primary = true,
  loading,
  loadingText,
  error,
  type,
  onClick,
}: ButtonProps) {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={
          primary
            ? "bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            : "bg-gray-200 hover:bg-gray-400 text-gray-700 hover:text-black font-bold py-2 px-4 rounded"
        }
      >
        {loading ? (
          <div className="flex">
            <div>{/* <Spinner /> */}</div>
            <div>{loadingText}</div>
          </div>
        ) : (
          <div>{label}</div>
        )}
      </button>
      {error ? <div className="text-red-500">{error}</div> : null}
    </div>
  );
}
