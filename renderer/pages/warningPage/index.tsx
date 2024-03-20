import React from 'react';

interface WarningPageProps {
  handleReturnToPreviousPage: () => void; 
}

const WarningPage: React.FC<WarningPageProps> = ({ handleReturnToPreviousPage }) => {
  const handleReturn = (): void => {
    handleReturnToPreviousPage(); 
  };

  return (
    <div className="warning-page p-8 flex flex-col items-center justify-center h-screen">
      <div className="warning-message bg-white rounded-lg p-4 mb-8 text-center">
        <span className="text-black font-bold text-lg" style={{ color: "#301A4B" }}>
          Twoje zmiany konfiguracji nie zostały zapisane. Czy jesteś pewien, że chcesz wrócić do poprzedniej strony?
        </span>
      </div>

      <div className="warning-buttons flex">
        <button
          className="text-white font-bold py-2 px-4 rounded mr-4"
          onClick={handleReturn} 
          // Tutaj bedzie przejście do strony z listą pytań, ale na razie daje handleReturn bo nie mam tej strony jeszcze
          style={{ backgroundColor: '#F39A9D', color: 'white' }}>
          Tak
        </button>
        <button
          className="text-white font-bold py-2 px-4 rounded"
          onClick={handleReturn}
          style={{ backgroundColor: '#F39A9D', color: 'white' }}>
          Nie
        </button>
      </div>
    </div>
  );
};

export default WarningPage;
