import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import ArtifactPanel from "../components/ArtifactPanel";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { setSessionId } from "../utils/session";
import { setUserData } from "../redux/user.slice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

function Home() {

    const { userData } = useSelector(state => state.user);
    // Accessing the user data from the Redux store
    const dispatch = useDispatch()

    const login = async (token) => {
        try {
            const { data } = await api.post(`/api/auth/login`, { token })
            if (data?.sessionId) {
                setSessionId(data.sessionId)
            }
            dispatch(setUserData(data.user))
        } catch (error) {
            localStorage.removeItem(SESSION_STORAGE_KEY)
            console.log(error)
        }
    }

    const handleGoogleLogin = async () => {
        const result = await signInWithPopup(auth, googleProvider);

        const token = await result.user.getIdToken();
        await login(token)
    };

    return (
        <div className="h-screen flex surface text-white overflow-hidden">
            {/* Root surface uses theme variable for consistent page background */}
            <Sidebar />
            <ChatArea />
            <ArtifactPanel />

            {/* unauthenticated user, show login modal */}
            {!userData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-85 surface-2 border border-white/8 rounded-2xl p-7 flex flex-col gap-5">
                        {/* Login modal surface switched to `surface-2` for legibility */}

                        <div className="flex flex-col gap-1">
                            <h2 className="text-[17px] font-semibold text-slate-100 tracking-tight">Welcome to Orbit</h2>
                            <p className="text-sm text-slate-400">Sign in to continue</p>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 py-2.75 
                            rounded-xl text-sm font-medium text-slate-800 bg-white border border-slate-200
                            hover:bg-slate-100 active:bg-slate-200 shadow-sm transition-all duration-150 
                            cursor-pointer"
                        >
                            <FcGoogle size={15} className="text-white" />
                            Continue with Google
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;