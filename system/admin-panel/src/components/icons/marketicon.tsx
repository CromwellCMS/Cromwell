import React from "react"

export const MarketIcon = (props: React.HTMLAttributes<SVGElement>) => {
  const { className = "", ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-5 h-5 ${className ?? ""}`}
      {...rest}
    >
      <path fill="none" d="M0 0h24v24H0z"></path>
      <path d="M21 13.242V20h1v2H2v-2h1v-6.758A4.496 4.496 0 011 9.5c0-.827.224-1.624.633-2.303L4.345 2.5a1 1 0 01.866-.5H18.79a1 1 0 01.866.5l2.702 4.682A4.496 4.496 0 0121 13.242zm-2 .73a4.496 4.496 0 01-3.75-1.36A4.496 4.496 0 0112 14.001a4.496 4.496 0 01-3.25-1.387A4.496 4.496 0 015 13.973V20h14v-6.027zM5.789 4L3.356 8.213a2.5 2.5 0 004.466 2.216c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 004.644 0c.335-.837 1.52-.837 1.856 0a2.5 2.5 0 104.457-2.232L18.21 4H5.79z"></path>
    </svg>
  )
}