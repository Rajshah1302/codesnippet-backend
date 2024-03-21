// languageUtils.js

function getLanguageId(languageName) {
    const languageMap = {
      "C++": 54,
      "C": 50,
      "Java": 62,
      "Python": 71
      // Add more language mappings as needed
    };
    return languageMap[languageName];
  }
  
  module.exports = {
    getLanguageId
  };
  