import type { TopicContent } from "./types";
import { INFORMATIQUE_CONTENT } from "./informatique";
import { MATHS_CONTENT } from "./maths";
import { PHYSIQUE_CONTENT } from "./physique";
import { ELECTRONIQUE_CONTENT } from "./electronique";

export const ALL_CONTENT: TopicContent[] = [
  ...MATHS_CONTENT,
  ...PHYSIQUE_CONTENT,
  ...ELECTRONIQUE_CONTENT,
  ...INFORMATIQUE_CONTENT,
];
