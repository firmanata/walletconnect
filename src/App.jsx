import {
    useAppKit,
    useAppKitAccount,
    useAppKitNetwork,
    useDisconnect,
} from "@reown/appkit/react";
import React, { useState } from "react";
import { ethers } from "ethers";
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [selectedToken, setSelectedToken] = useState("USDC");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [amount, setAmount] = useState("");
    const { open  } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { chainId, caipNetwork } = useAppKitNetwork();
    const { disconnect } = useDisconnect();
    const [loading, setLoading] = useState(false);

    const tokenAddresses = {
        USDC: {
            mainnet: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            polygon: 'N/A',
            sepolia: '0x65aFADD39029741B3b8f0756952C74678c9cEC93'
        },
        ETH: {
            mainnet: 'Native',
            polygon: 'N/A',
            sepolia: 'Native'
        },
        AndiToken: {
            mainnet: 'N/A',
            polygon: 'N/A',
            sepolia: '0xd6d26c350c2b25A43f4F92471e79D3C6A7d9Ee8E'
        },
    };

    const handleConnect = async () => {
        try {
            await open(); // Opens the wallet connection modal
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const handleSwitchNetwork = async () => {
        await open({view: "Networks"});
    };

    const handleSendToken = async () => {
        if (!isConnected || !address) {
            toast.warn("Please connect your wallet first");
            return;
        }
    
        if (!recipientAddress || !amount) {
            toast.warn("Please fill in all fields");
            return;
        }
    
        setLoading(true);
        try {
            console.log("Sending token:", {
                from: address,
                token: selectedToken,
                recipient: recipientAddress,
                amount: amount,
                chainId: chainId,
            });
    
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
    
            const currentNetwork = caipNetwork.name.toLowerCase(); // 'mainnet', 'polygon', 'sepolia'
            const tokenAddress = tokenAddresses[selectedToken][currentNetwork];
    
            if (!tokenAddress || tokenAddress === 'N/A') {
                toast.warn(`${selectedToken} not available on ${currentNetwork}`);
                return;
            }
    
            if (tokenAddress === 'Native') {
                // Native ETH transfer
                const tx = await signer.sendTransaction({
                    to: recipientAddress,
                    value: ethers.parseEther(amount)
                });
                await tx.wait();
            } else {
                // ERC-20 token transfer
                const ERC20_ABI = [
                    "function transfer(address to, uint256 amount) public returns (bool)"
                  ];
                  
                  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
                  const decimals = selectedToken === 'USDC' ? 6 : 18;
                  const parsedAmount = ethers.parseUnits(amount, decimals);
                  
                  const tx = await tokenContract.transfer(recipientAddress, parsedAmount);
                  await tx.wait();                  
            }
    
            toast.success(`Successfully sent ${amount} ${selectedToken} to ${recipientAddress}`);
    
            // Reset form
            setRecipientAddress("");
            setAmount("");
    
        } catch (error) {
            console.error("Transaction error:", error);
            toast.error("Transaction failed: " + (error?.reason || error.message));
        } finally {
            setLoading(false);
        }
    };    
    
    return (
        <div className="wallet-container">
            <ToastContainer />
            <h2 className="wallet-title">POC Self Custody Wallet</h2>

            {!isConnected ? (
                <button className="connect-button" onClick={handleConnect}>
                    Connect Wallet
                </button>
            ) : (
                <button className="connect-button" onClick={handleDisconnect}>
                    Disconnect Wallet
                </button>
            )}

            <button
                className="network-button"
                onClick={handleSwitchNetwork}
                disabled={loading}
            >
                {loading ? "Switching..." : "Switch Network"}
            </button>

            <p className="connection-status">
                {!isConnected
                    ? "Not Connected"
                    : `Connected as: ${address?.slice(0, 6)}...${address?.slice(
                          -4
                      )}`}
            </p>

            {isConnected && (
                <p className="current-network">
                    Current Network: {caipNetwork.name}
                </p>
            )}

            <div className="form-group">
                <label>Select Token</label>
                <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="token-select"
                >
                    <option value="USDC">USDC</option>
                    <option value="ETH">ETH</option>
                    <option value="AndiToken">AndiToken</option>
                </select>
            </div>

            <div className="form-group">
                <label>Recipient Address</label>
                <input
                    type="text"
                    placeholder="0x..."
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="address-input"
                />
            </div>

            <div className="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    placeholder="e.g. 10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="amount-input"
                />
            </div>

            <button
                className="send-button"
                onClick={handleSendToken}
                disabled={loading}
            >
                {loading ? "Sending..." : "Send Token"}
            </button>
        </div>
    );
};

export default App;
