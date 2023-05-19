import { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import "./App.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import DiffViewer from "react-diff-viewer-continued";
import useApi from "./hooks/useApi";

import { TextField } from "@mui/material";

function App() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [
    { newText, oldText, diffVisible, loading },
    setSlug,
    setNewText,
    setOldText,
    setDiffVisible,
  ] = useApi();

  const resetState = () => {
    setSlugs([]);
    setIndex(0);
    setNewText("");
    setOldText("");
    setDiffVisible(false);
  };

  return (
    <div className="App">
      <div className="controls">
        <TextField
          disabled={diffVisible}
          label="Paste your slugs here"
          value={slugs.join("\n")}
          id="slug"
          type="text"
          multiline
          rows={diffVisible ? 1 : 30}
          onChange={(event) => setSlugs(event.target.value.split("\n"))}
        />
        <Button
          variant="outlined"
          onClick={() => setSlug(slugs[index])}
          disabled={diffVisible}
        >
          Fetch
        </Button>
        <Button variant="outlined" onClick={() => resetState()}>
          Reset
        </Button>
        {diffVisible && (
          <Button
            className="arrows"
            disabled={index <= 0}
            variant="outlined"
            startIcon={<ArrowLeftIcon />}
            onClick={async () => {
              setSlug(slugs[index - 1]);
              setIndex(() => index - 1);
            }}
          />
        )}
        {diffVisible && (
          <Button
            className="arrows"
            disabled={index + 1 >= slugs.length}
            variant="outlined"
            startIcon={<ArrowRightIcon />}
            onClick={async () => {
              setSlug(slugs[index + 1]);
              setIndex(index + 1);
            }}
          />
        )}
      </div>
      <div className="details">
        <h3>{slugs[index]} </h3>
        <span>
          ({index + 1}/{slugs.length})
        </span>
      </div>
      {loading ? (
        <LinearProgress />
      ) : (
        <DiffViewer
          newValue={newText}
          oldValue={oldText}
          leftTitle="OLD"
          rightTitle="NEW"
        />
      )}
    </div>
  );
}

export default App;
