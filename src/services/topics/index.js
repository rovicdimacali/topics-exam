import axios from "axios";

export const topicsService = {
  getTopics: async () => {
    const response = await axios.get(
      "https://atillc.blob.core.windows.net/data-collector/icode/test-data/topics.json"
    );
    return response.data;
  },
};
