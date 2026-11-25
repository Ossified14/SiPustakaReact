import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import PasskeyVerify from '@/components/passkey-verify';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi - SiPustaka" />

            <PasskeyVerify
                routes={{
                    options: confirmOptions(),
                    submit: confirmStore(),
                }}
                label="Konfirmasi dengan Passkey"
                loadingLabel="Memverifikasi..."
                separator="Atau konfirmasi dengan kata sandi"
            />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                                Kata Sandi
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Masukkan kata sandi Anda"
                                autoComplete="current-password"
                                className="rounded-xl border-slate-200 text-xs focus:border-blue-500"
                                autoFocus
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Konfirmasi Kata Sandi
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi Akses Keamanan',
    description:
        'Halaman ini memerlukan verifikasi identitas. Silakan konfirmasi kata sandi Anda untuk melanjutkan.',
};
