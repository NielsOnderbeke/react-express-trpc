import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

interface ChatMessage {
    user: string;
    message: string;
}

const messages: ChatMessage[] = [
    { user: "user1", message: "Hello" },
    { user: "user2", message: "Hi" },
];

const appRouter = trpc
    .router()
    .query("hello", {
        resolve() {
            return "Hello world III";
        },
    })
    .query("getMessages", {
        input: z.number().default(10),
        resolve({ input }) {
            return messages.slice(-input);
        },
    })
    .mutation("addMessage", {
        input: z.object({
            user: z.string().min(1),
            message: z.string().min(1),
        }),
        resolve({ input }) {
            const { user, message } = input

            messages.push({ user, message });
            return input;
        },
    });

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: () => null,
    })
);

app.get("/", (req, res) => {
    res.send("Hello from todo-backend express");
});

app.listen(port, () => {
    console.log(`🐸 todo-backend listening at http://localhost:${port}`);
});
