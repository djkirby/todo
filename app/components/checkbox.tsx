import { InputHTMLAttributes } from "react";

export default function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <>
      <input
        type="checkbox"
        {...props}
        className={`relative peer mx-2 appearance-none border border-black h-3 w-3 checked:bg-black disabled:bg-gray-500 ${
          props.className ?? ""
        }`}
      />
      <svg
        className="absolute text-white left-2 top-[6px] w-3 h-3 hidden peer-checked:block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </>
  );
}
