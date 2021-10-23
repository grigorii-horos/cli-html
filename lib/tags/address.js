import { blockTag } from "../tag-helpers/blockTag.js";
import ansiColors from "ansi-colors";
const { italic } = ansiColors;

export const address = blockTag((value) => italic(value));
