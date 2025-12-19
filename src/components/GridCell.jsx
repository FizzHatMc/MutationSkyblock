import React, { useState } from 'react';

export const GridCell = ({ index, isUnlocked, onClick, assignedCrop, isMutationSpot }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={() => onClick(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        w-full aspect-square rounded-sm flex items-center justify-center text-xs font-bold cursor-pointer transition-all border relative select-none
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
            {/* Background Icon / Text */}
            {isMutationSpot && <span className="text-lg">!</span>}

            {!isMutationSpot && assignedCrop && (
                <span className={`text-[9px] uppercase tracking-tighter leading-none text-center transition-opacity duration-150 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {assignedCrop.abbr || assignedCrop.name.slice(0,2)}
        </span>
            )}

            {!isMutationSpot && !assignedCrop && !isUnlocked && 'X'}

            {/* Hover Overlay */}
            {isHovered && assignedCrop && !isMutationSpot && (
                <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center z-50 p-1 animate-in fade-in zoom-in duration-150 rounded-sm border border-slate-600">
             <span className="text-[8px] text-white font-medium leading-tight text-center break-words select-none">
                 {assignedCrop.name}
             </span>
                </div>
            )}

            {/* Tooltip for Locked/Empty */}
            {isHovered && !assignedCrop && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 rounded-sm">
            <span className="text-[8px] text-white/80 select-none">
                {isUnlocked ? 'Open' : 'Lock'}
            </span>
                </div>
            )}
        </div>
    );
};