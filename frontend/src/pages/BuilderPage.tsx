import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FileExplorer } from "../components/FileExplorer";
import { StatusCard } from "../components/StatusCard";
import { CodePreview } from "../components/CodePreview";
import { BuildStatus, FileItem,  Step, StepType } from "../types";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { parseXml } from "../steps";

export const BuilderPage: React.FC = () => {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [templateSet, setTemplateSet] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // to see the steps of how the app is building...
  const [steps, setSteps] = useState<Step[]>([]);

  // to set the items of the files fetched from templage endpoint...
  const [files, setFiles] = useState<FileItem[]>([]);

  const buildStatus: BuildStatus[] = [
    { status: "building", message: "Analyzing prompt..." },
    { status: "completed", message: "Generated project structure" },
  ];

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
    console.log(files);
  }, [steps, files]);

  async function init() {
    console.log("called init function ");
    const response = await axios.post(`${BACKEND_URL}/template`, {
      prompt: prompt.trim(),
    });
    setTemplateSet(true);
    const { prompts, uiPrompts } = response.data;
    console.log(
      "⚡ responses recieved from template end point now moving to chat"
    );
    setSteps(
      parseXml(uiPrompts[0]).map((x: Step) => ({
        ...x,
        status: "pending",
      }))
    );
    setLoading(true);

    console.log("😭  calling chat end point");
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map((part) => ({
        role: "user",
        parts: [
          {
            text: part,
          },
        ],
      })),
    });
    setLoading(false)
    console.log("✅ stepsResponse chat : ", stepsResponse.data);

    
  }

  // const filess: FileStructure[] = [
  //   {
  //     name: "src",
  //     type: "directory",
  //     children: [
  //       { name: "App.tsx", type: "file", content: 'console.log("Hello")' },
  //       { name: "index.css", type: "file", content: "/* styles */" },
  //       {
  //         name: "components",
  //         type: "directory",
  //         children: [
  //           {
  //             name: "Button.tsx",
  //             type: "file",
  //             content: "// Button component",
  //           },
  //           { name: "Card.tsx", type: "file", content: "// Card component" },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     name: "public",
  //     type: "directory",
  //     children: [
  //       { name: "index.html", type: "file", content: "<!DOCTYPE html>" },
  //     ],
  //   },
  // ];

  return (
    <div className="h-screen flex bg-notion-darker">
      {/* Sidebar */}
      <div className="w-64 bg-notion-dark border-r border-notion-border p-4 space-y-6">
        <div className="space-y-4">
          {buildStatus.map((status, index) => (
            <StatusCard key={index} status={status} />
          ))}
        </div>
        <FileExplorer files={files} onFileSelect={setSelectedFile} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-notion-border bg-notion-dark">
          <div className="flex space-x-4 p-4">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "code"
                  ? "bg-notion-accent text-white"
                  : "text-notion-text hover:bg-notion-subtle"
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "preview"
                  ? "bg-notion-accent text-white"
                  : "text-notion-text hover:bg-notion-subtle"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => init()}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "preview"
                  ? "bg-notion-accent text-white"
                  : "text-notion-text hover:bg-notion-subtle"
              }`}
            >
              Init Calling
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 bg-notion-darker">
          {activeTab === "code" && selectedFile?.content ? (
            <CodePreview
              code={selectedFile.content}
              language={
                selectedFile.name.endsWith("tsx") ? "typescript" : "javascript"
              }
            />
          ) : activeTab === "preview" ? (
            <div className="h-full bg-notion-dark rounded-lg shadow-inner p-4">
              <iframe
                className="w-full h-full border-0"
                src="about:blank"
                title="Website Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-notion-dimmed">
              Select a file to view its contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
