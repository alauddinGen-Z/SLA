import { useEffect, useState } from 'react';
import { initializePaddle, type Paddle } from '@paddle/paddle-js';
import { DollarSign, Loader2 } from 'lucide-react';

interface PaddlePayButtonProps {
    amount: number;
    email: string;
    claimId: string;
}

export default function PaddlePayButton({ amount, email, claimId }: PaddlePayButtonProps) {
    const [paddle, setPaddle] = useState<Paddle | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initPaddle = async () => {
            const clientToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

            if (!clientToken) {
                console.error('VITE_PADDLE_CLIENT_TOKEN not set');
                return;
            }

            try {
                const paddleInstance = await initializePaddle({
                    environment: 'sandbox',
                    token: clientToken,
                });

                if (paddleInstance) {
                    setPaddle(paddleInstance);
                }
            } catch (error) {
                console.error('Failed to initialize Paddle:', error);
            }
        };

        initPaddle();
    }, []);

    const handlePayment = () => {
        if (!paddle) {
            console.error('Paddle not initialized');
            return;
        }

        setLoading(true);

        paddle.Checkout.open({
            items: [
                {
                    priceId: 'pri_01kb17kb1zf6wck0ve5ajwcjmv', // SLA Claim Commission - $10.00 USD
                    quantity: 1,
                },
            ],
            customer: {
                email: email,
            },
            customData: {
                claimId: claimId,
                amount: amount.toString(),
            },
            settings: {
                displayMode: 'overlay',
                theme: 'dark',
                locale: 'en',
            },
        });

        setLoading(false);
    };

    return (
        <button
            onClick={handlePayment}
            disabled={!paddle || loading}
            className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all flex items-center gap-2"
        >
            {loading ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                </>
            ) : (
                <>
                    <DollarSign size={16} />
                    Pay ${amount.toFixed(2)}
                </>
            )}
        </button>
    );
}
