const createFeatureDecisions = (features = []) => {
  return {
    includeArticleShareFeature(){
      return features.includes("article-share-feature");
    },
    includeArticleStatisticsFeature(){
      return features.includes("article-statistics-feature");
    },
    // ... additional decision functions also live here ...
  };
}

export default createFeatureDecisions