import React from 'react';
import { FaStethoscope } from 'react-icons/fa'; // Importar o ícone de estetoscópio

const SystemVetLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <FaStethoscope className="h-6 w-6 text-white" />
      <h1 className="text-2xl font-extrabold text-white">SystemVet</h1>
    </div>
  );
};

export default SystemVetLogo;