import {atom } from "jotai"
import { GameBoardConfiguration } from "../types/GameBoardConfiguration"

export const gameBoardConfigurationAtom = atom<GameBoardConfiguration>(
    {
        numberOfQuestionFields: 14,
        numberOfGoodSpecialFields: 4,
        numberOfBadSpecialFields: 3,
    }
)