// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi Email - SiPustaka" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-xs font-medium text-emerald-600">
                    Tautan verifikasi baru telah dikirimkan ke alamat email yang Anda daftarkan.
                </div>
            )}

            <Form {...send.form()} className="space-y-4 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                        >
                            {processing && <Spinner className="mr-2" />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <div className="pt-2">
                            <TextLink
                                href={logout()}
                                className="mx-auto block text-xs text-slate-500 hover:text-slate-700"
                            >
                                Keluar dari Akun
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Alamat Email',
    description:
        'Terima kasih telah mendaftar. Silakan periksa kotak masuk email Anda dan klik tautan verifikasi untuk mengaktifkan akun perpustakaan Anda.',
};
