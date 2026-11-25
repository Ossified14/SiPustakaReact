// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi - SiPustaka" />

            {status && (
                <div className="mb-4 text-center text-xs font-medium text-emerald-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                                    Alamat Email Terdaftar
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="nama@email.com"
                                    className="rounded-xl border-slate-200 text-xs focus:border-blue-500"
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-4 flex items-center justify-start">
                                <Button
                                    className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                    )}
                                    Kirim Tautan Pemulihan Kata Sandi
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
                    <span>Ingat kata sandi Anda? </span>
                    <TextLink href={login()} className="font-bold text-blue-600 hover:text-blue-700">
                        Kembali ke halaman masuk
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Pemulihan Kata Sandi',
    description: 'Masukkan alamat email Anda untuk menerima instruksi pemulihan kata sandi',
};
