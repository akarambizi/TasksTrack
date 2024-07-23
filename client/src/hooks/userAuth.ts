import { registerUser } from "@/api";
import { useMutation } from "react-query";

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: (userData: { email: string; password: string }) => registerUser(userData)
    });
};
