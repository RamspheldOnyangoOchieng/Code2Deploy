import { Link } from 'react-router-dom';
import Layout from '../components/layout';

const PaymentCancel = () => {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
                    {/* Cancel Icon */}
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-ban text-4xl text-yellow-600"></i>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
                    <p className="text-gray-600 mb-6">
                        You've cancelled the payment. Don't worry, no charges were made to your account.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <h3 className="font-semibold text-gray-700 mb-2">What happened?</h3>
                        <p className="text-sm text-gray-600">
                            You were redirected back before completing the payment on PayPal.
                            Your order is still saved and you can complete the payment anytime.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/programs"
                            className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Back to Programs
                        </Link>
                        <Link
                            to="/contact"
                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Need Help?
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentCancel;
