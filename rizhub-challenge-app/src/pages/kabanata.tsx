import React, { useEffect, useState } from 'react';
import KabanataList from '../components/KabanataList';
import { Kabanata } from '../types/kabanata';
import styles from '../styles/kabanata.module.css';

const KabanataPage: React.FC = () => {
    const [kabanatas, setKabanatas] = useState<Kabanata[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 7;

    useEffect(() => {
        const fetchKabanatas = async () => {
            const response = await fetch('/api/kabanatas'); // Adjust the API endpoint as necessary
            const data = await response.json();
            setKabanatas(data);
        };

        fetchKabanatas();
    }, []);

    const totalPages = Math.ceil(kabanatas.length / itemsPerPage);
    const displayedKabanatas = kabanatas.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    return (
        <div className={styles.kabanataPage}>
            <KabanataList kabanatas={displayedKabanatas} />
            <div className={styles.pagination}>
                <button onClick={handlePreviousPage}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default KabanataPage;