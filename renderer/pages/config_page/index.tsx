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
              Liczba pól z pytaniami:
            </label>
            <input
              type="number"
              id="numberOfQuestionFields"
              name="numberOfQuestionFields"
              value={gameBoardConfiguration.numberOfQuestionFields}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfGoodSpecialFields" className="block mb-2">
              Liczba pól specjalnych dobrych:
            </label>
            <input
              type="number"
              id="numberOfGoodSpecialFields"
              name="numberOfGoodSpecialFields"
              value={gameBoardConfiguration.numberOfGoodSpecialFields}
              onChange={handleInputChange}
              min="0"
              max={
                gameBoardConfiguration.numberOfQuestionFields -
                gameBoardConfiguration.numberOfBadSpecialFields
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfBadSpecialFields" className="block mb-2">
              Liczba pól specjalnych złych:
            </label>
            <input
              type="number"
              id="numberOfBadSpecialFields"
              name="numberOfBadSpecialFields"
              value={gameBoardConfiguration.numberOfBadSpecialFields}
              onChange={handleInputChange}
              min="0"
              max={
                gameBoardConfiguration.numberOfQuestionFields -
                gameBoardConfiguration.numberOfGoodSpecialFields
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="text-center">
            <Link href="/loader">
              <a className="btn-blue mx-4">Wróć</a>
            </Link>
            <Link href="/QRcode_page">
              <a className="btn-blue mx-4">Przejdź dalej</a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
