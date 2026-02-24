import { minLength, object, pipe, string, InferInput } from 'valibot';

export const messageSchema = object({
  chatID: pipe(string(), minLength(1)),
  text: pipe(string(), minLength(1)),
  userID: pipe(string(), minLength(1)),
});
export type Messages = InferInput<typeof messageSchema>;

export type MessagesRequest = Messages & {
  id: string;
  createAt: string;
};
