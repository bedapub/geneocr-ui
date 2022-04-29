
import './App.css';
import FileCropComponent from './components/file-crop.component';
import FileUploadComponent from './components/file-upload.component';
import TextAnalyzeComponent from './components/text-analyze.component';
import { StateContext } from "./state";
import { useContext, useEffect, useState } from "react";
import ReadGeneLogo from "./dna.svg"


function App() {

  const { serviceInstance } = useContext(StateContext)
  const [editing, setEditing] = useState();

  useEffect(() => {
    const subscription = serviceInstance.getEditingImage.subscribe(setEditing)
    return () => subscription.unsubscribe()
  }, [serviceInstance])

  return (
    <div className="px-auto">
      <div>
        <nav className="bg-white border m-5 border-gray-200 px-2 sm:px-4 p-5 rounded dark:bg-gray-800">
          <div className="container flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <img src={ReadGeneLogo} className="mr-4 h-6 sm:h-9" alt="GeneRead Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">GeneRead</span>
            </div>

          </div>
        </nav>

      </div>
      <div className="px-2.5 flex flex-row">
        <div className="w-1/2 px-2.5">
          <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className="text-xl font-medium">Uploading & editing</div>
            <div className="mt-2.5">
              {editing && <FileUploadComponent />}
              {!editing && <FileCropComponent />}
            </div>
          </div>
        </div>
        <div className="w-1/2 px-2.5">
          <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className="text-xl font-medium">Analyzing</div>
            <div className="mt-2.5">
              <TextAnalyzeComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
