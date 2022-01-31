
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