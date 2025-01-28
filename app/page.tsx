"use client";

import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { LivenessQuickStartReact } from "./components/LivenessQuickStartReact";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);
export default function App() {
  return (
    <main className="m-4 p-2 flex flex-col items-center justify-center h-screen gap-2">
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1 className="font-bold">
              Hello {user?.username || user?.userId}
            </h1>
            <LivenessQuickStartReact />

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={signOut}
            >
              Sign out
            </button>
          </main>
        )}
      </Authenticator>
    </main>
  );
}
