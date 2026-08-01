import { useState } from "react";
import { Send, Paperclip, Square, Zap, MessageSquare, Code2, Presentation, Image as ImageIcon, Globe, FileText, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setArtifacts, setIsLoading } from "../redux/messageSlice";
import { sendPrompt } from "../features/agent.api";
import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { createConversation, updateConversations } from "../features/conversation.api";
import { addConversation, setConvTitle, setSelectedConversation } from "../redux/conversationSlice";
import { useRef } from "react";

export default function ChatInput({
  setBanner
}) {
  // state to hold the selected agent
  const [selectedAgent, setSelectedAgent] = useState("auto");

  // state to hold the input value
  const [value, setValue] = useState("");

  // state to hold the input value and whether the mic is listening
  const [isListening, setIsListening] = useState(false);

  // ref to hold the speech recognition instance provided by js
  const recognitionRef = useRef(null);

  const dispatch = useDispatch();

  // get the selected conversation and loading state from the redux store
  const { selectedConversation } = useSelector(state => state.conversation);

  // get the loading state from the redux store
  const { isLoading } = useSelector(state => state.message);

  // ref to hold the file input element
  const fileRef = useRef(null);

  // state to hold the selected file (PDF or image)
  const [selectedFile, setSelectedFile] = useState(null);

  // placeholders for the input field based on the selected agent
  const placeholders = {

    auto: "Ask orbit...",

    chat: "Chat with orbit...",

    coding: "Describe the software you want...",

    pdf: "Generate a PDF about...",

    ppt: "Create a presentation about...",

    image: "Describe the image...",

    search: "Search the web..."

  };

  // list of agents with their id, icon, and label
  const agents = [

    {
      id: "auto",
      icon: Zap,
      label: "Auto"
    },

    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat"
    },

    {
      id: "coding",
      icon: Code2,
      label: "Coding"
    },

    {
      id: "pdf",
      icon: FileText,
      label: "PDF"
    },

    {
      id: "ppt",
      icon: Presentation,
      label: "PPT"
    },

    {
      id: "image",
      icon: ImageIcon,
      label: "Image"
    },

    {
      id: "search",
      icon: Globe,
      label: "Search"
    }

  ];

  // useEffect to initialize the speech recognition instance and set up event listeners
  useEffect(() => {

    // check if the browser supports js speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    // create a new instance of speech recognition
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    // event listener for when the speech recognition returns a result
    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setValue(transcript);

    };

    // event listener for when the speech recognition ends
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

  }, []);

  // function to toggle the speech recognition on and off
  const toggleMic = () => {

    // check if the speech recognition instance is available
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    else {
      recognitionRef.current.start();
      setIsListening(true);
    }

  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  // function to handle sending the prompt to the backend and updating the redux store with the response
  const handleSend = async () => {

    const prompt = value.trim();
    if (!prompt) return;

    dispatch(setIsLoading(true));

    try {
      let conversation = selectedConversation;
      if (!conversation) {
        const newConversation = await createConversation();
        dispatch(addConversation(newConversation));
        dispatch(setSelectedConversation(newConversation));
        conversation = newConversation;
      }

      if (conversation.title === "New Chat") {
        await updateConversations(conversation._id, prompt.slice(0, 40));
        dispatch(setConvTitle({ conversationId: conversation._id, title: prompt.slice(0, 40) }));
      }

      dispatch(addMessage({ role: "user", content: prompt }));
      setValue("");

      // create a new FormData object to send the prompt and selected file to the backend
      const formData = new FormData();

      // append the conversation ID, prompt, selected agent, and selected file (if any) to the FormData object
      formData.append("conversationId", conversation._id);
      formData.append("prompt", prompt);
      formData.append("agent", selectedAgent);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // clear the selected file state after sending the prompt
      setSelectedFile(null)

      // send the FormData object to the backend and wait for the response
      const data = await sendPrompt(formData);
      console.log(data)
      dispatch(
        addMessage({
          role: "assistant",
          content: data.answer,
          images: data.images
        })
      );

      // console.log(data)

      if (data.artifacts) {
        dispatch(
          setArtifacts(data.artifacts)
        );
      }

    }
    catch (error) {
      setBanner({
        open: true,
        title: error.response?.data?.title || "Something went wrong",
        message: error.response?.data?.message || "Please try again."
      });
    }
    finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] surface">
      {/* Composer surface uses theme `surface` for consistent background */}

      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">


        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">

          {agents.map((agent) => {

            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;

            return (

              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`
            flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all

            ${isActive
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-[0_1px_8px_rgba(99,102,241,.35)]"
                    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
                  }
          `}
              >

                <Icon
                  size={14}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  }
                />

                {agent.label}

              </button>

            );

          })}


        </div>

        {/* Show selected file */}
        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              {
                selectedFile.type === "application/pdf"
                  ?
                  <FileText size={16} className="text-red-400" />
                  :
                  selectedFile?.type.startsWith("image/") &&
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    className="h-10 w-10 rounded-xl object-cover mt-3"
                  />
              }

              {/* show file name and size */}
              <div>
                <p className="text-xs text-white">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {Math.ceil(selectedFile.size / 1024)}
                  KB
                </p>
              </div>

              {/* Remove file button */}
              <button
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = "";
                }}
                className="ml-2"
              >
                <X
                  size={14}
                  className="text-slate-500 hover:text-white"
                />
              </button>

            </div>
          </div>
        )
        }

        {/* Textarea */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholders[selectedAgent]}
          rows={3}
          disabled={isLoading}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between">

          {/* Left — attach + mic */}
          <div className="flex items-center gap-1">
            <input
              ref={fileRef}
              type="file"
              hidden
              accept=".pdf,image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}

            />
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400
             hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer"
              onClick={() => fileRef.current.click()}
            >
              <Paperclip size={14} />
            </button>
            <button

              onClick={toggleMic}

              className={` flex  items-center  justify-center  w-8  h-8  rounded-lg  transition-all  cursor-pointer 
                ${isListening ? "bg-red-500 text-white" : "text-slate-600 hover:bg-white/[0.05]"} `}>

              {isListening ? <MicOff size={14} /> : <Mic size={14} />}

            </button>
          </div>

          {/* Right — send / stop */}
          <button
            onClick={handleSend}
            disabled={!isLoading && !value.trim()}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150
              ${isLoading
                ? "bg-white text-[#0d0f14] hover:bg-slate-200"
                : value.trim()
                  ? "bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 text-white"
                  : "bg-white/[0.05] text-slate-600 cursor-not-allowed"
              }`}
          >
            {isLoading ? <Square size={12} fill="currentColor" /> : <Send size={14} />}
          </button>

        </div>
      </div>

      <p className="text-center text-[10.5px] text-slate-700 mt-2.5">
        orbit can make mistakes. Verify important info.
      </p>

    </div>
  );
}