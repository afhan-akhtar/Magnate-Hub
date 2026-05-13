import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

const Choose9: React.FC<IconProps> = ({
  title = "Choose3 Icon",
  width = 60,
  height = 60,
  className,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width={width}
    height={height}
    viewBox="0 0 100 100"
    role={title ? "img" : "presentation"}
    aria-label={title}
    className={className}
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    <defs>
      <linearGradient id="a">
        <stop offset=".184" stopColor="#29abe2" />
        <stop offset=".821" stopColor="#6200d2" />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="b"
        x1="16.165"
        x2="95.418"
        y1="-3.142"
        y2="77.356"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient
        xlinkHref="#a"
        id="c"
        x1="13.102"
        x2="92.355"
        y1="-.126"
        y2="80.371"
        gradientUnits="userSpaceOnUse"
      />
      <linearGradient
        xlinkHref="#a"
        id="d"
        x1="-15.644"
        x2="63.609"
        y1="28.175"
        y2="108.673"
        gradientUnits="userSpaceOnUse"
      />
    </defs>
    <path
      fill="url(#b)"
      d="M76.33 39.246c-10.322 0-18.722 8.4-18.722 18.722s8.4 18.722 18.721 18.722 18.722-8.4 18.722-18.722-8.4-18.722-18.722-18.722zm6.951 23.235h-2.439v2.439c0 2.485-2.012 4.513-4.513 4.513s-4.512-2.013-4.512-4.513v-2.44h-2.44c-2.485 0-4.512-2.012-4.512-4.512s2.012-4.513 4.512-4.513h2.44v-2.44c0-2.484 2.012-4.512 4.512-4.512s4.513 2.013 4.513 4.513v2.44h2.44c2.484 0 4.512 2.012 4.512 4.512s-2.012 4.513-4.513 4.513z"
    />
    <path
      fill="url(#c)"
      d="M38.902 52.392c-4.111 0-8.223-1.572-11.499-4.7-6.093-5.832-11.744-16.2-10.614-26.208.295-2.62.967-6.077 3.587-9.582 4.44-5.946 11.155-9.386 18.411-9.402 7.404 0 14.103 3.39 18.64 9.386 2.637 3.538 3.309 6.994 3.604 9.598v.082c.966 10.139-4.636 20.442-10.614 26.142-3.276 3.128-7.388 4.684-11.499 4.684z"
    />
    <path
      fill="url(#d)"
      d="M52.272 57.968v-.019c.001-1.054-.769-1.958-1.82-2.03a24.006 24.006 0 0 0-1.626-.055H28.961a24.434 24.434 0 0 0-13.447 4.01C8.898 64.219 4.95 71.903 4.95 80.424v2.974c0 7.775 6.327 14.102 14.118 14.102H58.75c7.765 0 14.118-6.353 14.118-14.118 0-.923-.64-1.73-1.543-1.922-10.859-2.315-19.04-11.958-19.04-23.507z"
    />
  </svg>
);

export default Choose9;
