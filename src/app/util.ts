
export function getEmojiFrequency(freqMap: any,str: string) {
    for (let character of str) {
        if (character.length === 1 && character != '❤') continue;
        if (freqMap[character]) {
            freqMap[character]++;
        } else {
            freqMap[character] = 1;
        }
    }
};