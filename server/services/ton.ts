import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal, Address } from "@ton/ton";

const TONCENTER_API = "https://toncenter.com/api/v2";

let cachedWallet: WalletContractV4 | null = null;
let cachedClient: TonClient | null = null;

async function getWallet() {
  if (cachedWallet) return cachedWallet;

  const seedPhrase = process.env.TON_WALLET_SEED;
  if (!seedPhrase) {
    throw new Error("TON_WALLET_SEED environment variable not set");
  }

  const keyPair = await mnemonicToPrivateKey(seedPhrase.split(" "));
  const workchain = 0;
  const wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
  
  cachedWallet = wallet;
  return wallet;
}

function getClient() {
  if (cachedClient) return cachedClient;
  
  cachedClient = new TonClient({
    endpoint: TONCENTER_API,
  });
  
  return cachedClient;
}

export async function sendTON(toAddress: string, amount: number): Promise<string> {
  try {
    const seedPhrase = process.env.TON_WALLET_SEED;
    if (!seedPhrase) {
      throw new Error("TON_WALLET_SEED not configured");
    }

    const client = getClient();
    const wallet = await getWallet();
    const keyPair = await mnemonicToPrivateKey(seedPhrase.split(" "));

    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    const transfer = await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: String(Math.floor(amount * 1e9)),
          to: Address.parse(toAddress),
          bounce: false,
        }),
      ],
    });

    return transfer.toString();
  } catch (error) {
    console.error("Error sending TON:", error);
    throw new Error(`Failed to send TON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface Transaction {
  hash: string;
  in_msg?: {
    source?: string;
    destination?: string;
    value?: string;
  };
  out_msgs?: Array<{
    source?: string;
    destination?: string;
    value?: string;
  }>;
}

export async function getIncomingTransactions(address: string, limit: number = 10): Promise<Array<{
  hash: string;
  from: string;
  amount: number;
  timestamp: number;
}>> {
  try {
    const response = await fetch(
      `${TONCENTER_API}/getTransactions?address=${address}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.ok || !data.result) {
      throw new Error("Invalid response from TON API");
    }

    const transactions: Transaction[] = data.result;
    const incoming = [];

    for (const tx of transactions) {
      if (tx.in_msg?.source && tx.in_msg?.value) {
        const amount = parseInt(tx.in_msg.value) / 1e9;
        if (amount > 0) {
          incoming.push({
            hash: tx.hash,
            from: tx.in_msg.source,
            amount,
            timestamp: Date.now(),
          });
        }
      }
    }

    return incoming;
  } catch (error) {
    console.error("Error fetching incoming transactions:", error);
    return [];
  }
}

export async function getCasinoWalletAddress(): Promise<string> {
  const address = process.env.VITE_CASINO_WALLET_ADDRESS;
  if (!address) {
    throw new Error("VITE_CASINO_WALLET_ADDRESS not configured");
  }
  return address;
}
