import React from 'react';
import { Kabanata } from '../types/kabanata';

interface KabanataItemProps {
    kabanata: Kabanata;
}

const KabanataItem: React.FC<KabanataItemProps> = ({ kabanata }) => {
    return (
        <div className="kabanata-item">
            <h3>{kabanata.title}</h3>
            <p>{kabanata.content}</p>
        </div>
    );
};

export default KabanataItem;