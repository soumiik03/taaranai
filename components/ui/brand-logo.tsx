import React from "react";

interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function BrandLogo({ size = 32, className = "", ...props }: BrandLogoProps) {
  return (
    <svg
      fill="none"
      height={size}
      width={Math.round((31 / 48) * size)}
      viewBox="0 0 31 48"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g fill="currentColor">
        <path d="m0 17.8433 30.9054-17.8433-.8189 12.6994-26.32053 15.1961z" />
        <path d="m3.76562 27.8951 21.73568-12.5492-.8189 12.6994-17.15081 9.902z" opacity=".5" />
        <path d="m7.5293 37.9477 12.566-7.255-.8189 12.6994-7.9811 4.6079z" opacity=".25" />
      </g>
    </svg>
  );
}
