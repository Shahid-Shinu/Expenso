import { useNavigate } from "react-router-dom";

export const NoUser = () => {
    const navigate = useNavigate();
    return <div className="flex items-center justify-center h-[80vh] font-bold text-lg"><span className="cursor-pointer" onClick={() => navigate('/login')}>Please Login</span></div>
}