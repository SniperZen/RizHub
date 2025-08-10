import React from 'react';

interface Kabanata {
    id: number;
    kabanata: string;
    content: string;
}

interface KabanataListProps {
    kabanatas: Kabanata[];
}

const KabanataList: React.FC<KabanataListProps> = ({ kabanatas }) => {
    return (
        <div>
            <ul>
                {kabanatas.map(kabanata => (
                    <li key={kabanata.id}>
                        <h3>{kabanata.kabanata}</h3>
                        <p>{kabanata.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default KabanataList;