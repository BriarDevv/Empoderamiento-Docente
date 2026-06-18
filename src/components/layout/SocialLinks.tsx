import { siteConfig } from "@/config/site";
import {
  InstagramIcon,
  LinkedinIcon,
  FacebookIcon,
} from "@/components/ui/icons";

// Redes que el sitio puede mostrar. El href sale de siteConfig.redes; mientras
// no haya handle oficial cae a "#" (DESIGN.md / config: no inventar URLs).
const SOCIALS = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

interface SocialLinksProps {
  readonly className?: string;
  readonly iconClassName?: string;
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {SOCIALS.map(({ key, label, Icon }) => {
        const url = siteConfig.redes[key];
        return (
          <a
            key={key}
            href={url ?? "#"}
            aria-label={label}
            {...(url ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className={`text-azul-principal/65 hover:text-azul-medio transition-colors ${iconClassName ?? ""}`}
          >
            <Icon className="h-[1.125rem] w-[1.125rem]" />
          </a>
        );
      })}
    </div>
  );
}
