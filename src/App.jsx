import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sprout, TreeDeciduous, LayoutGrid, Info, CheckCircle2, XCircle, Calculator, BoxSelect } from 'lucide-react';
import INITIAL_DATA from './data/mutations.json';
import { runSolver } from './utils/mutationSolver';
import { GridCell } from './components/GridCell';
import { RecipeTree } from './components/RecipeTree';

export default function App() {
  const [gridState, setGridState] = useState(() => {
    const arr = Array(100).fill(false);
    // Default pattern 4x3
    const defaults = [33, 34, 35, 36, 43, 44, 45, 46, 53, 54, 55, 56];
    defaults.forEach(idx => arr[idx] = true);
    return arr;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMutation, setSelectedMutation] = useState(null);
  const [optimizedLayout, setOptimizedLayout] = useState({}); 
  const [mutationSpots, setMutationSpots] = useState([]); 
  const [isComputing, setIsComputing] = useState(false);

  const filteredMutations = useMemo(() => {
    if (!searchTerm) return INITIAL_DATA.filter(i => i.type === 'mutation');
    return INITIAL_DATA.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      item.type === 'mutation'
    );
  }, [searchTerm]);

  const toggleGridCell = (index) => {
    const newGrid = [...gridState];
    newGrid[index] = !newGrid[index];
    setGridState(newGrid);
  };

  // Solver Trigger
  useEffect(() => {
    if (!selectedMutation) {
      setOptimizedLayout({});
      setMutationSpots([]);
      return;
    }

    setIsComputing(true);
    // Use timeout to allow UI to show loading state
    const timer = setTimeout(() => {
        const result = runSolver(selectedMutation, gridState);
        setMutationSpots(result.spots);
        setOptimizedLayout(result.layout);
        setIsComputing(false);
    }, 10);
    return () => clearTimeout(timer);

  }, [gridState, selectedMutation]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
      
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Sprout className="text-green-400 w-6 h-6" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Skyblock Garden Mutator
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* LEFT SIDE */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4" /> Search Mutations
            </h2>
            <input 
              type="text"
              placeholder="e.g. Scourroot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
            <div className="mt-4 max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredMutations.map(mut => (
                <button
                  key={mut.id}
                  onClick={() => setSelectedMutation(mut)}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                    selectedMutation?.id === mut.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${mut.color}`}></div>
                  <div className="flex flex-col items-start">
                    <span>{mut.name}</span>
                    <span className="text-[10px] text-slate-400">Size: {mut.size || 1}x{mut.size || 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
             <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Optimized Layout
                </h2>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Open</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Locked</span>
                </div>
             </div>
             
             <div className={`aspect-square w-full grid grid-cols-10 gap-1 p-2 bg-slate-900 rounded-lg border border-slate-700/50 relative ${isComputing ? 'opacity-50' : ''}`}>
               {gridState.map((isUnlocked, idx) => (
                 <GridCell 
                    key={idx} 
                    index={idx} 
                    isUnlocked={isUnlocked} 
                    onClick={toggleGridCell}
                    assignedCrop={optimizedLayout[idx]}
                    isMutationSpot={mutationSpots.includes(idx)}
                 />
               ))}
               {isComputing && (
                   <div className="absolute inset-0 flex items-center justify-center">
                       <span className="bg-black/50 text-white px-3 py-1 rounded text-xs">Computing...</span>
                   </div>
               )}
             </div>
             <p className="text-xs text-slate-500 mt-2 text-center">
               <span className="text-purple-400 font-bold">(!)</span> = Mutation Area. <br/>
               Running Exact Logic Solver...
             </p>
          </div>
        </aside>

        {/* RIGHT SIDE */}
        <section className="lg:col-span-8 space-y-6">
          {selectedMutation ? (
            <>
              <div className="bg-slate-800 border-l-4 border-blue-500 rounded-xl p-6 shadow-lg flex justify-between items-start">
                <div>
                   <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                     <div className={`w-4 h-4 rounded-full ${selectedMutation.color}`}></div>
                     {selectedMutation.name}
                   </h2>
                   <div className="flex gap-4 text-slate-400 text-sm">
                      <span>Selected Mutation</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <BoxSelect className="w-3 h-3" /> Size: {selectedMutation.size || 1}x{selectedMutation.size || 1}
                      </span>
                   </div>
                </div>
                {mutationSpots.length > 0 ? (
                  <div className="flex items-center gap-2 text-purple-400 bg-purple-400/10 px-3 py-1 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> 
                    {mutationSpots.length / ((selectedMutation.size||1)**2)} Found
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-sm font-medium">
                    <XCircle className="w-4 h-4" /> No spots possible
                  </div>
                )}
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                 <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">
                   Optimization Guide
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
                   <div>
                     <p className="mb-2">The layout on the left shows exactly what to plant:</p>
                     <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-400">
                        {INITIAL_DATA.filter(d => d.type === 'base').map(crop => (
                            <li key={crop.id}><span className="font-bold text-slate-200">{crop.abbr}</span> = {crop.name}</li>
                        ))}
                     </ul>
                   </div>
                   <div className="bg-slate-900/50 p-4 rounded border border-slate-700/50">
                      <p className="font-semibold text-blue-400 mb-2">Algorithm Logic:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-400">
                        <li>Supports <b>{selectedMutation.size || 1}x{selectedMutation.size || 1}</b> area.</li>
                        <li><b>Exact Backtracking:</b> Checks every possible combination to guarantee max output.</li>
                        <li><b>Smart Filler:</b> Places ingredients at shared intersections first.</li>
                      </ul>
                   </div>
                 </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg overflow-x-auto">
                <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <TreeDeciduous className="w-4 h-4" /> Mutation Tree
                </h3>
                <div className="min-w-[300px] flex justify-center py-4">
                  <RecipeTree mutationId={selectedMutation.id} allData={INITIAL_DATA} />
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl min-h-[400px]">
              <Info className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a mutation</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
