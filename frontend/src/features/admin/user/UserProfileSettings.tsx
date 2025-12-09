import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import { useMutation } from "@tanstack/react-query";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { useUserStore } from "../../../stores/useUserStore";
import { updateUserPassword, updateUserProfile } from "./userService";

type ProfileForm = {
    name: string;
    email: string;
};

type PasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export function UserProfileSettings() {
    const user = useUserStore((state) => state.user);
    const profileForm = useForm<ProfileForm>({
        defaultValues: {
            name: user?.us_nome || "",
            email: user?.us_mail || "",
        },
    });

    const passwordForm = useForm<PasswordForm>();

    const profileMutation = useMutation({
        mutationFn: (data: ProfileForm) => updateUserProfile(user?.id_user ?? "", data),
    });

    const passwordMutation = useMutation({
        mutationFn: (data: PasswordForm) => {
            const hash = CryptoJS.MD5(data.newPassword.trim().toUpperCase()).toString().toUpperCase();
            return updateUserPassword(user?.id_user ?? "", hash);
        },
    });

    const handleProfileSubmit = (data: ProfileForm) => {
        profileMutation.mutate(data);
    };

    const handlePasswordSubmit = (data: PasswordForm) => {
        if (data.newPassword !== data.confirmPassword) {
            passwordForm.setError("confirmPassword", { message: "Senhas não conferem" });
            return;
        }
        if (!user?.us_smd5) {
            passwordForm.setError("currentPassword", { message: "Usuário sem hash local carregado" });
            return;
        }
        const currentHash = CryptoJS.MD5(data.currentPassword.trim().toUpperCase()).toString().toUpperCase();
        if (currentHash !== user.us_smd5.trim().toUpperCase()) {
            passwordForm.setError("currentPassword", { message: "Senha atual incorreta" });
            return;
        }
        passwordMutation.mutate(data);
    };

    if (!user) {
        return <div className="text-sm text-slate-500">Carregando usuário...</div>;
    }

    return (
        <div className="space-y-8">
            <section className="bg-white rounded-xl shadow p-6 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Dados pessoais</h2>
                    <p className="text-sm text-slate-500">Atualize nome e e-mail do usuário logado.</p>
                </div>

                <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                    <Input label="Usuário" value={user.id_user} readOnly />
                    <Input
                        label="Nome"
                        {...profileForm.register("name", { required: "Nome obrigatório" })}
                        error={profileForm.formState.errors.name?.message}
                    />
                    <Input
                        label="E-mail"
                        type="email"
                        {...profileForm.register("email", {
                            required: "E-mail obrigatório",
                            pattern: { value: /\S+@\S+\.\S+/, message: "E-mail inválido" },
                        })}
                        error={profileForm.formState.errors.email}
                    />
                    <Button type="submit" disabled={profileMutation.isPending}>
                        {profileMutation.isPending ? "Salvando..." : "Salvar dados"}
                    </Button>
                </form>
            </section>

            <section className="bg-white rounded-xl shadow p-6 space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Alterar senha</h2>
                    <p className="text-sm text-slate-500">
                        Valida a senha atual, gera MD5 e envia para o procedimento.
                    </p>
                </div>

                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                    <Input
                        label="Senha atual"
                        type="password"
                        {...passwordForm.register("currentPassword", { required: "Informe a senha atual" })}
                        error={passwordForm.formState.errors.currentPassword?.message}
                    />
                    <Input
                        label="Nova senha"
                        type="password"
                        {...passwordForm.register("newPassword", { required: "Informe a nova senha" })}
                        error={passwordForm.formState.errors.newPassword?.message}
                    />
                    <Input
                        label="Confirmar nova senha"
                        type="password"
                        {...passwordForm.register("confirmPassword", { required: "Confirme a nova senha" })}
                        error={passwordForm.formState.errors.confirmPassword?.message}
                    />
                    <Button type="submit" disabled={passwordMutation.isPending}>
                        {passwordMutation.isPending ? "Alterando..." : "Alterar senha"}
                    </Button>
                </form>
            </section>
        </div>
    );
}
