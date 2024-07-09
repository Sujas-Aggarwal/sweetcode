"use client";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

function Page() {
    const [codeValues, setCodeValues] = React.useState({
        JS: "",
        CPP: "",
        PY: "",
    });
    React.useEffect(() => {
        const data = localStorage.getItem("codeValues");
        if (data) {
            setCodeValues(JSON.parse(data));
        }
        const defaultFileName = localStorage.getItem("defaultFileName");
        if (defaultFileName) {
            setFileName(defaultFileName as FileType);
        }
    }, []);
    //on pressing ctrl+S, save the code to local storage
    function handleSave(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault();
            localStorage.setItem("codeValues", JSON.stringify(codeValues));
            toast.success("Code Saved Successfully", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    }
    React.useEffect(() => {
        window.addEventListener("keydown", handleSave);
        return () => window.removeEventListener("keydown", handleSave);
    }, [codeValues]);

    const [files, setFiles] = React.useState({
        JS: {
            name: "script.js",
            language: "javascript",
            value: codeValues.JS,
            default: `console.log("Hail Sujas!");`,
            output: "Click Run to Execute",
        },
        CPP: {
            name: "main.cpp",
            language: "cpp",
            value: codeValues.CPP,
            default: `#include <iostream>;\nusing namespace std;\nint main(){\n\tcout << "Hail Sujas!";\n\treturn 0;\n}`,
            output: "Click Run to Execute",
        },
        PY: {
            name: "main.py",
            language: "python",
            value: codeValues.PY,
            default: `print("Hail Sujas!")`,
            output: "Click Run to Execute",
        },
    });
    enum FileType {
        JS = "JS",
        CPP = "CPP",
        PY = "PY",
    }
    const [fileName, setFileName] = React.useState<FileType>(FileType.JS);
    //save the filename in localstorage before the user closes the tab
    React.useEffect(() => {
        function handleUnload() {
            localStorage.setItem("defaultFileName", fileName);
            localStorage.setItem("codeValues", JSON.stringify(codeValues));
        }
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [fileName]);

    const file: {
        name: string;
        language: string;
        value: string;
        default: string;
        output: string;
    } = files[fileName];
    function handleEditorChange(value: string | undefined, event: any) {
        setCodeValues((prev) => ({
            ...prev,
            [fileName]: value,
        }));
    }
    return (
        <div>
            <div className="bg-[rgb(40,40,40)] pt-2 px-1 flex h-[5vh] min-h-[40px]">
                <button
                    className="bg-[rgb(50,50,50)] disabled:bg-[rgb(10,10,10)] p-1 px-6 rounded-t-xl mr-[2px]"
                    disabled={fileName === FileType.JS}
                    onClick={() => setFileName(FileType.JS)}
                >
                    {files[FileType.JS].name}
                </button>
                <button
                    className="bg-[rgb(50,50,50)] disabled:bg-[rgb(10,10,10)] p-1 px-6 rounded-t-xl mr-[2px]"
                    disabled={fileName === FileType.CPP}
                    onClick={() => setFileName(FileType.CPP)}
                >
                    {files[FileType.CPP].name}
                </button>
                <button
                    className="bg-[rgb(50,50,50)] disabled:bg-[rgb(10,10,10)] p-1 px-6 rounded-t-xl mr-[2px]"
                    disabled={fileName === FileType.PY}
                    onClick={() => setFileName(FileType.PY)}
                >
                    {files[FileType.PY].name}
                </button>
                <div className="ml-auto self-center font-bold p-4 flex  gap-2">
                    <button
                        onClick={async () => {
                            await axios
                                .post("/api/execute", {
                                    language: fileName.toLowerCase(),
                                    code:
                                        codeValues[fileName] ||
                                        files[fileName].default,
                                })
                                .then((res) => {
                                    setFiles((prev) => ({
                                        ...prev,
                                        [fileName]: {
                                            ...prev[fileName],
                                            output: res.data.output,
                                        },
                                    }));
                                    if (files[fileName].output == "") {
                                        setFiles((prev) => ({
                                            ...prev,
                                            [fileName]: {
                                                ...prev[fileName],
                                                output: res.data.stderr.slice(135),
                                            },
                                        }));
                                    }
                                })
                                .catch((err) => {
                                    setFiles((prev) => ({
                                        ...prev,
                                        [fileName]: {
                                            ...prev[fileName],
                                            output: err.response.data.error,
                                        },
                                    }));
                                });
                        }}
                        className="p-[6px] bg-gray-900 px-8 rounded-md active:bg-gray-800"
                    >
                        RUN
                    </button>
                </div>
            </div>
            <Editor
                height="95vh"
                theme="vs-dark"
                path={file.name}
                defaultLanguage={file.language}
                defaultValue={file.value || file.default}
                onChange={handleEditorChange}
            />
            <div className="absolute p-4 overflow-auto bg-[rgb(10,10,10)] border-1 border-white z-[999] bottom-0 left-0 w-full h-[30vh]">
                <pre className="text-green-400">Terminal</pre>
                <pre>{file.output}</pre>
            </div>
        </div>
    );
}

export default Page;
