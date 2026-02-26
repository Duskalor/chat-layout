import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const { Pool } = pg;

const TEST_PASSWORD = 'test123';
const BCRYPT_ROUNDS = 10;

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface ChatData {
  name: string;
  isGroup: boolean;
  participantIds: string[];
}

interface MessageData {
  text: string;
  chatId: string;
  senderId: string;
}

interface TodoData {
  title: string;
  completed: boolean;
  userId: string;
}

let prisma: PrismaClient;

async function initPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

async function clearData() {
  console.log('Clearing existing data...');
  await prisma.message.deleteMany();
  await prisma.lastMessage.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
  console.log('Existing data cleared.');
}

async function seedUsers(): Promise<string[]> {
  console.log('Seeding users...');

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, BCRYPT_ROUNDS);

  const users: UserData[] = [
    { name: 'Alice Johnson', email: 'alice@example.com', password: passwordHash },
    { name: 'Bob Smith', email: 'bob@example.com', password: passwordHash },
    { name: 'Charlie Brown', email: 'charlie@example.com', password: passwordHash },
    { name: 'Diana Prince', email: 'diana@example.com', password: passwordHash },
    { name: 'Edward Norton', email: 'edward@example.com', password: passwordHash },
    { name: 'Fiona Apple', email: 'fiona@example.com', password: passwordHash },
  ];

  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  console.log(`Created ${createdUsers.length} users.`);
  return createdUsers.map((u) => u.id);
}

async function seedChats(userIds: string[]): Promise<string[]> {
  console.log('Seeding chats...');

  const chats: ChatData[] = [
    { name: 'Alice & Bob', isGroup: false, participantIds: [userIds[0], userIds[1]] },
    { name: 'Charlie & Diana', isGroup: false, participantIds: [userIds[2], userIds[3]] },
    { name: 'Alice & Fiona', isGroup: false, participantIds: [userIds[0], userIds[5]] },
    { name: 'Team Alpha', isGroup: true, participantIds: [userIds[0], userIds[1], userIds[2]] },
    { name: 'Project Beta', isGroup: true, participantIds: [userIds[3], userIds[4], userIds[5], userIds[0]] },
  ];

  const createdChats = await Promise.all(
    chats.map((chat) =>
      prisma.chat.create({
        data: {
          name: chat.name,
          isGroup: chat.isGroup,
          participants: {
            connect: chat.participantIds.map((id) => ({ id })),
          },
        },
      })
    )
  );

  console.log(`Created ${createdChats.length} chats.`);
  return createdChats.map((c) => c.id);
}

function getRandomDateInRange(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedMessages(chatIds: string[], userIds: string[]): Promise<void> {
  console.log('Seeding messages...');

  const personalChatMessages = [
    ['Hey Bob! How are you?', 'Hi Alice! I\'m doing great, thanks!', 'What are you up to this weekend?', 'Thinking of going hiking. Want to join?', 'That sounds fun! Maybe I\'ll tag along.', 'Perfect! Let me know what time.', 'Sure thing! Saturday morning?', 'Works for me!'],
    ['Hi Diana!', 'Hey Charlie! What\'s up?', 'Not much, just working on a project.', 'Oh cool, what kind of project?', 'It\'s a web app for task management.', 'Nice! Let me know if you need help.', 'Will do! Thanks Diana!', 'Anytime!'],
    ['Hey Fiona!', 'Alice! How have you been?', 'I\'ve been good! Busy with work.', 'Same here. Any plans for tonight?', 'Maybe Netflix and chill 😄', 'Haha count me in!', 'Great! I\'ll send you the show details.', 'Can\'t wait!'],
  ];

  const groupChatMessages = [
    ['Good morning team!', 'Morning Alice!', 'Anyone ready for the standup?', 'I am!', 'Great, let\'s meet in 10 minutes.', 'On my way.', 'Same here.', 'Perfect, see you all there.'],
    ['Welcome to Project Beta!', 'Thanks Diana! Excited to be here.', 'So what\'s the plan for this week?', 'We need to finalize the design first.', 'Agreed. Edward, can you prep the docs?', 'Sure thing, I\'ll have them ready by EOD.', 'Awesome! Let\'s sync tomorrow.', 'Sounds good.'],
  ];

  const allMessages: string[][] = [...personalChatMessages, ...groupChatMessages];

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  let messageIndex = 0;
  for (let i = 0; i < chatIds.length; i++) {
    const chatId = chatIds[i];
    const messages = allMessages[i];
    const senderIndex = i % userIds.length;

    for (let j = 0; j < messages.length; j++) {
      const senderId = userIds[(senderIndex + j) % userIds.length];
      const createdAt = getRandomDateInRange(weekAgo, now);

      await prisma.message.create({
        data: {
          text: messages[j],
          chatId,
          senderId,
          createdAt,
        },
      });
      messageIndex++;
    }
  }

  console.log(`Created ${messageIndex} messages.`);
}

async function seedTodos(userIds: string[]): Promise<void> {
  console.log('Seeding todos...');

  const todos: TodoData[] = [
    { title: 'Buy groceries', completed: false, userId: userIds[0] },
    { title: 'Complete project report', completed: true, userId: userIds[1] },
    { title: 'Call dentist', completed: false, userId: userIds[2] },
    { title: 'Review PR #42', completed: true, userId: userIds[3] },
    { title: 'Plan team meeting', completed: false, userId: userIds[1] },
  ];

  await Promise.all(
    todos.map((todo) =>
      prisma.todo.create({
        data: todo,
      })
    )
  );

  console.log(`Created ${todos.length} todos.`);
}

async function main() {
  console.log('Starting seed script...');

  prisma = await initPrisma();

  try {
    await clearData();

    const userIds = await seedUsers();
    const chatIds = await seedChats(userIds);
    await seedMessages(chatIds, userIds);
    await seedTodos(userIds);

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
