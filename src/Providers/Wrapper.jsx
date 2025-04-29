import { Wagmi } from './Wagmi';
import { ConnectKitProvider } from "connectkit";

const Wrapper = ({ children }) => {
    return (
        <>
            <Wagmi>
            <ConnectKitProvider>
                {children}            
            </ConnectKitProvider>        
            </Wagmi>
        </>
    );
};

export default Wrapper;