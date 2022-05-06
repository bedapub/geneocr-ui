
import './App.css';
import FileCropComponent from './components/file-crop.component';
import FileUploadComponent from './components/file-upload.component';
import TextAnalyzeComponent from './components/text-analyze.component';
import { StateContext } from "./state";
import { useContext, useEffect, useState } from "react";
import ReadGeneLogo from "./dna.svg"
import { IconButton, Tooltip } from '@mui/material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

enum AreaSetting {
  DEFAULT,
  EXPANDED
}

function App() {

  const { serviceInstance } = useContext(StateContext)
  const [editing, setEditing] = useState<boolean>();
  const [areaSettings, setAreaSettings] = useState<any>({
    editing: AreaSetting.DEFAULT,
    analyzing: AreaSetting.DEFAULT
  });

  const changeAreaSetting = (area: string, setting: AreaSetting) => {
    const copyAreaSettings = Object.assign({}, areaSettings);
    copyAreaSettings[area] = setting;
    setAreaSettings(copyAreaSettings);
  }

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
              <img src={ReadGeneLogo} className="mr-4 h-6 sm:h-9" alt="GeneOCR Logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">GeneOCR</span>
            </div>

          </div>
        </nav>
      </div>
      <div className="px-2.5 flex flex-row">
        <div className={`${areaSettings.analyzing === AreaSetting.DEFAULT ? areaSettings.editing === AreaSetting.EXPANDED ? 'expanded-area-app' : 'w-1/2' : 'collapsed-area-app'} px-2.5 area-app`}>
          <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className={`text-xl font-medium flex flex-row justify-between ${areaSettings.analyzing === AreaSetting.DEFAULT ? 'visible' : 'invisible'}`}>
              <div>
                Uploading & editing
              </div>
              <div>
                {areaSettings.editing === AreaSetting.DEFAULT && (
                  <Tooltip title="Expand area">
                    <IconButton onClick={(_) => changeAreaSetting('editing', AreaSetting.EXPANDED)} aria-label="openfull"
                     disabled={areaSettings.analyzing === AreaSetting.EXPANDED}>
                      <OpenInFullIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {areaSettings.editing === AreaSetting.EXPANDED && (
                  <Tooltip title="Collapse area">
                    <IconButton onClick={(_) => changeAreaSetting('editing', AreaSetting.DEFAULT)} aria-label="opendefault">
                      <CloseFullscreenIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
            <div  className={`mt-2.5 ${areaSettings.analyzing === AreaSetting.DEFAULT ? 'visible' : 'invisible'}`}>
              {editing && <FileUploadComponent />}
              {!editing && <FileCropComponent />}
            </div>
          </div>
        </div>
        <div className={`${areaSettings.editing === AreaSetting.DEFAULT ? areaSettings.analyzing === AreaSetting.EXPANDED ? 'expanded-area-app' : 'w-1/2' : 'collapsed-area-app'} px-2.5 area-app`}>
          <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <div className={`text-xl font-medium flex flex-row justify-between ${areaSettings.editing === AreaSetting.DEFAULT ? 'visible' : 'invisible'}`}>
              <div>
                Analyzing
              </div>
              <div>
                {areaSettings.analyzing === AreaSetting.DEFAULT && (
                  <Tooltip title="Expand area">
                    <IconButton onClick={(_) => changeAreaSetting('analyzing', AreaSetting.EXPANDED)} aria-label="openfull"
                    disabled={areaSettings.editing === AreaSetting.EXPANDED}>
                      <OpenInFullIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {areaSettings.analyzing === AreaSetting.EXPANDED && (
                  <Tooltip title="Collapse area">
                    <IconButton onClick={(_) => changeAreaSetting('analyzing', AreaSetting.DEFAULT)} aria-label="opendefault">
                      <CloseFullscreenIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className={`mt-2.5 ${areaSettings.editing === AreaSetting.DEFAULT ? 'visible' : 'invisible'}`}>
              <TextAnalyzeComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
