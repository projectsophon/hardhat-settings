import { DecoderType, object, string } from "decoders";

export type Person = DecoderType<typeof person>;

export const person = object({
  firstName: string,
  lastName: string,
});

export const bar = string;
