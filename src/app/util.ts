
export function getEmojiFrequency(freqMap: any,str: string) {
    // console.log(str);
    for (let character of str) {
        if (character.length === 1 && character != '❤') continue;
        // console.log('EMOJI-> ',character);
        if (freqMap[character]) {
            freqMap[character]++;
        } else {
            freqMap[character] = 1;
        }
    }
};


export const getWordCount = (wordMap: Map<string, number>, str: string) => {
  const words = str.split(/[,\. ]+/g);
  for (let word of words) {
    if (wordMap.has(word)) {
      wordMap.set(word, wordMap.get(word) + 1);
    } else {
      wordMap.set(word, 1);
    }
  }
};