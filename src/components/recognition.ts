declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof webkitSpeechRecognition;
        SpeechGrammarList: typeof SpeechGrammarList;
        webkitSpeechGrammarList: typeof webkitSpeechGrammarList;
    }
}

const SpeechRecognitionUniversal =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const SpeechGrammarListUniversal =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;

export enum RecognitionCommands {
    AddMemo = 'add memo',
    SaveMemo = 'save memo',
}

const commands = [RecognitionCommands.AddMemo, RecognitionCommands.SaveMemo];
const grammar = `#JSGF V1.0; grammar commands; public <command> = ${commands.join(
    ' | ',
)};`;

console.log('grammar', grammar);

const recognition = new SpeechRecognitionUniversal();
const speechRecognitionList = new SpeechGrammarListUniversal();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export { recognition };
