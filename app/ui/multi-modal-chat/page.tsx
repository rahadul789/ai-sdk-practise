"use client";

import { Button } from "@/components/ui/button";
import { useChat, useCompletion } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";
import { useRef, useState } from "react";

export default function MultiModalChatPage() {
  const [input, setInput] = useState("");
  const [files, setFIles] = useState<FileList | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input, files: files });
    setInput("");
    setFIles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="file-upload">
            {files?.length
              ? `${files.length} file(s) attatched`
              : `Attach files`}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setFIles(e.target.files);
              }
            }}
            multiple
            ref={fileInputRef} // we can clear the input proggrametically later
          />
        </div>
        <div>
          <input
            placeholder="How can I help you"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          {status === "submitted" || status === "streaming" ? (
            <Button onClick={stop}>Stop</Button>
          ) : (
            <Button disabled={status !== "ready"}>Send</Button>
          )}
        </div>
      </form>
      {error && <p>{error.message}</p>}
      {(status === "submitted" || status === "streaming") && <p>Loading...</p>}
      {messages.map((message) => (
        <div key={message.id}>
          <div>{message.role === "user" ? "You:" : "AI:"}</div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${index}}`}>{part.text}</div>;
              case "file":
                if (part.mediaType?.startsWith("image/")) {
                  return (
                    <div className=" bg-accent">
                      <Image
                        key={`${message.id}-${index}`}
                        src={part.url}
                        alt={part.filename ?? `attachment-${index}`}
                        width={500}
                        height={500}
                      />
                    </div>
                  );
                }
                if (part.mediaType?.startsWith("application/pdf")) {
                  return (
                    <div className=" p-4 bg-accent">
                      <iframe
                        key={`${message.id}- ${index}`}
                        src={part.url}
                        width="500"
                        height="600"
                        title={part.filename ?? `attachment-${index}`}
                      />
                    </div>
                  );
                }
                return null;
              default:
                return null;
            }
          })}
        </div>
      ))}
    </div>
  );
}
