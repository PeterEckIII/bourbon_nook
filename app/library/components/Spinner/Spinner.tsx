interface SpinnerProps {
  loading: boolean;
}

export default function Spinner({ loading }: SpinnerProps) {
  return (
    <div
      className={`items-center justify-center flex rounded-full w-14 h-14 bg-gradient-to-tr from-indigo-500 to-pink-500 ${
        loading ? "animate-spin" : ""
      }`}
    >
      <div className="h-9 w-9 rounded-full bg-gray-200"></div>
    </div>
  );
}
