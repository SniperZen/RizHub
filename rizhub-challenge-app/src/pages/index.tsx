import React, { useEffect, useState } from 'react';
import { KabanataList } from '../components/KabanataList';
import { Kabanata } from '../types/kabanata';

const KABANATA_PER_PAGE = 7;

const IndexPage: React.FC = () => {
    const [kabanatas, setKabanatas] = useState<Kabanata[]>([]);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchKabanatas = async () => {
            const response = await fetch('/api/kabanatas'); // Adjust the API endpoint as necessary
            const data = await response.json();
            setKabanatas(data);
        };

        fetchKabanatas();
    }, []);

    const totalPages = Math.ceil(kabanatas.length / KABANATA_PER_PAGE);
    const displayedKabanatas = kabanatas.slice(
        currentPage * KABANATA_PER_PAGE,
        (currentPage + 1) * KABANATA_PER_PAGE
    );

    const handleNextPage = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
    };

    return (
        <div className="kabanata-page">
            <KabanataList kabanatas={displayedKabanatas} />
            <div className="pagination-controls">
                <button onClick={handlePreviousPage}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default IndexPage;