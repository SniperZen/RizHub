import React, { useState } from 'react';

interface CharacterCardProps {
    name: string;
    detail: string;
    imgSrc: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ name, detail, imgSrc}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className='flex flex-col items-center w-[270px] gap-3'>
            <div
                className="relative shadow p-4 flex flex-col items-center justify-center border-2 h-[350px] w-[270px] overflow-hidden"
                style={{
                    background: 'radial-gradient(50% 50% at 50% 50%, #5C3407 0%, #C26F0F 100%)',
                    borderColor: '#282725',
                    boxShadow: '-6px 8px 0px #282725',
                }}
            >
                <img
                    src={imgSrc}
                    alt={name}
                    className={`mx-auto mb-2 h-[358px] object-contain transition-all duration-300 ${hovered ? 'blur-sm' : ''}`}
                />
                {/* Details overlay */}
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
            </div>
            <p
                className="font-semibold font-['Inter'] font-medium text-[22px] text-[#F4F2EC] w-[270px] h-[35px] cursor-pointer select-none"
                style={{
                    background: '#FD5901',
                    borderColor: '#282725',
                    boxShadow: '-6px 8px 0px #282725',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {name}
            </p>
        </div>
    );
};

export default CharacterCard;