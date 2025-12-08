import React, { useState } from 'react';
interface CharacterCardProps {
    name: string;
    detail: string;
    imgSrc: string;
    compact?: boolean;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, detail, imgSrc, compact = false }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className={`flex flex-col items-center ${compact ? 'w-[120px]' : 'w-[270px]'} gap-3`}>
            <div
                className={`relative shadow p-2 flex flex-col items-center justify-center overflow-hidden ${
                    compact ? 'h-[180px] w-[120px]' : 'h-[350px] w-[270px] border-2'
                }`}
                style={{
                    background: 'radial-gradient(50% 50% at 50% 50%, #5C3407 0%, #C26F0F 100%)',
                    borderColor: '#282725',
                    boxShadow: compact ? '-3px 4px 0px #282725' : '-6px 8px 0px #282725',
                }}
            >
                <img
                    src={imgSrc}
                    alt={name}
                    className={`mx-auto mb-2 object-contain transition-all duration-300 ${hovered && !compact ? 'blur-sm' : ''} ${
                        compact ? 'h-[150px]' : 'h-[358px]'
                    }`}
                />
                {/* Details overlay - only show on non-compact mode or on mobile tap */}
                {!compact && (
                    <div
                        className={`
                            absolute left-0 w-full px-4
                            transition-all duration-300
                            ${hovered
                                ? 'top-1/2 -translate-y-1/2 opacity-100 pointer-events-auto'
                                : 'top-full opacity-0 pointer-events-none'}
                        `}
                        style={{
                            zIndex: 2,
                        }}
                    >
                        <div className="bg-[#282725]/90 text-[#F4F2EC] rounded-lg p-3 shadow-lg font-['Inter'] text-[16px]">
                            {detail}
                        </div>
                    </div>
                )}
            </div>
            <p
                className={`font-semibold font-['Inter'] text-[#F4F2EC] cursor-pointer select-none ${
                    compact ? 'text-sm w-[120px] h-[30px]' : 'font-medium text-[22px] w-[270px] h-[35px]'
                }`}
                style={{
                    background: '#FD5901',
                    borderColor: '#282725',
                    boxShadow: compact ? '-3px 4px 0px #282725' : '-6px 8px 0px #282725',
                }}
                onMouseEnter={() => !compact && setHovered(true)}
                onMouseLeave={() => !compact && setHovered(false)}
                onClick={() => compact && setHovered(!hovered)}
            >
                {name}
            </p>
            {compact && hovered && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:hidden">
                    <div className="bg-[#282725] text-[#F4F2EC] rounded-lg p-4 max-w-sm">
                        <h3 className="font-bold text-lg mb-2">{name}</h3>
                        <p className="text-sm">{detail}</p>
                        <button 
                            className="mt-4 bg-[#FD5901] text-white px-4 py-2 rounded"
                            onClick={() => setHovered(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterCard;