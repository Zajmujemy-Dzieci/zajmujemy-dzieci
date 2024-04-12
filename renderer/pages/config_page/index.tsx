import Head from "next/head";
import React from "react";
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
      <div className="w-full max-w-lg p-6 rounded-lg">
        <h1 className="text-6xl mb-6 text-center">Konfiguracja Gry</h1>
        <form className="text-3xl">
          <div className="mb-4">
            <label htmlFor="numberOfQuestionFields" className="block mb-2">
              Łączna liczba pól:
            </label>
            <div className="flex justify-evenly items-center">
              <div>
                <input type="radio" id="option30" name="numberOfQuestionFields" value="14" defaultChecked onChange={handleInputChange}/>
                <label>30</label>
              </div>
              <div>
                <input type="radio" id="option28" name="numberOfQuestionFields" value="13" onChange={handleInputChange}/>
                <label>28</label>
              </div>
              <div>
                <input type="radio" id="option26" name="numberOfQuestionFields" value="12" onChange={handleInputChange}/>
                <label>26</label>
              </div>
            </div>
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
                Math.max(0, 
                  gameBoardConfiguration.numberOfQuestionFields -
                  gameBoardConfiguration.numberOfBadSpecialFields)
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
                Math.max(0, 
                  gameBoardConfiguration.numberOfQuestionFields -
                  gameBoardConfiguration.numberOfGoodSpecialFields)
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="text-center p-3">
            <Link href="/loader">
              <a className="btn-blue mx-4">Wróć</a>
            </Link>
            <Link href="/QRcode_page">
              {/* This ugly beast below is the thing that must stay as the "useState" didn't work properly here */}
              <a className={`btn-blue mx-4 ${!(gameBoardConfiguration.numberOfBadSpecialFields >= 0 && gameBoardConfiguration.numberOfGoodSpecialFields >= 0 && gameBoardConfiguration.numberOfBadSpecialFields + gameBoardConfiguration.numberOfGoodSpecialFields <= gameBoardConfiguration.numberOfQuestionFields) ? 'pointer-events-none opacity-50' : ''}`}>
                Przejdź dalej
              </a>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
