import { FC, HtmlHTMLAttributes } from "react";

export const IconPlus: FC<HtmlHTMLAttributes<SVGSVGElement>> = ({ onClick }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.885863 7.95791C0.88832 7.5437 1.22609 7.20991 1.6403 7.21237L15.1891 7.29273C15.6033 7.29518 15.9371 7.63295 15.9347 8.04716C15.9322 8.46137 15.5944 8.79516 15.1802 8.7927L1.6314 8.71235C1.2172 8.70989 0.883407 8.37212 0.885863 7.95791Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.36563 15.5269C7.95143 15.5245 7.61764 15.1867 7.62009 14.7725L7.70045 1.22365C7.7029 0.809447 8.04068 0.475658 8.45488 0.478114C8.86909 0.480571 9.20288 0.818343 9.20042 1.23255L9.12007 14.7814C9.11761 15.1956 8.77984 15.5294 8.36563 15.5269Z"
      fill="currentColor"
    />
  </svg>
);