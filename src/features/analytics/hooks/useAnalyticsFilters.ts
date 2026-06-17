import { useState } from "react";

export function useAnalyticsFilters() {
  const [keywords, setKeywords] = useState("artificial intelligence,machine learning");
  const [keyword, setKeyword] = useState("machine learning");
  const [entityId, setEntityId] = useState("");
  const [startYear, setStartYear] = useState(2018);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  return { keywords, setKeywords, keyword, setKeyword, entityId, setEntityId, startYear, setStartYear, endYear, setEndYear };
}
