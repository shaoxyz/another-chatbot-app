import React from "react";
import { cn } from "@/lib/utils";
// import { ExternalLink } from "@/components/external-link";
function getUpdateTime() {
  console.log("build: " + process.env.NEXT_PUBLIC_BUILD_TIME!);
  const date = new Date(process.env.NEXT_PUBLIC_BUILD_TIME!);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}

export function Footer({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "flex flex-col flex-grow fixed-bottom px-2 text-center text-xs text-gray-500 leading-normal m-3",
        className
      )}
      {...props}
    >
      {/* <ExternalLink href="https://6pen.art">6pen</ExternalLink> */}
      <a>不要掉入爱情的陷阱</a>
      {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 6)}
      {/* <a>最近更新于:{getUpdateTime()}</a> */}
    </p>
  );
}
