import { Chat } from './components/chat';
import { SelectUser } from './components/select-user';
import { useMessages } from './hook/use-messages';

function App() {
  const { messages, isloading } = useMessages();
  return (
    <>
      {!isloading && (
        <div className='container mx-auto'>
          <SelectUser users={[...new Set(messages.map((m) => m.name))]} />
          <Chat messages={messages} />
        </div>
      )}
    </>
  );
}
export default App;
