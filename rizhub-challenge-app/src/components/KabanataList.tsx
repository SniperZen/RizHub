import React from 'react';
import KabanataItem from './KabanataItem';
import styles from '../styles/kabanata.module.css';

interface Kabanata {
    id: number;
    title: string;
    content: string;
}

interface KabanataListProps {
    kabanatas: Kabanata[];
}

const KabanataList: React.FC<KabanataListProps> = ({ kabanatas }) => {
    return (
        <div className={styles.kabanataList}>
            {kabanatas.map(kabanata => (
                <KabanataItem key={kabanata.id} kabanata={kabanata} />
            ))}
        </div>
    );
};

export default KabanataList;