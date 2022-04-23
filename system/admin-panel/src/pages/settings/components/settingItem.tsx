import React from "react"
import { Link } from "react-router-dom";

export 
const SettingItem = ({
  onClick,
  href,
  title,
  description,
  warning,
  children,
  className = "",
  icon,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  href?: string;
  title?: string;
  description?: string;
  warning?: string;
  children?: any;
  className?: string;
  icon?: any;
}) => {
  const Wrapper = onClick
    ? ({ children }) => (
        <div
          onClick={onClick}
          className="cursor-pointer flex flex-row transform transition-all gap-2 group">
          {children}
        </div>
      )
    : ({ children }) => (
        <Link
          to={href}
          className="flex flex-row transform transition-all gap-2 group">
          {children}
        </Link>
      );

  return (
    <Wrapper>
      <div className={`rounded-lg flex bg-gray-200 shadow-inner text-center p-2 text-indigo-400 w-12 col-span-1 aspect-square group-hover:bg-indigo-100 group-hover:text-indigo-600 ${className ?? ""}`}>
        {icon}
      </div>
      <div className="col-span-3">
        <p className="font-bold text-gray-700 group-hover:text-indigo-500">
          {title}
        </p>
        <p className="text-xs text-gray-400 group-hover:text-gray-700">
          {description}
        </p>
        <p className="text-xs text-transparent group-hover:text-red-400">
          {warning}
        </p>
      </div>
    </Wrapper>
  );
};
