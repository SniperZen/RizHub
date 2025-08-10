import React from "react";
import BgMusic from "../Pages/BgMusic";

interface StudentLayoutProps {
    children: React.ReactNode;
    pauseMusic?: boolean;
}

export default function StudentLayout({
    children,
    pauseMusic = false
}: StudentLayoutProps) {
    const [music, setMusic] = React.useState(40);

    return (
        <div className="min-h-screen w-full relative">
            <BgMusic volume={music} pause={pauseMusic} />
            {children}
        </div>
    );
}
