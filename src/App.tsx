import React, { useEffect, useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import "./App.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import DiffViewer from "react-diff-viewer-continued";

import { TextField } from "@mui/material";

function App() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [newText, setNewText] = useState<string>("");
  const [oldText, setOldText] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [diffVisible, setDiffVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    const apiUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/?articleSlug=${slugs[index]}`;

    setLoading(true);
    const result: { new: string; old: string } = await (
      await fetch(apiUrl)
    ).json();

    setNewText(result.new);
    setOldText(result.old);
    setLoading(false);
    setDiffVisible(true);
  };

  const resetState = () => {
    setSlugs([]);
    setNewText("");
    setOldText("");
    setDiffVisible(false);
    setIndex(0);
  };

  useEffect(() => {
    if (slugs.length > 0) {
      fetchData();
    }
  }, [index]);

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
          onClick={() => fetchData()}
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
            onClick={() => setIndex(index - 1)}
          />
        )}
        {diffVisible && (
          <Button
            className="arrows"
            disabled={index + 1 >= slugs.length}
            variant="outlined"
            startIcon={<ArrowRightIcon />}
            onClick={() => setIndex(index + 1)}
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
