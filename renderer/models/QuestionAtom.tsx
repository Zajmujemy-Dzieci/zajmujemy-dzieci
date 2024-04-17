import { atom } from "jotai";
import { Question } from "./Question";

export const questionAtom = atom<Question | null>(null);
