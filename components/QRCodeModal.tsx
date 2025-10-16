import React from 'react';

interface QRCodeModalProps {
    inviteUrl: string;
    communityName: string;
    onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ inviteUrl, communityName, onClose }) => {
    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl p-6 text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Scan to Join</h2>
                <p className="text-sm text-gray-600 mb-4 font-semibold">{communityName}</p>
                <img
                    src={qrCodeApiUrl}
                    alt={`QR Code for ${communityName}`}
                    className="w-48 h-48 mx-auto rounded-lg"
                />
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default QRCodeModal;