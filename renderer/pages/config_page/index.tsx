import Head from "next/head";
import React, { useState } from "react";
import { useAtom } from "jotai";
import { GameBoardConfiguration } from "../../types/GameBoardConfiguration";
import { gameBoardConfigurationAtom } from "../../models/GameConfigAtom";
import Link from "next/link";

export default function ConfigPage() {
  const [gameBoardConfiguration, setGameBoardConfiguration] =
    useAtom<GameBoardConfiguration>(gameBoardConfigurationAtom);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameBoardConfiguration((prevConfig) => ({
      ...prevConfig,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Head>
        <title>Game configuration</title>
      </Head>
      <div className="w-full max-w-md p-6 rounded-lg">
        <h1 className="text-3xl mb-6 text-center">Game Configuration</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="numberOfQuestionFields" className="block mb-2">
              Number of Question Fields:
            </label>
            <input
              type="number"
              id="numberOfQuestionFields"
              name="numberOfQuestionFields"
              value={gameBoardConfiguration.numberOfQuestionFields}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfGoodSpecialFields" className="block mb-2">
              Number of Good Special Fields:
            </label>
            <input
              type="number"
              id="numberOfGoodSpecialFields"
              name="numberOfGoodSpecialFields"
              value={gameBoardConfiguration.numberOfGoodSpecialFields}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfBadSpecialFields" className="block mb-2">
              Number of Bad Special Fields:
            </label>
            <input
              type="number"
              id="numberOfBadSpecialFields"
              name="numberOfBadSpecialFields"
              value={gameBoardConfiguration.numberOfBadSpecialFields}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="text-center">
            <Link href="/gameboard">
                <a className="btn-blue">Start Game</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
