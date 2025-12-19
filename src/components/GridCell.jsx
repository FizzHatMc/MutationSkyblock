import React from 'react';

export const GridCell = ({ index, isUnlocked, onClick, assignedCrop, isMutationSpot }) => {
  return (
    <div 
      onClick={() => onClick(index)}
      className={`
        w-full aspect-square rounded-sm flex items-center justify-center text-xs font-bold cursor-pointer transition-all border relative overflow-hidden select-none
        ${isMutationSpot ? 'ring-inset ring-4 ring-purple-500 z-20 shadow-xl bg-purple-900 text-purple-100' : ''}
        ${!isMutationSpot && assignedCrop ? `${assignedCrop.color} ${assignedCrop.text} ring-1 ring-black/10` : ''}
        ${!isMutationSpot && !assignedCrop && isUnlocked 
          ? 'bg-emerald-500/20 border-emerald-500 hover:bg-emerald-500/40 text-emerald-100' 
          : ''}
        ${!isUnlocked
          ? 'bg-red-500/20 border-red-500 hover:bg-red-500/40 text-red-100'
          : ''}
      `}
    >
      {isMutationSpot && <span className="text-lg">!</span>}
      
      {!isMutationSpot && assignedCrop && (
        <span className="text-[9px] uppercase tracking-tighter leading-none text-center">
          {assignedCrop.abbr || assignedCrop.name.slice(0,2)}
        </span>
      )}
      
      {!isMutationSpot && !assignedCrop && !isUnlocked && 'X'}
    </div>
  );
};
