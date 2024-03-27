import {atom } from "jotai"
import { Player } from "../types/Player"

export const playersQueueAtom = atom<Player[]>([])