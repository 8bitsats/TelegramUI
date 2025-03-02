import React, { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';
import {
  Button,
  Card,
  Container,
  Header,
  Tab,
  TabList,
  Text,
  TokenAmount,
  TokenIcon,
} from '@telegram-apps/telegram-ui';

interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  liquidity: number;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    
    // Fetch initial data from bot
    fetchTokenData();
  }, []);

  const fetchTokenData = async () => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getTokens`);
      const data = await response.json();
      setTokens(data.tokens);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  return (
    <Container>
      <Header>
        <Text size="xl" weight={700}>${balance}</Text>
        <Text size="sm" color="secondary">1D $0.00 (+0%)</Text>
      </Header>

      <div className="action-buttons">
        <Button
          size="lg"
          icon="↑"
          onClick={() => WebApp.sendData(JSON.stringify({ action: 'send' }))}
        >
          Send
        </Button>
        <Button
          size="lg"
          icon="↓"
          onClick={() => WebApp.sendData(JSON.stringify({ action: 'receive' }))}
        >
          Receive
        </Button>
        <Button
          size="lg"
          icon="⏱"
          onClick={() => WebApp.sendData(JSON.stringify({ action: 'orders' }))}
        >
          Orders
        </Button>
        <Button
          size="lg"
          icon="⋯"
          onClick={() => WebApp.sendData(JSON.stringify({ action: 'more' }))}
        >
          More
        </Button>
      </div>

      <TabList>
        <Tab
          active={activeTab === 'assets'}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </Tab>
        <Tab
          active={activeTab === 'transactions'}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Tab>
      </TabList>

      <div className="token-list">
        {tokens.length === 0 ? (
          <Card>
            <Text align="center">No Tokens</Text>
            <Text size="sm" color="secondary" align="center">
              Add tokens via "Receive"
            </Text>
          </Card>
        ) : (
          tokens.map((token) => (
            <Card
              key={token.symbol}
              onClick={() => WebApp.sendData(JSON.stringify({
                action: 'viewToken',
                symbol: token.symbol
              }))}
            >
              <div className="token-row">
                <TokenIcon symbol={token.symbol} size="md" />
                <div className="token-info">
                  <Text weight={500}>{token.symbol}</Text>
                  <Text size="sm" color="secondary">
                    Liquidity ${token.liquidity.toLocaleString()}
                  </Text>
                </div>
                <div className="token-price">
                  <Text weight={500}>${token.price.toFixed(4)}</Text>
                  <Text
                    size="sm"
                    color={token.change24h >= 0 ? 'success' : 'error'}
                  >
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </Text>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
};

export default App;
