import React from "react";
import { Linkedin, Facebook, Slack, Youtube, Github } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SocialMediaProps {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const socialLink = [
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/",
    icon: <Linkedin className="w-5 h-5" />,
  },
  {
    title: "Youtube",
    href: "https://www.youtube.com/in/r",
    icon: <Youtube className="w-5 h-5" />,
  },
  {
    title: "Github",
    href: "https://github.com/Emmrex1",
    icon: <Github className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com",
    icon: <Facebook className="w-5 h-5" />,
  },
  {
    title: "Slack",
    href: "https://slack.com",
    icon: <Slack className="w-5 h-5" />,
  },
];

const SocialMedia = ({
  className = "",
  iconClassName = "",
  tooltipClassName = "",
}: SocialMediaProps) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLink.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={item.href}
                aria-label={item.title}
                className={cn(
                  "p-2 border rounded-full hover:text-white hover:border-green-500 transition-colors",
                  iconClassName
                )}
              >
                {item.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent className={cn("bg-white text-darkColor font-semibold", tooltipClassName)}>
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
