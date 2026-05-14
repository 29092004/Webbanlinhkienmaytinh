import { Link } from "react-router-dom";

export function AuthSwitch({ text, linkText, to }) {
  return (
    <p className="text-center text-[16px] font-medium text-[#2c313b]">
      {text}{" "}
      <Link to={to} className="font-extrabold text-[#07111f] hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
