import React from 'react';

export const RecipeTree = ({ mutationId, allData, depth = 0 }) => {
  const item = allData.find(d => d.id === mutationId);
  if (!item) return null;
  const isBase = item.type === 'base';

  return (
    <div className="flex flex-col items-center">
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm mb-2
        ${depth === 0 ? 'bg-slate-700 border-slate-500' : 'bg-slate-800 border-slate-700 scale-90'}
      `}>
        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
        <div className="flex flex-col">
            <span className="font-medium text-slate-100">{item.name}</span>
            <span className="text-[10px] text-slate-400">Size: {item.size || 1}x{item.size || 1}</span>
        </div>
      </div>
      
      {!isBase && item.requirements && (
        <div className="flex flex-col items-center relative">
          <div className="h-4 w-px bg-slate-600 mb-2"></div>
          <div className="flex gap-4 items-start relative flex-wrap justify-center px-4">
             {item.requirements.length > 1 && (
               <div className="absolute top-0 left-1/4 right-1/4 h-px bg-slate-600 -translate-y-2"></div>
             )}
            {item.requirements.map((req, idx) => (
              <div key={idx} className="flex flex-col items-center mx-1">
                <div className="text-xs text-slate-400 mb-1 font-mono bg-slate-900/50 px-2 rounded">{req.amount}x</div>
                <RecipeTree mutationId={req.id} allData={allData} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
