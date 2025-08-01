export const templates: Record<
  string,
  {
    name: string;
    repo: string;
    logo: string | { light: string; dark: string };
  }
> = {
  nextjs: {
    name: "Next.js",
    repo: "https://github.com/freestyle-sh/freestyle-base-nextjs-shadcn",
    logo: {
      light: "/logos/next.svg",
      dark: "/logos/nextjs-light.svg",
    },
  },
  "vite-react": {
    name: "Vite (React)",
    repo: "https://github.com/freestyle-sh/freestyle-base-vite-react-typescript-swc",
    logo: "/logos/vite.svg",
  },
  expo: {
    name: "Expo",
    repo: "https://github.com/freestyle-sh/freestyle-expo",
    logo: {
      light: "/logos/expo.svg",
      dark: "/logos/icons8-expo.svg",
    },
  },
};
