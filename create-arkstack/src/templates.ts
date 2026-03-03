/*
 * create-h3ravel
 *
 * (c) H3ravel Framework
 *
 * The H3ravel framework and all it's base packages are
 * open-sourced software licensed under the MIT license.
 */

/**
 * List of first party templates
 */
export const templates: {
  name: string;
  alias: "express" | "h3" | "express-lean" | "h3-lean";
  hint: string;
  source: string;
  lean?: boolean;
  baseAlias?: "express" | "h3";
  prereleaseSource?: string;
}[] = [
    {
      name: "Express Starter Kit",
      alias: "express",
      hint: "An Express application starter kit",
      source: "github:toneflix/arkstack",
    },
    {
      name: "Express Lean Starter Kit",
      alias: "express-lean",
      hint: "A minimal Express application starter kit",
      source: "github:toneflix/arkstack",
      lean: true,
      baseAlias: "express",
    },
    {
      name: "H3 Starter Kit",
      alias: "h3",
      hint: "A H3 application starter kit",
      source: "github:toneflix/arkstack",
    },
    {
      name: "H3 Lean Starter Kit",
      alias: "h3-lean",
      hint: "A minimal H3 application starter kit",
      source: "github:toneflix/arkstack",
      lean: true,
      baseAlias: "h3",
    },
  ];

export const dependencyTemplates = {
  "@arkstack/common": "^0.1.4",
  "@arkstack/console": "^0.1.4",
  "@arkstack/contract": "^0.1.4",
  "@arkstack/database": "^0.1.4",
  "@arkstack/driver-express": "^0.1.4"
}