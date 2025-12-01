import ProtectedRoute from "../../features/auth/Protectedroute.tsx";
import ExerciseLayout from "./ExerciseLayout.tsx";

const ProtectedExerciseLayout = () => (


    <ProtectedRoute>

        <ExerciseLayout/>

    </ProtectedRoute>


);
export default ProtectedExerciseLayout;