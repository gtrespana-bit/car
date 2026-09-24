import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CalculatorView from './components/CalculatorView';
import PipelineView from './components/PipelineView';
import ReliabilityGuideView from './components/ReliabilityGuideView';
import GuideView from './components/GuideView';
import ContractsView from './components/ContractsView';
import Phase2RoadmapView from './components/Phase2RoadmapView';
import { INITIAL_VEHICLES } from './data/initialData';
import { Car, MapPin, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'coruna_autoimport_vehicles_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCar, setSelectedCar] = useState(null);

  // Load vehicles from localStorage or use initial 3 pilot vehicles
  const [vehicles, setVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
    return INITIAL_VEHICLES;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [vehicles]);

  // Handlers
  const handleAddVehicle = (newCar) => {
    setVehicles(prev => [newCar, ...prev]);
  };

  const handleUpdateVehicle = (updatedCar) => {
    setVehicles(prev => prev.map(c => c.id === updatedCar.id ? updatedCar : c));
  };

  const handleDeleteVehicle = (carId) => {
    if (window.confirm("¿Seguro que deseas eliminar este vehículo de la lista?")) {
      setVehicles(prev => prev.filter(c => c.id !== carId));
      if (selectedCar && selectedCar.id === carId) {
        setSelectedCar(null);
      }
    }
  };

  const handleResetData = () => {
    if (window.confirm("¿Restablecer los datos originales de los 3 vehículos piloto de ejemplo?")) {
      setVehicles(INITIAL_VEHICLES);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('importauto_completed_steps');
      setSelectedCar(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        vehicles={vehicles}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            vehicles={vehicles} 
            setActiveTab={setActiveTab}
            onSelectCar={(car) => setSelectedCar(car)}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorView 
            onAddVehicleToPipeline={handleAddVehicle} 
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineView 
            vehicles={vehicles}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onAddVehicle={handleAddVehicle}
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'reliability' && (
          <ReliabilityGuideView />
        )}

        {activeTab === 'guide' && (
          <GuideView />
        )}

        {activeTab === 'contracts' && (
          <ContractsView vehicles={vehicles} />
        )}

        {activeTab === 'phase2' && (
          <Phase2RoadmapView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              <Car className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white">Coruña AutoImport</span>
            <span>— Sistema de Importación Europea & Venta en A Coruña, Galicia</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>A Coruña • Arteixo • Espíritu Santo</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cumplimiento Legal AEAT, DGT & Código Civil</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
