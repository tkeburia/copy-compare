import { useState, useEffect, SetStateAction, Dispatch, useRef } from "react";
import "../index.css";

type UseApiResult = [
  {
    newText: string;
    oldText: string;
    diffVisible: boolean;
    loading: boolean;
  },
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<boolean>>
];

const useApi = (): UseApiResult => {
  const [newText, setNewText] = useState<string>("");
  const [oldText, setOldText] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [diffVisible, setDiffVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const initialLoad = useRef(true);

  useEffect(() => {
    const doFetch = async () => {
      const apiUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/?articleSlug=${slug}`;
      setLoading(true);
      const result: { new: string; old: string } = await (
        await fetch(apiUrl)
      ).json();
      setNewText(result.new);
      setOldText(result.old);
      setLoading(false);
      setDiffVisible(true);
    };

    if (!initialLoad.current) {
      doFetch();
    } else {
      initialLoad.current = false;
    }
  }, [slug]);

  return [
    { newText, oldText, diffVisible, loading },
    setSlug,
    setNewText,
    setOldText,
    setDiffVisible,
  ];
};

export default useApi;
