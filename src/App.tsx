import React from "react";
import './App.css';
import FileCropComponent from './components/file-crop.component';
import FileUploadComponent from './components/file-upload.component';
import TextAnalyzeComponent from './components/text-analyze.component';
import { StateContext } from "./state";
import { useContext, useEffect, useState } from "react";
import ReadGeneLogo from "./dna.svg";

enum AreaSetting {
  DEFAULT,
  EXPANDED
}

function App() {

  const { serviceInstance } = useContext(StateContext);
  const [editing, setEditing] = useState<boolean>();
  const [areaSettings, setAreaSettings] = useState<'editing' | 'analyzing'>('editing');

  useEffect(() => {
    const subscriptionEditing = serviceInstance.getEditingImage.subscribe(setEditing);
    const subscriptionAreaSetting = serviceInstance.getAreaSetting.subscribe(setAreaSettings);
    return () => { subscriptionEditing.unsubscribe(); subscriptionAreaSetting.unsubscribe(); }
  }, [serviceInstance])

  return (
    <div className="px-auto">
      <div>
        <nav className="bg-white border m-5 border-gray-200 px-2 sm:px-4 p-5 rounded dark:bg-gray-800">
          <div className="container flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <img src={ReadGeneLogo} className="mr-4 h-6 sm:h-9" alt="GeneOCR Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">GeneOCR</span>
            </div>
          </div>
        </nav>
      </div>
      <div className="px-2.5 flex flex-row">
        <div className={`px-2.5 w-full`}>
          <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className={`text-xl font-medium flex flex-row justify-between border-gray-200 border-solid border rounded-md`}>
              <ul className="hidden w-full text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                <li className="w-full">
                  <button onClick={() => setAreaSettings('editing')} className={`inline-block p-4 w-full focus:ring-4 focus:ring-blue-300 focus:outline-none ${areaSettings === 'analyzing' ? 'bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700': 'text-gray-900 bg-gray-100 rounded-l-lg active dark:bg-gray-700 dark:text-white'}`}>Upload & editing</button>
                </li>
                <li className="w-full">
                  <button onClick={() => setAreaSettings('analyzing')} className={`inline-block p-4 w-full focus:ring-4 focus:ring-blue-300 focus:outline-none ${areaSettings === 'analyzing' ? 'text-gray-900 bg-gray-100 rounded-r-lg  active  dark:bg-gray-700 dark:text-white': 'bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'}`}>Analysis</button>
                </li>
              </ul>
            </div>
            <div className={`mt-2.5 ${areaSettings !== 'editing' ? 'hidden-element' : undefined}`}>
              {editing && <FileUploadComponent />}
              {!editing && <FileCropComponent />}
            </div>
            <div className={`mt-2.5 ${areaSettings !== 'analyzing' ? 'hidden-element' : undefined}`}>
              <TextAnalyzeComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
