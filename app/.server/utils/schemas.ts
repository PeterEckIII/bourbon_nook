import { z } from "zod";

export const bottleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, `Please provide a meaningful name`)
    .max(
      50,
      `Name is too long to store. Please try abbreviating anything you can (e.g. "Single Barrel Barrel Proof" -->  "SiB BP")`
    ),
  type: z
    .string()
    .trim()
    .min(2, `Please provide a meaningful type to organize by`)
    .max(40, `Type is too long, please try abbreviating`),
  status: z.enum(["OPENED", "SEALED", "FINISHED"]),
  distillery: z
    .string()
    .trim()
    .min(3, `Please provide a meaningful distillery name`)
    .max(65, `Please try abbreviating a few things`),
  country: z
    .string()
    .trim()
    .min(2, `Please provide at least a 2-digit country code`)
    .max(40),
  region: z
    .string()
    .trim()
    .min(2, `Please provide at least a two character state / region code`)
    .max(50),
  price: z
    .string()
    .trim()
    // .regex(/?!(\$|£|€|¥|₽|CA|CA\$|\$CA|\$AUS|AUS|\$|\$AU|AU\$)/g)
    .min(1, `Please provide a price`)
    .max(10, `Please keep your price under 10 characters`),
  age: z
    .string()
    .trim()
    .min(
      1,
      `Please provide an age, or NAS to indicate there is no age statement`
    )
    .max(25, `Please keep this field brief (under 25 characters)`),
  alcoholPercent: z
    .string()
    .trim()
    // .regex(/?!%/g)
    .min(2, `Please provide at least a two-digit number`)
    .max(
      5,
      `Please keep your number (including decimals) to 5 characters (e.g. 49.50 / 49.5)`
    ),
  barrel: z
    .string()
    .trim()
    .min(3, `If there is no barrel information please enter "N/A"`)
    .max(35, `Please keep this field brief (under 35 characters)`),
  year: z
    .string()
    .trim()
    .min(4, `Please enter a four-digit year (2018)`)
    .max(4, `Please enter a four-digit year (2018)`),
  finishing: z
    .string()
    .trim()
    .min(3, `Please enter "N/A" if there is no finish`)
    .max(50, `Please try to abbreviate this section`),
});
